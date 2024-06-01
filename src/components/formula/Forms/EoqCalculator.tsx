import * as React from "react";
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

const EOQValidator = z.object({
  demand: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
  ),
  setupCost: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
  ),
  holdingCost: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
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
    const { demand, setupCost, holdingCost } = data;

    const EOQ = Math.sqrt((2 * demand * setupCost) / holdingCost);

    toast({
      title: "Resultado correcto",
      description: "data is" + JSON.stringify(data) + "and result is" + EOQ,
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
          <CardTitle>EOQ Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="demand">Demand</Label>
              <Input id="demand" {...register("demand")} type="number" />
              {errors?.demand && (
                <p className="text-red-600">{errors.demand.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="setupCost">Setup Cost</Label>
              <Input id="setupCost" {...register("setupCost")} type="number" />
              {errors?.setupCost && (
                <p className="text-red-600">{errors.setupCost.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="holdingCost">Holding Cost</Label>
              <Input
                id="holdingCost"
                {...register("holdingCost")}
                type="number"
              />
              {errors?.holdingCost && (
                <p className="text-red-600">{errors.holdingCost.message}</p>
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
