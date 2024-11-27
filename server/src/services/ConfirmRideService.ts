import { prisma } from "../services/prisma";
import type { ConfirmRideProps } from "../utils/types";

class ConfirmRideService {
  async execute(data: ConfirmRideProps) {
    try {
      const verifyDriver = await prisma.driver.findUnique({
        where: {
          id: data.driver.id,
        },
      });

      if (!verifyDriver) {
        return {
          status: 404,
          description: "Motorista não encontrado",
          response: {
            error_code: "DRIVER_NOT_FOUND",
            error_description: "Motorista não encontrado",
          },
        };
      }

      if (verifyDriver.minKM > data.distance / 1000) {
        return {
          status: 406,
          description: "Quilometragem inválida para o motorista",
          response: {
            error_code: "INVALID_DISTANCE",
            error_description: "Quilometragem inválida para o motorista",
          },
        };
      }

      const ride = await prisma.ride.create({
        data: {
          customer_id: data.customer_id,
          origin: data.origin,
          destination: data.destination,
          distance: data.distance,
          duration: data.duration,
          driverId: data.driver.id,
          value: data.value,
        },
      });

      return {
        status: 200,
        description: "Operação realizada com sucesso!",
        response: {
          sucess: true,
        },
      };
    } catch (error) {
      return {
        status: 400,
        description:
          "Os dados fornecidos no corpo da requisição são inválidos.",
        response: {
          error_code: "INVALID_DATA",
          error_description:
            "Os dados fornecidos no corpo da requisição são inválidos.",
        },
      };
    }
  }
}

export { ConfirmRideService };
