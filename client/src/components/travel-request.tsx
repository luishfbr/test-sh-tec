import React from "react";

import type { EstimateValueForm, EstimateValueResProps } from "@/lib/types";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

interface TravelRequestProps {
  onEstimateValue: (
    data: EstimateValueResProps,
    customer_id: string,
    origin: string,
    destination: string
  ) => void;
}

export default function TravelRequest({ onEstimateValue }: TravelRequestProps) {
  const { toast } = useToast();
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<EstimateValueForm>();

  const onSubmit = async (data: EstimateValueForm) => {
    try {
      setIsSubmiting(true);
      const res = await axios.post("http://localhost:8080/ride/estimate", data);
      console.log(res);
      if (res.data.status === 200) {
        reset();
        onEstimateValue(
          res.data.response as EstimateValueResProps,
          data.customer_id as string,
          data.origin as string,
          data.destination as string
        );
      }
      if (res.data.status !== 200) {
        return toast({
          title: "Erro ao realizar a solicitação!",
          description: res.data.description as string,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao realizar a solicitação!",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Precificar viagem</CardTitle>
        <CardDescription>
          Insira os dados abaixo, são obrigatórios.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Id do usuário</Label>
            <Input type="text" required {...register("customer_id")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Endereço de Origem</Label>
            <Input type="text" required {...register("origin")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Endereço de Destino</Label>
            <Input type="text" required {...register("destination")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isSubmiting} className="w-full" type="submit">
            {isSubmiting ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              "Enviar"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
