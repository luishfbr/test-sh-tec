import type { EstimateValueResProps } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Loader2, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import axios from "axios";

interface TravelOptionsProps {
  data: EstimateValueResProps | null;
  customer_id: string;
  origin: string;
  destination: string;
  onCreate: () => void;
}

interface Driver {
  id: number;
  name: string;
  value: number;
}

export default function TravelOptions({
  data,
  customer_id,
  origin,
  destination,
  onCreate,
}: TravelOptionsProps) {
  const { toast } = useToast();
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const [googleApiKey, setGoogleApiKey] = React.useState<string>("");

  React.useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/config");
        setGoogleApiKey(res.data.apiKey);
      } catch (error) {
        console.error(error);
      }
    };
    fetchApiKey();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  const encodedPolyline =
    data.routeResponse.routes[0]?.legs[0]?.polyline?.encodedPolyline;
  const pointA = data.routeResponse.routes[0]?.legs[0]?.startLocation?.latLng;
  const pointB = data.routeResponse.routes[0]?.legs[0]?.endLocation?.latLng;
  const driver = data.options;

  if (!encodedPolyline || !pointA || !pointB) {
    return <p>Dados insuficientes para gerar a imagem.</p>;
  }

  const handleConfirmRide = async (driver: Driver) => {
    try {
      setIsSubmiting(true);

      const dataToConfirm = {
        customer_id,
        origin: origin,
        destination: destination,
        distance: data?.routeResponse.routes[0]?.legs[0]?.distanceMeters,
        duration: data?.routeResponse.routes[0]?.legs[0]?.duration,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      };

      const res = await axios.patch(
        "http://localhost:8080/ride/confirm",
        dataToConfirm
      );

      if (res.data.status !== 200) {
        return toast({
          title: "Erro ao realizar a solicitação!",
          description: res.data.description as string,
          variant: "destructive",
        });
      }

      if (res.data.status === 200) {
        onCreate();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao realizar a solicitação!",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  const staticImg = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&path=weight:10|color:blue|enc:${encodeURIComponent(
    encodedPolyline
  )}&markers=color:green|label:A|${pointA.latitude},${
    pointA.longitude
  }&markers=color:red|label:B|${pointB.latitude},${
    pointB.longitude
  }&key=${googleApiKey}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Mapa com a rota</CardTitle>
          <CardDescription>Escolha um motorista ao lado.</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={staticImg} alt="Mapa com rota" className="w-auto h-auto" />
        </CardContent>
      </Card>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Lista de motoristas</CardTitle>
          <CardDescription>
            Escolha um motorista para realizar a sua viagem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {driver ? (
            driver.map((driver, index) => (
              <div key={index} className="flex flex-row gap-2 items-center">
                <Button
                  onClick={() => handleConfirmRide(driver)}
                  variant={"outline"}
                  disabled={isSubmiting}
                  size={"sm"}
                >
                  {isSubmiting ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    "Escolher"
                  )}
                </Button>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2 items-center w-full justify-between px-2">
                        <span>{driver.name}</span>
                        <span>
                          {"R$ " +
                            driver.value.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 flex flex-col gap-2">
                      <div className="space-x-2">
                        <span className="font-semibold">Descrição:</span>
                        <span className="text-muted-foreground">
                          {driver.description}
                        </span>
                      </div>
                      <div className="space-x-2">
                        <span className="font-semibold">Veículo:</span>
                        <span className="text-muted-foreground">
                          {driver.vehicle}
                        </span>
                      </div>
                      {driver.reviews.map((review, index) => (
                        <div className="flex flex-col gap-2" key={index}>
                          <div className="flex flex-row gap-2">
                            <span className="font-semibold">Comentário:</span>
                            <span className="text-muted-foreground">
                              {review.comment}
                            </span>
                          </div>
                          <div className="flex flex-row gap-2">
                            <span className="font-semibold">Avaliação:</span>
                            <span className="flex flex-row gap-2 items-center">
                              {review.rating}/5
                              <Star className="w-4 h-4" fill="yellow" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))
          ) : (
            <div className="w-full text-center">
              <span className="text-muted-foreground text-sm">
                Quilometragem mínima de 1km não permitida. Não temos motoristas
                disponíveis.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
