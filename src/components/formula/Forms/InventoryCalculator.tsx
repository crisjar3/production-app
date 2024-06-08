import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const InventoryValidator = z
  .object({
    demand: z.preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().positive("Debe ser un numero Positivo")
    ),
    reviewCycle: z.preprocess(
      (a) =>
        a === undefined || a === null || a.toString().trim() === ""
          ? 0
          : parseFloat(z.string().parse(a)),
      z
        .number()
        .nonnegative("Debe ser un numero entero no negativo")
        .optional()
        .default(0)
    ),
    safetyStock: z.preprocess(
      (a) => parseInt(z.string().parse(a)),
      z.number().positive("Debe ser un numero entero positivo")
    ),
    weeks: z.preprocess(
      (a) => parseInt(z.string().parse(a)),
      z.number().positive("Debe ser un numero entero positivo")
    ),
    orderQuantity: z.preprocess(
      (a) =>
        a === undefined || a === null || a.toString().trim() === ""
          ? 0
          : parseFloat(z.string().parse(a)),
      z
        .number()
        .nonnegative("Debe ser un numero entero no negativo")
        .optional()
        .default(0)
    ),
  })
  .refine(
    (data) => {
      const { orderQuantity, reviewCycle } = data;

      if (orderQuantity > 0 && reviewCycle > 0) {
        return false;
      }

      if (orderQuantity === 0 && reviewCycle === 0) {
        return false;
      }

      return true;
    },
    {
      message:
        "Debe proporcionar al menos uno de los siguientes datos: Cantidad de ordenes o Ciclo de revision ",
      path: ["numberOfFailures"],
    }
  );

type InventoryFormData = z.infer<typeof InventoryValidator>;

type InventoryResults = {
  averageInventory: number | null; // Average inventory (units)
  inventoryTurnover: number | null; // Inventory turnover ratio
  averageInventoryByOrderQuantity: number | null; // Average inventory based on order quantity (units)
};

interface InventoryState {
  show: boolean;
  results: InventoryResults;
  errors: Record<string, string> | null; // Validation errors (optional)
}

export function InventoryCalculator({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<InventoryFormData>({
    resolver: zodResolver(InventoryValidator),
  });

  const { toast } = useToast();
  const [inventoryResults, setInventoryResults] = useState<InventoryState>({
    show: false,
    errors: null,
    results: {
      averageInventory: 0,
      averageInventoryByOrderQuantity: 0,
      inventoryTurnover: 0,
    },
  });

  const calculateInventory = (data: InventoryFormData): InventoryResults => {
    const { demand, reviewCycle, safetyStock, weeks, orderQuantity } = data;
    const averageInventory =
      orderQuantity > 0
        ? calculateAverageInventoryByQuantity(orderQuantity, safetyStock)
        : calculateAverageInventory({
            demand,
            reviewCycle,
            safetyStock,
          });

    return {
      averageInventory,
      inventoryTurnover: calculateInventoryTurnover(
        demand,
        weeks,
        averageInventory
      ),
      averageInventoryByOrderQuantity:null
    };
  };

  const ShowResults = (data: InventoryFormData) => {
    const {
      averageInventory,
      averageInventoryByOrderQuantity,
      inventoryTurnover,
    } = calculateInventory(data);

    setInventoryResults((prev) => ({
      ...prev,
      results: {
        averageInventory,
        averageInventoryByOrderQuantity,
        inventoryTurnover,
      },
      show: true,
    }));
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => ShowResults(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Inventario</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="demand">Demanda (unidades/semana) (D)</Label>
              <Input id="demand" {...register("demand")} type="number" />
              {errors?.demand && (
                <p className="text-red-600">{errors.demand.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="reviewCycle">
                Ciclo de revisión (semanas) (T)
              </Label>
              <Input
                id="reviewCycle"
                {...register("reviewCycle")}
                type="number"
              />
              {errors?.reviewCycle && (
                <p className="text-red-600">{errors.reviewCycle.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="safetyStock">
                Inventario de seguridad (unidades) (SS)
              </Label>
              <Input
                id="safetyStock"
                {...register("safetyStock")}
                type="number"
              />
              {errors?.safetyStock && (
                <p className="text-red-600">{errors.safetyStock.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="weeks">Semanas (Anualmente)</Label>
              <Input id="weeks" {...register("weeks")} type="number" />
              {errors?.weeks && (
                <p className="text-red-600">{errors.weeks.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="orderQuantity">Cantidad de ordenes (Q)</Label>
              <Input
                id="orderQuantity"
                {...register("orderQuantity")}
                type="number"
              />
              {errors?.orderQuantity && (
                <p className="text-red-600">{errors.orderQuantity.message}</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button>Generate Results</Button>
        </CardFooter>

        {inventoryResults.show && (
          <div>
            <h1 className="ml-7 mb-7">
              El valor promedio de el inventario es:
              {" " + inventoryResults.results.averageInventory?.toFixed(3)}
            </h1>

            <h1 className="ml-7 mb-7">
              La rotacion de Inventario es:
              {" " + inventoryResults.results.inventoryTurnover?.toFixed(3)}
            </h1>

            {inventoryResults.results.averageInventoryByOrderQuantity && (
              <h1 className="ml-7 mb-7">
                El valor promedio de el inventario por inventario pedido:
                {" " + inventoryResults.results.averageInventory?.toFixed(3)}
              </h1>
            )}
          </div>
        )}
      </Card>
    </form>
  );
}

type InventoryParameters = {
  demand: number; // Demand per week
  reviewCycle: number; // Review cycle in weeks
  safetyStock: number; // Safety stock
};

export function calculateAverageInventory(params: InventoryParameters): number {
  const { demand, reviewCycle, safetyStock } = params;
  return (demand * reviewCycle) / 2 + safetyStock;
}

export function calculateInventoryTurnover(
  demand: number,
  weeks: number,
  averageInventory: number
): number {
  return (demand ) / averageInventory;
}

export function calculateAverageInventoryByQuantity(
  orderQuantity: number,
  safetyStock: number
): number {
  return orderQuantity / 2 + safetyStock;
}
