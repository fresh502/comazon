import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import * as dotenv from "dotenv";
import {
  CreateUser,
  PatchUser,
  CreateProduct,
  PatchProduct,
} from "./structs.js";

dotenv.config();

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log("Error occured");
      console.log(e.name);
      if (e.name === "StructError") {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

// users
app.get("/users", async (req, res) => {
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
  });
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  // Destructuring assignment
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.send(user);
});

app.post(
  "/users",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateUser);
    const user = await prisma.user.create({ data: req.body });
    res.status(201).send(user);
  })
);

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  assert(req.body, PatchUser);
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.send(user);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.send("Success delete");
});

// products
app.get("/products", async (req, res) => {
  const { offset = 0, limit = 10, order, category } = req.query;
  let orderBy;
  switch (order) {
    case "priceLowest":
      orderBy = { price: "asc" };
      break;
    case "priceHighest":
      orderBy = { price: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
    default:
      orderBy = { createdAt: "desc" };
  }
  const where = category ? { category } : {};
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  console.log(products);
  res.send(products);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  console.log(product);
  res.send(product);
});

app.post("/products", async (req, res) => {
  assert(req.body, CreateProduct);
  const product = await prisma.product.create({
    data: req.body,
  });
  res.send(product);
});

app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  assert(req.body, PatchProduct);
  const product = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.send(product);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id },
  });
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
