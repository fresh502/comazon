import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// users
app.use("/users", userRouter);

// products
app.use("/products", productRouter);

// app.post(
//   "/orders",
//   asyncHandler(async (req, res) => {
//     assert(req.body, CreateOrder);
//     const { userId, orderItems } = req.body;

//     // 1. get products
//     const productIds = orderItems.map((orderItem) => orderItem.productId);
//     const products = await prisma.product.findMany({
//       where: { id: { in: productIds } },
//     });

//     function getQuantity(productId) {
//       const { quantity } = orderItems.find(
//         (orderItem) => orderItem.productId === productId
//       );
//       return quantity;
//     }

//     // 2. 재고와 주문량 비교
//     const isSuffcientStock = products.every((product) => {
//       const { id, stock } = product;
//       return stock >= getQuantity(id);
//     });

//     // 3. error or create order
//     if (!isSuffcientStock) {
//       throw new Error("Insufficient Stock");
//     }

//     // for (const productId of productIds) {
//     //   await prisma.product.update({
//     //     where: { id: productId },
//     //     data: {
//     //       stock: {
//     //         decrement: getQuantity(productId),
//     //       },
//     //     },
//     //   });
//     // }
//     const queries = productIds.map((productId) =>
//       prisma.product.update({
//         where: { id: productId },
//         data: {
//           stock: {
//             decrement: getQuantity(productId),
//           },
//         },
//       })
//     );

//     const [order] = await prisma.$transaction([
//       prisma.order.create({
//         data: {
//           user: {
//             connect: { id: userId },
//           },
//           orderItems: {
//             create: orderItems,
//           },
//         },
//         include: {
//           orderItems: true,
//         },
//       }),
//       ...queries,
//     ]);
//     res.status(201).send(order);
//   })
// );

// app.get(
//   "/orders/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const order = await prisma.order.findUniqueOrThrow({
//       where: { id },
//       include: {
//         orderItems: true,
//       },
//     });
//     // 1번 방식
//     let total = 0;
//     order.orderItems.forEach(({ unitPrice, quantity }) => {
//       total += unitPrice * quantity;
//     });

//     // 2번 방식
//     // const total = order.orderItems.reduce((acc, { unitPrice, quantity }) => {
//     //   return acc + unitPrice * quantity;
//     // }, 0);

//     order.total = total;
//     res.send(order);
//   })
// );

// app.listen
app.listen(process.env.PORT || 3000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
