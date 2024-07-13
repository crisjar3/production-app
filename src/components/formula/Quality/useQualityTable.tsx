"use client"

import {Controller, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {rowData, schema, schemaRows} from "@/components/formula/Quality/Utils/SchemaValidator";
import {DataRow, DataTable} from "@/components/formula/Quality/Utils/TableQuality";
import {ErrorMessage} from "@hookform/error-message";
import {Label} from "@/components/ui/Label";
import {Input} from "@/components/ui/Input";
import * as React from "react";


const datos: rowData[] = [
    {Sample: 1, Defective: 4, DefectiveFractions: 0.04},
    {Sample: 2, Defective: 0, DefectiveFractions: 0},
    {Sample: 3, Defective: 0, DefectiveFractions: 0},
    {Sample: 4, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 5, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 6, Defective: 1, DefectiveFractions: 0.01},
    {Sample: 7, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 8, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 9, Defective: 1, DefectiveFractions: 0.01},
    {Sample: 10, Defective: 4, DefectiveFractions: 0.04},
    {Sample: 11, Defective: 0, DefectiveFractions: 0},
    {Sample: 12, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 13, Defective: 1, DefectiveFractions: 0.01},
    {Sample: 14, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 15, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 16, Defective: 0, DefectiveFractions: 0},
    {Sample: 17, Defective: 1, DefectiveFractions: 0.01},
    {Sample: 18, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 19, Defective: 5, DefectiveFractions: 0.05},
    {Sample: 20, Defective: 8, DefectiveFractions: 0.08},
    {Sample: 21, Defective: 4, DefectiveFractions: 0.04},
    {Sample: 22, Defective: 1, DefectiveFractions: 0.01},
    {Sample: 23, Defective: 2, DefectiveFractions: 0.02},
    {Sample: 24, Defective: 2, DefectiveFractions: 0.04},
    {Sample: 25, Defective: 1, DefectiveFractions: 0.001},
];

export function useQualityTable() {
    const {
        control, handleSubmit, register, formState: {
            errors
        }, getValues
    } = useForm<schemaRows>({
        resolver: zodResolver(schema),
        defaultValues: {
            rows: [
                {
                    Sample: 1,
                    DefectiveFractions: 0,
                    Defective: 0
                }
            ],
        },
    });

    const {fields, append, remove,}
        = useFieldArray({
        control,
        name: 'rows'
    });

    const addRow = () => {
        const ap = getValues()
        const sample = ap.rows.at(-1)!.Sample + 1;
        append({Sample: sample, Defective: 1, DefectiveFractions: 1});
    }


    const table = (

        <DataTable
            title="Datos"
            headers={["Muestra", "Defectos", "Fracciones Defectuosas"]}
        >
            {fields.map((field, index) => (
                <DataRow className="" key={field.id} >
                    <td>
                        <Controller
                            control={control}
                            name={`rows.${index}.Sample` as const}
                            render={({field}) =>
                                <input type="number" {...field}
                                    readOnly={true}
                                       className={errors?.rows?.[index]?.Sample ? "error" : ""}/>
                            }
                        />
                        <ErrorMessage
                            errors={errors}
                            name={`rows.${index}.Sample` as const}
                            render={({message}) => <p>{message}</p>}
                        />
                    </td>
                    <td>
                        <Controller
                            control={control}
                            name={`rows.${index}.Defective` as const}
                            render={({field}) =>
                                <input type="number" {...field}
                                       className={errors?.rows?.[index]?.Defective ? "error" : ""}/>}
                        />

                        <ErrorMessage
                            errors={errors}
                            name={`rows.${index}.Defective` as const}
                            render={({message}) => <p>{message}</p>}
                        />
                    </td>
                    <td>
                        <Controller
                            control={control}
                            name={`rows.${index}.DefectiveFractions` as const}
                            render={({field}) =>
                                <input type="number" step="0.01" {...field}
                                       className={errors?.rows?.[index]?.DefectiveFractions ? "error" : ""}/>}
                        />

                        <ErrorMessage
                            errors={errors}
                            name={`rows.${index}.DefectiveFractions` as const}
                            render={({message}) => <p>{message}</p>}
                        />
                    </td>
                    <td>
                        <button type="button" onClick={() => remove(index)}>Remove</button>
                    </td>
                </DataRow>
            ))}

        </DataTable>
    )

    const formulary = (
        <form
        >
            <div className="grid gap-4">
                <div>
                    <Label htmlFor="demand">P %</Label>
                    <Input id="P" {...register("P")} type="number"/>
                    {errors?.P && (
                        <p className="text-red-600">{errors.P.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="Q">Q %</Label>
                    <Input id="Q" {...register("Q")} type="number"/>
                    {errors?.Q && (
                        <p className="text-red-600">{errors.Q.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="Quantity">Numero de Muestra</Label>
                    <Input
                        id="Quantity"
                        {...register("Quantity")}
                        type="number" step="0.01"
                    />
                    {errors?.Quantity && (
                        <p className="text-red-600">{errors.Quantity.message}</p>
                    )}
                </div>
            </div>
        </form>
    )


    return {table, addRow, handleSubmit, formulary}
}