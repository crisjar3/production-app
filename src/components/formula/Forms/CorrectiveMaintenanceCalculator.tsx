import * as React from "react";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import "katex/dist/katex.min.css";

import {Button} from "@/components/ui/Button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/Card";
import {Input} from "@/components/ui/Input";
import {Label} from "@/components/ui/Label";
import {useToast} from "@/hooks/use-toast";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";

const CorrectiveMaintenanceValidator = z
    .object({
        numberOfFailures: z.preprocess(
            (a) =>
                a === undefined || a === null || a.toString().trim() === ""
                    ? 0
                    : Math.floor(parseFloat(z.string().parse(a))),
            z
                .number()
                .optional()
                .default(0)
        ),
        durationOfTask: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().positive("Debe ser un numero Positivo")
        ),
        costPerHour: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().positive("Debe ser un numero Positivo")
        ),
        sparePartsCost: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().nonnegative("Debe ser un numero no negativo")
        ),
        operationalTaskCost: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().nonnegative("Debe ser un numero no negativo")
        ),
        logisticDelay: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().nonnegative("Debe ser un numero no negativo")
        ),
        costPerHourOfDowntime: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().positive("Debe ser un numero Positivo")
        ),
        oneTimeFailureCost: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().positive("Debe ser un numero Positivo")
        ),
        totalHours: z
            .preprocess(
                (a) =>
                    a === undefined || a === null || a.toString().trim() === ""
                        ? 0
                        : Math.floor(parseFloat(z.string().parse(a))),
                z
                    .number()
                    .nonnegative("Debe ser un numero no negativo")
                    .optional()
                    .default(0)
            )
            .default(0),
        MTBF: z
            .preprocess(
                (a) =>
                    a === undefined || a === null || a.toString().trim() === ""
                        ? 0
                        : parseFloat(z.string().parse(a)),
                z
                    .number()
                    .nonnegative("Debe ser un numero no negativo")
                    .optional()
                    .default(0)
            )
            .default(0),
    })
    .refine(
        (data) => {
            const {totalHours, MTBF, numberOfFailures} = data;

            // Check for invalid state: all three fields are greater than zero
            if ((totalHours > 0 || MTBF > 0) && numberOfFailures > 0) {
                return false;
            }

            // Check for at least one valid input
            if ((totalHours === 0 || MTBF === 0) && numberOfFailures === 0) {
                return false;
            }

            // Calculate number of failures if totalHours and MTBF are provided
            if (totalHours > 0 && MTBF > 0) {
                data.numberOfFailures = Math.ceil(totalHours / MTBF);
            }

            return true;
        },
        {
            message:
                "Debe proporcionar al menos uno de los siguientes: número de fallas o MTBF y horas totales. No puede proporcionar los tres simultáneamente.",
            path: ["numberOfFailures"],
        }
    );

type CorrectiveMaintenanceFormData = z.infer<
    typeof CorrectiveMaintenanceValidator
>;

type FormField =
    | "numberOfFailures"
    | "durationOfTask"
    | "costPerHour"
    | "sparePartsCost"
    | "operationalTaskCost"
    | "logisticDelay"
    | "costPerHourOfDowntime"
    | "oneTimeFailureCost"
    | "totalHours"
    | "MTBF"

