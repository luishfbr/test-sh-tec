import Fastify from "fastify";
import { routes } from "./routes";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import path from "path";
import { seed } from "./services/seed";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const googleApiKey = process.env.GOOGLE_API_KEY;

const app = Fastify({
  logger: true,
});

const start = async () => {
  await app.register(cors);
  await app.register(routes);
  try {
    await app.listen({
      port: 8080,
      host: "0.0.0.0",
    });
  } catch (error) {
    process.exit(1);
  }
};

start();

const seedData = async () => {
  await seed();
};

const res = seedData();
console.log(res);

export default googleApiKey;
