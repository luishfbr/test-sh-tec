import { prisma } from "../services/prisma";
import type { ListRideProps } from "../utils/types";

class ListRideService {
  async execute(data: ListRideProps) {
    try {
      const rides = await prisma.ride.findMany({
        where: {
          customer_id: data.customer_id,
          ...(data.driver_id && { driverId: data.driver_id }),
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          date: true,
          origin: true,
          destination: true,
          distance: true,
          duration: true,
          driver: {
            select: {
              id: true,
              name: true,
            },
          },
          value: true,
        },
      });

      if (!rides[0]) {
        return {
          status: 404,
          description: "Nenhum registro encontrado",
          response: {
            error_code: "NO_RIDES_FOUND",
            error_description: "Nenhum registro encontrado",
          },
        };
      }

      return {
        status: 200,
        description: "Operação realizada com sucesso!",
        response: {
          customer_id: data.customer_id,
          rides,
        },
      };
    } catch (error) {
      return {
        status: 500,
        description: "Ocorreu um erro ao realizar a operação",
        response: {
          error_code: "INTERNAL_SERVER_ERROR",
          error_description: "Ocorreu um erro ao realizar a operação",
        },
      };
    }
  }
}

export { ListRideService };
