import { ArrowRight, Loader2, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import React from "react";
import { TravelHistoryProps } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TravelHistory() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [rides, setRides] = React.useState<TravelHistoryProps | null>(null);
  const [customer_id, setCustomer_id] = React.useState<string>("");
  const [driver_id, setDriverId] = React.useState<string | null>(null);

  const fetchAllRides = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.get(`http://localhost:8080/ride/${customer_id}`);

      if (res.data.status !== 200) {
        toast({
          title: "Ocorreu um erro ao tentar carregar os dados",
          description: res.data.description as string,
          variant: "destructive",
        });
        setRides(null);
        return;
      }

      setRides(res.data.response);
    } catch (error) {
      console.error(error);
      toast({
        title: "Ocorreu um erro ao tentar carregar os dados",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRidesByDriverId = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.get(
        `http://localhost:8080/ride/${customer_id}?driver_id=${driver_id}`
      );

      if (res.data.status !== 200) {
        toast({
          title: "Ocorreu um erro ao tentar carregar os dados",
          description: res.data.description as string,
          variant: "destructive",
        });
        setRides(null);
        return;
      }

      setRides(res.data.response);
    } catch (error) {
      console.log(error);
      toast({
        title: "Ocorreu um erro ao tentar carregar os dados",
        description: "Verifique sua conexão com a internet.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de viagens</CardTitle>
        <CardDescription>
          Preencha as informações para ver o histórico de viagens e se
          necessário filtre as viagens por motoristas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 w-full">
            <Input
              className="w-full text-center"
              required
              type="text"
              placeholder="ID do usuário"
              onChange={(e) => setCustomer_id(e.target.value)}
            />
            <Select
              onValueChange={(value) => {
                setDriverId(value);
              }}
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Selecione um motorista" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Motoristas disponíveis</SelectLabel>
                  <SelectItem value="1">Homer Simpson</SelectItem>
                  <SelectItem value="2">Dominic Toretto</SelectItem>
                  <SelectItem value="3">James Bond</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              disabled={isSubmitting || !customer_id || !driver_id}
              onClick={() => fetchRidesByDriverId()}
              className="flex flex-row gap-2 items-center"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : customer_id ? (
                <span className="flex flex-row gap-2 items-center">
                  <Search className="w-5 h-5" />
                  Filtrar
                </span>
              ) : (
                "Insira um ID"
              )}
            </Button>
          </div>
          <Button
            disabled={isSubmitting || !customer_id}
            onClick={() => {
              fetchAllRides();
              setDriverId(null);
            }}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : customer_id ? (
              "Mostrar todos"
            ) : (
              "Insira um ID"
            )}
          </Button>
        </div>
        {rides ? (
          rides.rides.map((ride, index) => (
            <Accordion key={index} type="single" collapsible className="w-full">
              <AccordionItem value={ride.id.toString()}>
                <AccordionTrigger className="w-full flex flex-row justify-between">
                  <span>{ride.origin}</span>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {Math.floor(ride.distance / 1000)} km
                    </span>
                  </div>
                  <span>{ride.destination}</span>
                </AccordionTrigger>
                <AccordionContent className="w-full flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Data e hora:</p>
                    <span className="text-muted-foreground">
                      {new Date(ride.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      às{" "}
                      {new Date(ride.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Motorista:</p>
                    <span className="text-muted-foreground">
                      {ride.driver.name}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Tempo gasto:</p>
                    <span className="text-muted-foreground">
                      {ride.duration}egundos
                    </span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Valor da corrida:</p>
                    <span className="text-muted-foreground">
                      {ride.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        ) : (
          <div className="w-full text-center">
            {customer_id ? (
              driver_id ? (
                <span className="text-sm text-muted-foreground">
                  O ID inserido não possui viagens com o motorista selecionado.
                </span>
              ) : rides === null ? (
                <span className="text-sm text-muted-foreground">
                  O ID inserido não possui viagens.
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Clique em "Mostrar todos" ou filtre pelo motorista desejado.
                </span>
              )
            ) : (
              <span className="text-sm text-muted-foreground">
                Insira um ID e procure pelas viagens.
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
