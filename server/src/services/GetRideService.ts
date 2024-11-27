import { prisma } from "../services/prisma";
import type { GetRideProps, Review } from "../utils/types";
import axios from "axios";
import googleApiKey from "../server";
import type { Driver } from "@prisma/client";

const GOOGLE_ROUTES_API =
  "https://routes.googleapis.com/directions/v2:computeRoutes";

class GetRide {
  async execute({ origin, destination }: GetRideProps) {
    try {
      const requestBody = {
        origin: {
          address: origin,
        },
        destination: {
          address: destination,
        },
        travelMode: "DRIVE",
        computeAlternativeRoutes: false,
      };

      const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googleApiKey,
        "X-Goog-FieldMask":
          "routes.legs.distanceMeters,routes.legs.duration,routes.legs.startLocation,routes.legs.endLocation,routes.legs.polyline.encodedPolyline",
      };

      const response = await axios.post(GOOGLE_ROUTES_API, requestBody, {
        headers,
      });

      if (response.status !== 200) {
        return {
          status: 400,
          description:
            "Os dados fornecidos no corpo da requisição são inválidos",
          response: {
            error_code: "INVALID_DATA",
            error_description:
              "Os dados fornecidos no corpo da requisição são inválidos",
          },
        };
      }

      const { data } = response;

      const distanceInKm = data.routes[0].legs[0].distanceMeters / 1000;

      const drivers = await prisma.driver.findMany({
        orderBy: { value: "asc" },
        where: {
          minKM: {
            lte: distanceInKm,
          },
        },
      });

      const reviews = await prisma.review.findMany({
        where: {
          driverId: {
            in: drivers.map((driver: Driver) => driver.id),
          },
        },
        select: {
          driverId: true,
          rating: true,
          comment: true,
        },
      });

      const driversWithReviews = drivers.map((driver: Driver) => {
        const driverReviews = reviews
          .filter((review) => review.driverId === driver.id)
          .map(({ rating, comment }) => ({
            rating,
            comment,
          }));

        return {
          ...(driver as Driver),
          reviews: driverReviews,
        };
      });

      const options = driversWithReviews.map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        reviews: driver.reviews,
        value: driver.value * distanceInKm,
      }));

      const responseData = {
        origin: {
          latitude:
            response.data.routes[0].legs[0].startLocation.latLng.latitude,
          longitude:
            response.data.routes[0].legs[0].startLocation.latLng.longitude,
        },
        destination: {
          latitude: response.data.routes[0].legs[0].endLocation.latLng.latitude,
          longitude:
            response.data.routes[0].legs[0].endLocation.latLng.longitude,
        },
        distance: data.routes[0].legs[0].distanceMeters,
        duration: data.routes[0].legs[0].duration,
        options,
        routeResponse: data,
      };

      return {
        status: 200,
        description: "Operação realizada com sucesso!",
        response: responseData,
      };
    } catch (error: any) {
      return {
        status: 500,
        description: "Ocorreu um erro ao buscar informações!",
        response: {
          error_code: "INVALID_DATA",
          error_description:
            error.response?.data?.error?.message ||
            error.message ||
            "Erro desconhecido",
        },
      };
    }
  }
}

export { GetRide };
