import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

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

const CorrectiveMaintenanceValidator = z.object({
  numberOfFailures: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
  ),
  durationOfTask: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
  ),
  costPerHour: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
  ),
  sparePartsCost: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().nonnegative("Must be a non-negative number")
  ),
  operationalTaskCost: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().nonnegative("Must be a non-negative number")
  ),
  logisticDelay: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().nonnegative("Must be a non-negative number")
  ),
  costPerHourOfDowntime: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
  ),
  oneTimeFailureCost: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Must be a positive number")
  ),
});

type CorrectiveMaintenanceFormData = z.infer<
  typeof CorrectiveMaintenanceValidator
>;

export function CorrectiveMaintenanceCalculator({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CorrectiveMaintenanceFormData>({
    resolver: zodResolver(CorrectiveMaintenanceValidator),
  });

  const { toast } = useToast();

  const calculateCMC = (data: CorrectiveMaintenanceFormData) => {
    const {
      numberOfFailures,
      durationOfTask,
      costPerHour,
      sparePartsCost,
      operationalTaskCost,
      logisticDelay,
      costPerHourOfDowntime,
      oneTimeFailureCost,
    } = data;

    const maintenanceCost =
      durationOfTask * costPerHour +
      sparePartsCost +
      operationalTaskCost +
      logisticDelay;
    const failureCost =
      durationOfTask * costPerHourOfDowntime + oneTimeFailureCost;
    const CMC = numberOfFailures * (maintenanceCost + failureCost);

    toast({
      title: "Calculation Result",
      description: `Data is ${JSON.stringify(data)} and result is ${CMC}`,
    });
    
    return CMC;
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => calculateCMC(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Corrective Maintenance Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="numberOfFailures">Number of Failures</Label>
              <Input
                id="numberOfFailures"
                {...register("numberOfFailures")}
                type="number"
              />
              {errors?.numberOfFailures && (
                <p className="text-red-600">
                  {errors.numberOfFailures.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="durationOfTask">Duration of Task (hours)</Label>
              <Input
                id="durationOfTask"
                {...register("durationOfTask")}
                type="number"
              />
              {errors?.durationOfTask && (
                <p className="text-red-600">{errors.durationOfTask.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="costPerHour">Cost Per Hour of Work ($)</Label>
              <Input
                id="costPerHour"
                {...register("costPerHour")}
                type="number"
              />
              {errors?.costPerHour && (
                <p className="text-red-600">{errors.costPerHour.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="sparePartsCost">Spare Parts Cost ($)</Label>
              <Input
                id="sparePartsCost"
                {...register("sparePartsCost")}
                type="number"
              />
              {errors?.sparePartsCost && (
                <p className="text-red-600">{errors.sparePartsCost.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="operationalTaskCost">
                Operational Task Cost ($)
              </Label>
              <Input
                id="operationalTaskCost"
                {...register("operationalTaskCost")}
                type="number"
              />
              {errors?.operationalTaskCost && (
                <p className="text-red-600">
                  {errors.operationalTaskCost.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="logisticDelay">Logistic Delay Cost ($)</Label>
              <Input
                id="logisticDelay"
                {...register("logisticDelay")}
                type="number"
              />
              {errors?.logisticDelay && (
                <p className="text-red-600">{errors.logisticDelay.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="costPerHourOfDowntime">
                Cost Per Hour of Downtime ($)
              </Label>
              <Input
                id="costPerHourOfDowntime"
                {...register("costPerHourOfDowntime")}
                type="number"
              />
              {errors?.costPerHourOfDowntime && (
                <p className="text-red-600">
                  {errors.costPerHourOfDowntime.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="oneTimeFailureCost">
                One-Time Failure Cost ($)
              </Label>
              <Input
                id="oneTimeFailureCost"
                {...register("oneTimeFailureCost")}
                type="number"
              />
              {errors?.oneTimeFailureCost && (
                <p className="text-red-600">
                  {errors.oneTimeFailureCost.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Calculate CMC</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
