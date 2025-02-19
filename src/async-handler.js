import { Prisma } from "@prisma/client";

export default function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log("Error occured");
      console.log(e);
      if (
        e.name === "StructError" || // 1.
        (e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002") || // 2.
        e instanceof Prisma.PrismaClientValidationError // 3.
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.status(404).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}
