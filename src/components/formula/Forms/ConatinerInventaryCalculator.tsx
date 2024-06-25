import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

const ContainerInventoryValidator = z.object({
  demandRate: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().positive("Debe ser un número positivo")
  ),
  containerTurnaroundTime: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().positive("Debe ser un número positivo")
  ),
  containerSize: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().positive("Debe ser un número positivo")
  ),
});

type ContainerInventoryFormData = z.infer<typeof ContainerInventoryValidator>;

export function ContainerInventoryCalculator({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ContainerInventoryFormData>({
    resolver: zodResolver(ContainerInventoryValidator),
  });

  const [state, setState] = React.useState({
    showResult: false,
    resultInventary: 0,
    resultContainer: 0,
  });

  const { toast } = useToast();

  const handleCalculate = (data: ContainerInventoryFormData) => {
    const recipients = CalculateContainer(data);
    const inventory = CalculateInventary(recipients, data.containerSize);

    setState((prevState) => ({
      ...prevState,
      showResult: true,
      resultContainer: recipients,
      resultInventary: inventory,
    }));
  };

  const CalculateInventary = (recipients: number, containerSize: number) => {
    const inventoryRate = recipients * containerSize;

    toast({
      title: "Resultado del Cálculo de inventario es",
      description: `El resultado es ${inventoryRate}`,
      variant: "default",
    });

    return inventoryRate;
  };

  const CalculateContainer = (data: ContainerInventoryFormData) => {
    const { demandRate, containerTurnaroundTime, containerSize } = data;

    const containerResult =
      (demandRate * containerTurnaroundTime) / (containerSize * 60);

    toast({
      title: "Resultado del Cálculo de recipiente",
      description: `El resultado es ${containerResult}`,
      variant: "default",
    });

    if (containerResult < 1) {
      return 1;
    }

    return Math.round(containerResult);

    // return containerResult;
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => handleCalculate(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            Calculadora de Tasa de Inventario del Contenedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="demandRate">Tasa de Demanda</Label>
              <Input
                id="demandRate"
                {...register("demandRate")}
                type="number" step="0.01"
                required
              />
              {errors?.demandRate && (
                <p className="text-red-600">{errors.demandRate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="containerTurnaroundTime">
                Tiempo de vuelta de recipientes (minutos)
              </Label>
              <Input
                id="containerTurnaroundTime"
                {...register("containerTurnaroundTime")}
                type="number"
                required
              />
              {errors?.containerTurnaroundTime && (
                <p className="text-red-600">
                  {errors.containerTurnaroundTime.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="containerSize">Tamaño del recipiente</Label>
              <Input
                id="containerSize"
                {...register("containerSize")}
                type="number"
                required
              />
              {errors?.containerSize && (
                <p className="text-red-600">{errors.containerSize.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Calcular Tasa de Inventario del Contenedor</Button>
        </CardFooter>

        {state.showResult && (
          <h1 className="ml-7 mb-7">
            Los recipientes son {state.resultContainer} y el calculo de
            inventario es {state.resultInventary}
          </h1>
        )}
      </Card>
    </form>
  );
}
