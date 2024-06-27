"use client"

import {DataRow, DataTable} from "@/components/formula/Quality/Utils/TableQuality";
import * as React from "react";
import {headerResultsLTC, ResultLTC} from "@/lib/utils/LTC/utils";


export function useLtcResultTable(results: ResultLTC[] = [], S: number = 0) {

    const table = (

        <DataTable
            title="Resultados de los calculos Ltc"
            headers={headerResultsLTC}
            subtitle={'a contnuacion se presentan los resultados:'}
        >
            {results.map((field, index) => (
                <DataRow className={field.period > 1 && field.cumulativeHoldingCost > S ? "bg-red-500 text-slate-50" : ""} key={index}>
                    <td className="px-6 py-4">
                        {field.period}
                    </td>

                    <td className="px-6 py-4">
                        {field.units}
                    </td>

                    <td className="px-6 py-4">
                        {field.holdingPeriods}
                    </td>

                    <td className="px-6 py-4">
                        {field.holdingCost}
                    </td>

                    <td className="px-6 py-4">
                        {field.cumulativeHoldingCost}
                    </td>

                </DataRow>
            ))}

        </DataTable>
    )


    return {table}
}