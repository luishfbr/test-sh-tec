import { FastifyRequest, FastifyReply } from "fastify";

class GetApiController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      reply.status(500).send({ error: "API key is not configured" });
    } else {
      reply.send({ apiKey });
    }
  }
}

export { GetApiController };
