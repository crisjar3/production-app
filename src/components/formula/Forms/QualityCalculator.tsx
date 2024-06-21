"use client"
import * as React from "react";
import {useState} from "react";

import {Button} from "@/components/ui/Button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/Card";
import {useToast} from "@/hooks/use-toast";
import {useQualityTable} from "../Quality/useQualityTable";
import 'primeicons/primeicons.css';
import {rowData, schemaRows} from "@/components/formula/Quality/Utils/SchemaValidator";
import ResultChart from "@/components/formula/Quality/Charts/ResultChart";
import {caclculateLC, calculateLIC, calculateLSC} from "@/components/formula/Quality/Utils/QualityFunctions";


type StateCalculator = {
    initialChart: boolean
    dataInitialChart: rowData[]
    resultChart: boolean
    dataResultChart: rowData[]
    LSC: number
    LIC: number
    LC: number
}


export function QualityCalculator({}: React.HTMLAttributes<HTMLFormElement>) {

    const {table, addRow, handleSubmit: handleSubmitTable, formulary} = useQualityTable();
    const {toast} = useToast();

    const [qualityState, setQualityState] = useState<StateCalculator>({
        initialChart: false,
        resultChart: false,
        dataInitialChart: [],
        dataResultChart: [],
        LIC: 0,
        LSC: 0,
        LC: 0
    })

    const onSubmit = (data: schemaRows) => {
        const LSC = calculateLSC(data.P/100, data.Quantity, data.Q/100);
        const LIC = calculateLIC(data.P/100, data.Quantity, data.Q/100);
        const LC = caclculateLC(data.rows)

        setQualityState((prev) => ({
            ...prev,
            dataInitialChart: data.rows,
            resultChart: true, LC, LSC, LIC
        }));

        toast({
            type: "background",
            about: "Resultados",
            draggable: "true",
            role: "alertdialog",
            title: "Resultados de el calculo"
        })
    };


    return (

        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Control de Calidad</CardTitle>
            </CardHeader>
            <CardContent>
                {formulary}

                <div className="flex flex-col gap-4">
                    {table}
                    <button onClick={() => addRow()} className="pi pi-plus" style={{fontSize: '1.5rem'}}></button>
                </div>

                {
                    qualityState.resultChart
                    &&
                    <>
                        <h1 className="ml-7 mb-7">
                            El resultado de los calculo es LIC={qualityState.LIC.toFixed(3)},
                             LSC={qualityState.LSC.toFixed(3)} y
                            LC={qualityState.LC.toFixed(3)}
                        </h1>
                        <ResultChart rows={qualityState.dataInitialChart} LSC={qualityState.LSC}
                                     LIC={qualityState.LIC}/>

                    </>
                }

            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmitTable(onSubmit)}>Calcular Control de Calidad</Button>
            </CardFooter>
        </Card>
    )
        ;
}