export function CorrectiveMaintenanceCalculator({
                                                    className,
                                                    ...props
                                                }: React.HTMLAttributes<HTMLFormElement>) {
    const {
        handleSubmit,
        register, getValues,
        setValue,
        formState: {errors},
        control
    } = useForm<CorrectiveMaintenanceFormData>({
        resolver: zodResolver(CorrectiveMaintenanceValidator),
    });

    const {toast} = useToast();
    const [stateCalculator, setStateCalculator] = useState({
        showResult: false,
        result: "",
        numberOfFailures: 0,
        MTBF: 0,
        totalHours: 0
    })

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
        const CMC = (numberOfFailures ?? 1) * (maintenanceCost + failureCost);

        toast({
            title: "Resultado Calculado",
            description: `el Resultado  de CMC es ${CMC} y el numero de fallas es ${numberOfFailures}`,
        });

        setStateCalculator((prev) => ({
            ...prev,
            showResult: true,
            result: `el Resultado  de CMC es ${CMC} y el numero de fallas es ${numberOfFailures}`
        }));
        return CMC;
    };

    const hanldeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // alert(e.target.id)

        let value = Number(e.target.value);
        const field = e.target.id as FormField

        if (field === "totalHours" || field === "numberOfFailures") {
            value = Math.floor(value)
        }

        setValue(field, value)
        setStateCalculator((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    return (
        <form
            className={cn(className)}
            onSubmit={handleSubmit((e) => calculateCMC(e))}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Calculadora de Mantenimiento Correctivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="numberOfFailures">Numero de fallas</Label>
                            {/*<Input*/}
                            {/*    id="numberOfFailures"*/}
                            {/*    {...register("numberOfFailures", {min: 0})}*/}
                            {/*    type="number"*/}
                            {/*    onChange={hanldeOnChange}*/}
                            {/*    defaultValue={0}*/}
                            {/*    disabled={stateCalculator.MTBF > 0 || stateCalculator.totalHours > 0}*/}
                            {/*    min={0}*/}
                            {/*    step={1}*/}
                            {/*/>*/}

                            <Controller
                                name="numberOfFailures"
                                control={control}
                                render={({field}) =>
                                    <Input
                                        id="numberOfFailures"
                                        {...register("numberOfFailures", {min: 0})}
                                        type="number"
                                        onChange={hanldeOnChange}
                                        defaultValue={0}
                                        disabled={stateCalculator.MTBF > 0 || stateCalculator.totalHours > 0}
                                        min={0}
                                        step={1}
                                    />}
                            />
                            {errors?.numberOfFailures && (
                                <p className="text-red-600">
                                    {errors.numberOfFailures.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="durationOfTask">Duracion de Tareas (horas)</Label>
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
                            <Label htmlFor="costPerHour">Costo por hora de Trabajo ($)</Label>
                            <Input
                                id="costPerHour"
                                {...register("costPerHour")}
                                type="number" step="0.01"
                            />
                            {errors?.costPerHour && (
                                <p className="text-red-600">{errors.costPerHour.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="sparePartsCost">Costo por Reparaciones ($)</Label>
                            <Input
                                id="sparePartsCost"
                                {...register("sparePartsCost")}
                                type="number" step="0.01"
                            />
                            {errors?.sparePartsCost && (
                                <p className="text-red-600">{errors.sparePartsCost.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="operationalTaskCost">
                                Costo de Tareas operacionales ($)
                            </Label>
                            <Input
                                id="operationalTaskCost"
                                {...register("operationalTaskCost")}
                                type="number" step="0.01"
                            />
                            {errors?.operationalTaskCost && (
                                <p className="text-red-600">
                                    {errors.operationalTaskCost.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="logisticDelay">Costo de Retraso logistico ($)</Label>
                            <Input
                                id="logisticDelay"
                                {...register("logisticDelay")}
                                type="number" step="0.01"
                                defaultValue={0}
                            />
                            {errors?.logisticDelay && (
                                <p className="text-red-600">{errors.logisticDelay.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="costPerHourOfDowntime">
                                Costo Unitario por parada ($)
                            </Label>
                            <Input
                                id="costPerHourOfDowntime"
                                {...register("costPerHourOfDowntime")}
                                type="number" step="0.01"
                                defaultValue={0}
                            />
                            {errors?.costPerHourOfDowntime && (
                                <p className="text-red-600">
                                    {errors.costPerHourOfDowntime.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="oneTimeFailureCost">
                                Costo de Falla Unica ($)
                            </Label>
                            <Input
                                id="oneTimeFailureCost"
                                {...register("oneTimeFailureCost")}
                                type="number"
                                step="0.01"
                            />
                            {errors?.oneTimeFailureCost && (
                                <p className="text-red-600">
                                    {errors.oneTimeFailureCost.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="MTBF">MBTF</Label>
                            <Input
                                id="MTBF"
                                {...register("MTBF")}
                                type="number"
                                step="0.01"
                                defaultValue={0}
                                onChange={hanldeOnChange}
                                disabled={stateCalculator.numberOfFailures > 0}
                            />
                            {errors?.MTBF && (
                                <p className="text-red-600">{errors.MTBF.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="totalHours">Horas Totales</Label>
                            <Input
                                id="totalHours"
                                {...register("totalHours")}
                                type="number"
                                onChange={hanldeOnChange}
                                defaultValue={0}
                                disabled={stateCalculator.numberOfFailures > 0}
                            />
                            {errors?.totalHours && (
                                <p className="text-red-600">{errors.totalHours.message}</p>
                            )}
                        </div>

                        {
                            stateCalculator.showResult
                            &&

                            <div>
                                <Label>
                                    Resultado:
                                </Label>

                                <h1>
                                    {stateCalculator.result}
                                </h1>
                            </div>
                        }
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Calculate CMC</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
