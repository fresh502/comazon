import express from "express";
import asyncHandler from "../async-handler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateUser, PatchUser, CreateSavedProduct } from "../structs.js";

const prisma = new PrismaClient();
const userRouter = express.Router();

userRouter
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = "newest" } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
          orderBy = { createdAt: "desc" };
        default:
          orderBy = { createdAt: "desc" };
      }
      const users = await prisma.user.findMany({
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
        include: {
          userPreference: {
            select: {
              receiveEmail: true,
            },
          },
        },
      });
      res.send(users);
    })
  )
  .post(
    asyncHandler(
      asyncHandler(async (req, res) => {
        assert(req.body, CreateUser);
        const { userPreference, ...userFields } = req.body;
        const user = await prisma.user.create({
          data: {
            ...userFields,
            userPreference: {
              create: userPreference,
            },
          },
          include: {
            userPreference: true,
          },
        });
        res.status(201).send(user);
      })
    )
  );

userRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      // Destructuring assignment
      const user = await prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          userPreference: {
            select: {
              receiveEmail: true,
            },
          },
        },
      });
      console.log(user);
      res.send(user);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      assert(req.body, PatchUser);

      const { userPreference, ...userFields } = req.body;
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...userFields,
          userPreference: {
            update: userPreference,
          },
        },
        include: {
          userPreference: true,
        },
      });
      res.send(user);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id },
      });
      res.send("Success delete");
    })
  );

userRouter
  .route("/:id/saved-products")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { savedProducts } = await prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          savedProducts: true,
        },
      });
      res.send(savedProducts);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateSavedProduct);
      const { id: userId } = req.params;
      const { productId } = req.body;

      const savedCount = await prisma.user.count({
        where: {
          id: userId,
          savedProducts: {
            some: { id: productId },
          },
        },
      });

      const condition =
        savedCount > 0
          ? { disconnect: { id: productId } }
          : { connect: { id: productId } };

      const { savedProducts } = await prisma.user.update({
        where: { id: userId },
        data: {
          savedProducts: condition,
        },
        include: {
          savedProducts: true,
        },
      });

      res.send(savedProducts);
    })
  );

userRouter.route("/:id/orders").get(
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orders } = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        orders: true,
      },
    });
    res.send(orders);
  })
);

export default userRouter;
