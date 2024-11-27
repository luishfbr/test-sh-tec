import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { GetRideController } from "./controllers/GetRideController";
import { ConfirmRideController } from "./controllers/ConfirmRideController";
import { ListRidesController } from "./controllers/ListRidesController";
import { GetApiController } from "./controllers/GetApiController";

export async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  //GetApiKey
  fastify.get(
    "/api/config",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetApiController().handle(request, reply);
    }
  );

  //Primeiro Endpoint
  fastify.post(
    "/ride/estimate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetRideController().handle(request, reply);
    }
  );

  //Segundo Endpoint
  fastify.patch(
    "/ride/confirm",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ConfirmRideController().handle(request, reply);
    }
  );

  //Terceiro Endpoint
  fastify.get(
    "/ride/:customer_id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            customer_id: { type: "string" },
          },
          required: ["customer_id"],
        },
        querystring: {
          type: "object",
          properties: {
            driver_id: { type: "number" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListRidesController().handle(request, reply);
    }
  );
}
