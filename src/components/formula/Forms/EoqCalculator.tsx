import * as React from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";

import {Button} from "@/components/ui/Button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/Card";
import {Input} from "@/components/ui/Input";
import {Label} from "@/components/ui/Label";
import {useToast} from "@/hooks/use-toast";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";

const EOQValidator = z.object({
  demand: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Debe ser un numero Positivo")
  ),
  setupCost: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Debe ser un numero Positivo")
  ),
  holdingCost: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Debe ser un numero Positivo")
  ),
  numberOfDays: z.preprocess(
    (a) =>
      a === undefined || a === null || a.toString().trim() === ""
        ? 1
        : parseFloat(z.string().parse(a)),
    z.number().positive("Debe ser un numero no negativo").optional().default(0)
  ),
});

type EOQFormData = z.infer<typeof EOQValidator>;

export function EOQCalculator({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EOQFormData>({
    resolver: zodResolver(EOQValidator),
  });

  const { toast } = useToast();

  const calculateEOQ = (data: EOQFormData) => {
    const { demand, setupCost, holdingCost, numberOfDays } = data;

    const EOQ = Math.sqrt(
      (2 * demand * setupCost * numberOfDays) / holdingCost
    );

    toast({
      title: "Resultado correcto",
      description: "El resultado es " + Math.ceil(EOQ),
    });
    return EOQ;
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => calculateEOQ(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Calculadora EOQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="demand">Demanda</Label>
              <Input id="demand" {...register("demand")} type="number" />
              {errors?.demand && (
                <p className="text-red-600">{errors.demand.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="setupCost">Coste de Instalacion</Label>
              <Input id="setupCost" {...register("setupCost")} type="number" />
              {errors?.setupCost && (
                <p className="text-red-600">{errors.setupCost.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="holdingCost">Costo de Mantenimiento</Label>
              <Input
                id="holdingCost"
                {...register("holdingCost")}
                type="text"
              />
              {errors?.holdingCost && (
                <p className="text-red-600">{errors.holdingCost.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="numberOfDays">Numero de dias</Label>
              <Input
                id="numberOfDays"
                {...register("numberOfDays")}
                type="number"
              />
              {errors?.numberOfDays && (
                <p className="text-red-600">{errors.numberOfDays.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Calculate EOQ</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
