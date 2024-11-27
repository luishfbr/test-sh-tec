import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../services/prisma";
import { ListRideService } from "../services/ListRidesService";

class ListRidesController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { customer_id } = request.params as { customer_id: string };
    const { driver_id } = request.query as { driver_id?: number };

    if (!customer_id) {
      return reply.status(400).send({ error: "ID do usuário não encontrado!" });
    }

    if (driver_id) {
      const driver = await prisma.driver.findUnique({
        where: {
          id: driver_id,
        },
      });

      if (!driver) {
        return {
          status: 400,
          description: "Motorista inválido",
          response: {
            error_code: "INVALID_DRIVER",
            error_description: "Motorista inválido",
          },
        };
      }
    }

    const ListRides = new ListRideService();
    const response = await ListRides.execute({ customer_id, driver_id });
    reply.send(response);
  }
}

export { ListRidesController };
