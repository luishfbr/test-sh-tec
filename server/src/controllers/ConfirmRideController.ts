import { FastifyRequest, FastifyReply } from "fastify";
import { ConfirmRideService } from "../services/ConfirmRideService";
import { ConfirmRideProps } from "../utils/types";

class ConfirmRideController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as ConfirmRideProps;

    if (!data.origin || !data.destination) {
      return reply.status(400).send({
        error: "Os endereços de origem e destino não podem estar em branco.",
      });
    }

    if (!data.customer_id) {
      return reply
        .status(400)
        .send({ error: "O id do usuário não pode estar em branco." });
    }

    if (data.origin === data.destination) {
      return reply.status(400).send({
        error:
          "Os endereços de origem e destino não podem ser o mesmo endereço.",
      });
    }

    const ConfirmRide = new ConfirmRideService();
    const response = await ConfirmRide.execute(data);
    reply.send(response);
  }
}

export { ConfirmRideController };
