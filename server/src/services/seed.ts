import { prisma } from "./prisma";
import { driversToInsert, reviewsToInsert } from "../utils/data-to-insert";

const seed = async () => {
  await prisma.$transaction([
    prisma.driver.createMany({
      data: driversToInsert,
    }),
    prisma.review.createMany({
      data: reviewsToInsert,
    }),
  ]);
};

export { seed };
