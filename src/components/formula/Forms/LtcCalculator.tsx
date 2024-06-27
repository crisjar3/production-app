import * as React from "react";
import {useForm} from "react-hook-form";
import "katex/dist/katex.min.css";

import {Button} from "@/components/ui/Button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/Card";
import {Input} from "@/components/ui/Input";
import {Label} from "@/components/ui/Label";
import {useToast} from "@/hooks/use-toast";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {EditDataTable, useEditableTable,} from "@/components/Generics/EditableTable";
import {
    ButtonState,
    calculateLTC,
    calculateLuC as calculateLUC,
    generateHeaders,
    generateNumberObject,
    headerResultsLTC,
    headerResultsLUC,
    LtcFormData,
    LtcValidator,
    ResultLTC,
    ResultLUC,
} from "@/lib/utils/LTC/utils";
import DataTable from "@/components/Generics/ReadDataTable";
import {useLtcResultTable} from "../LTC/useLtcResultTable";

interface State {
    showTableUnits: boolean;
    showTableResults: boolean;
    headerTableUnits: string[];
    buttomValue: ButtonState;
    results: {
        resultLtc: ResultLTC[];
        resultLuc: ResultLUC[];
    };
    orderingCost: number
}

const inputData: LtcFormData = {
    holdingCost: 0.01,
    leadTime: 2,
    orderingCost: 2.05,
};

const units = [15, 16, 2, 24, 16, 17, 21, 3, 6, 2];

export function LtcCalculator({
                                  className,
                                  ...props
                              }: React.HTMLAttributes<HTMLFormElement>) {
    const {
        handleSubmit,
        register,
        formState: {errors},
    } = useForm<LtcFormData>({
        resolver: zodResolver(LtcValidator),
    });

    const {toast} = useToast();
    const {areAllRowsGreaterThanZero, updateRow, rows, updateRows} =
        useEditableTable([]);

    const [state, setState] = React.useState<State>({
        showTableUnits: false,
        showTableResults: false,
        headerTableUnits: [""],
        buttomValue: ButtonState.InsertValues,
        orderingCost: 0,
        results: {
            resultLtc: [],
            resultLuc: [],
        },
    });
    const {table} = useLtcResultTable(state.results.resultLtc, state.orderingCost)


    const showUnitTable = (leadTime: number) => {
        const headers = generateHeaders(leadTime);
        const initialRows = generateNumberObject(leadTime);

        updateRows([initialRows]);

        setState((prevState) => ({
            ...prevState,
            showTableUnits: true,
            headerTableUnits: headers,
            buttomValue: ButtonState.ShowResults,
        }));
    };

    const showResultTable = (data: LtcFormData) => {
        // if (!areAllRowsGreaterThanZero()) {
        //     toast({
        //         title: "Error",
        //         description: "Por favor, rellena todas las columnas.",
        //         variant: "destructive",
        //     });
        //     return;
        // }

        const test = [15, 16, 2, 24, 16, 17, 21, 3, 6, 2]

        // setState((prevState) => ({
        //   ...prevState,
        //   showTableResults: true,
        //   buttomValue: ButtonState.Reset,
        //   results: {
        //     resultLtc: calculateLTC(inputData, units),
        //     resultLuc: calculateLUC(inputData, units),
        //   },
        // }));

        setState((prevState) => ({
            ...prevState,
            showTableResults: true,
            buttomValue: ButtonState.Reset,
            orderingCost: data.orderingCost ?? 0,
            results: {
                resultLuc: calculateLUC(
                    data,
                    // Object.values(rows[0]).map((row) => row)
                    test
                ),
                resultLtc: calculateLTC(
                    data,
                    // Object.values(rows[0]).map((row) => row)
                    test
                ),
            },
        }));
    };

    const reset = () => {
        setState({
            showTableUnits: false,
            showTableResults: false,
            headerTableUnits: [""],
            buttomValue: ButtonState.InsertValues,
            orderingCost: 0,
            results: {
                resultLtc: [],
                resultLuc: [],
            },
        });
    };

    const handleSteps = (data: LtcFormData) => {
        const {orderingCost, holdingCost, leadTime} = data;

        if (!orderingCost || !holdingCost || !leadTime) {
            toast({
                title: "Error",
                description: "Por favor, ingrese todos los campos requeridos.",
                variant: "destructive",
            });
            return;
        }

        if (state.buttomValue === ButtonState.InsertValues) {
            showUnitTable(leadTime);
            return;
        }

        if (state.buttomValue === ButtonState.ShowResults) {
            showResultTable(data);
            return;
        }

        reset();
    };

    return (
        <form
            className={cn(className)}
            onSubmit={handleSubmit((e) => handleSteps(e))}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Calculadora de LUC Y LTC para Producción</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="orderingCost">Costo de Ordenar (S)</Label>
                            <Input
                                id="orderingCost"
                                {...register("orderingCost")}
                                type="number" step="0.01"
                                required
                                disabled={state.showTableResults}
                            />
                            {errors?.orderingCost && (
                                <p className="text-red-600">{errors.orderingCost.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="holdingCost">Costo de Mantenimiento (K)</Label>
                            <Input
                                id="holdingCost"
                                {...register("holdingCost")}
                                type="number" step="0.01"
                                disabled={state.showTableResults}
                                required
                            />
                            {errors?.holdingCost && (
                                <p className="text-red-600">{errors.holdingCost.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="leadTime">
                                Cantidad de semanas
                            </Label>
                            <Input
                                id="leadTime"
                                {...register("leadTime")}
                                type="number"
                                required
                                disabled={state.showTableUnits}
                            />
                            {errors?.leadTime && (
                                <p className="text-red-600">{errors.leadTime.message}</p>
                            )}
                        </div>

                        {state.showTableUnits && (
                            <EditDataTable
                                title="Semanas"
                                subtitle="Unidades en la semana"
                                headers={state.headerTableUnits}
                                isEditable={!state.showTableResults}
                                updateRow={updateRow}
                                rows={rows}
                            />
                        )}

                        {state.showTableResults && (
                            <DataTable
                                title="Resultado LTC"
                                subtitle="Resultado"
                                headers={headerResultsLTC}
                                rows={state.results.resultLtc}
                            />
                        )}

                        {
                            state.showTableResults
                            &&
                            table
                        }

                        {state.showTableResults && (
                            <DataTable
                                title="Resultado LUC"
                                subtitle="Resultado LUC"
                                headers={headerResultsLUC}
                                rows={state.results.resultLuc}
                            />
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>{state.buttomValue}</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
