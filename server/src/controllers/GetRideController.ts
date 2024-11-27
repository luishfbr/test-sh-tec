import { FastifyRequest, FastifyReply } from "fastify";
import { GetRide } from "../services/GetRideService";

class GetRideController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { origin, destination, customer_id } = request.body as {
      origin: string;
      destination: string;
      customer_id: string;
    };

    if (!origin || !destination) {
      return {
        status: 400,
        description: "Os campos de origem e destino são obrigatórios!",
        response: {
          error_code: "INVALID_DATA",
          error_description: "Os campos de origem e destino são obrigatórios!",
        },
      };
    }

    if (!customer_id) {
      return {
        status: 400,
        description: "ID do usuário não encontrado!",
        response: {
          error_code: "INVALID_ID",
          error_description: "ID do usuário não encontrado!",
        },
      };
    }

    if (origin === destination) {
      return {
        status: 400,
        description: "Os endereços de origem e destino não podem ser o mesmo.",
        response: {
          error_code: "INVALID_ADDRESS",
          error_description:
            "Os endereços de origem e destino não podem ser o mesmo.",
        },
      };
    }

    const getRide = new GetRide();
    const response = await getRide.execute({
      customer_id,
      origin,
      destination,
    });
    reply.send(response);
  }
}

export { GetRideController };
