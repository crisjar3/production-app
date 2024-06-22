import React from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {kanbanRowsSchema, kanbanSchema, rowKanbanData} from '../Kanban/Utils/SchemaValidator';
import {zodResolver} from '@hookform/resolvers/zod';
import {DataRow, DataTable} from '@/components/Generics/CustomTable';
import {ErrorMessage} from '@hookform/error-message';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import ReadDataTable from '@/components/Generics/ReadDataTable';
import {calculateKanban} from '../Kanban/Utils/Functions';
import ResetButton from '../Kanban/Utils/ResetButton';

type StateCalculator = {
    total: number
    result: boolean
    data: any
}
const kanbanResults: rowKanbanData[] = [
    {Product: 1, Demand: 29000, DeliveryTime: 360, SecurityStock: 3, Storage: 22000, PercentageDemand: 84},
    {Product: 2, Demand: 31000, DeliveryTime: 360, SecurityStock: 3, Storage: 22000, PercentageDemand: 84},
    {Product: 3, Demand: 48000, DeliveryTime: 360, SecurityStock: 3, Storage: 22000, PercentageDemand: 84},
    {Product: 4, Demand: 54000, DeliveryTime: 375, SecurityStock: 3, Storage: 22000, PercentageDemand: 90},
    {Product: 5, Demand: 60000, DeliveryTime: 360, SecurityStock: 3, Storage: 52000, PercentageDemand: 90},
];

export function KanbanCalculator() {
    const [stateKanban, setStateKanban] = React.useState<StateCalculator>({
        total: 0,
        result: false,
        data: [],
    })

    const {
        control, handleSubmit, formState: {
            errors
        }, getValues, reset
    } = useForm<kanbanRowsSchema>({
        resolver: zodResolver(kanbanSchema),
        defaultValues: {
            rows: [{
                Product: 1,
                Demand: 0,
                DeliveryTime: 0,
                SecurityStock: 0,
                Storage: 0,
                PercentageDemand: 0,
            }],
        },
    });

    const {fields, append, remove,}
        = useFieldArray({
        control,
        name: 'rows'
    });

    const resetResult = () => {
        setStateKanban({
            total: 0,
            result: false,
            data: [],
        })
        reset()
    }

    const addRow = () => {
        const values = getValues()
        const product = values.rows.at(-1)!.Product + 1;
        append({
            DeliveryTime: 0,
            Demand: 0,
            Product: product,
            SecurityStock: 0,
            Storage: 0,
            PercentageDemand: 0
        });
    }

    const onSubmit = (data: kanbanRowsSchema) => {
        const dataResult = calculateKanban(data.rows)
        const total = dataResult.reduce((acc, curr) => acc + curr.Kanban, 0);

        setStateKanban((prev) => ({...prev, total, result: true, data: dataResult}))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Control de Calidad</CardTitle>
            </CardHeader>

            <CardContent>
                <DataTable
                    title="Datos"
                    headers={["Productos", "Demanda", "Tiempo Entrega(Min)", "Stock Seguridad (%)", "Alamacenaje", "Porcentaje Demanda"]}
                >
                    {fields.map((field, index) => (
                        <DataRow key={field.id}>
                            <td>
                                <Controller
                                    control={control}
                                    name={`rows.${index}.Product` as const}
                                    render={({field}) =>
                                        <input type="number" {...field}
                                               readOnly={true}
                                               className={errors?.rows?.[index]?.Product ? "error" : ""}/>
                                    }
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name={`rows.${index}.Product` as const}
                                    render={({message}) => <p>{message}</p>}
                                />
                            </td>
                            <td>
                                <Controller
                                    control={control}
                                    name={`rows.${index}.Demand` as const}
                                    render={({field}) =>
                                        <input type="number" {...field}
                                               className={errors?.rows?.[index]?.Demand ? "error" : ""}/>}
                                />

                                <ErrorMessage
                                    errors={errors}
                                    name={`rows.${index}.Demand` as const}
                                    render={({message}) => <p>{message}</p>}
                                />
                            </td>
                            <td>
                                <Controller
                                    control={control}
                                    name={`rows.${index}.DeliveryTime` as const}
                                    render={({field}) =>
                                        <input type="number" step="0.01" {...field}
                                               className={errors?.rows?.[index]?.DeliveryTime ? "error" : ""}/>}
                                />

                                <ErrorMessage
                                    errors={errors}
                                    name={`rows.${index}.DeliveryTime` as const}
                                    render={({message}) => <p>{message}</p>}
                                />
                            </td>

                            <td>
                                <Controller
                                    control={control}
                                    name={`rows.${index}.SecurityStock` as const}
                                    render={({field}) =>
                                        <input type="number" step="0.01" {...field}
                                               className={errors?.rows?.[index]?.SecurityStock ? "error" : ""}/>}
                                />

                                <ErrorMessage
                                    errors={errors}
                                    name={`rows.${index}.SecurityStock` as const}
                                    render={({message}) => <p>{message}</p>}
                                />
                            </td>

                            <td>
                                <Controller
                                    control={control}
                                    name={`rows.${index}.Storage` as const}
                                    render={({field}) =>
                                        <input type="number" step="0.01" {...field}
                                               className={errors?.rows?.[index]?.Storage ? "error" : ""}/>}
                                />

                                <ErrorMessage
                                    errors={errors}
                                    name={`rows.${index}.Storage` as const}
                                    render={({message}) => <p>{message}</p>}
                                />
                            </td>

                            <td>
                                <Controller
                                    control={control}
                                    name={`rows.${index}.PercentageDemand` as const}
                                    render={({field}) =>
                                        <input type="number" step="0.01" {...field}
                                               className={errors?.rows?.[index]?.PercentageDemand ? "error" : ""}/>}
                                />

                                <ErrorMessage
                                    errors={errors}
                                    name={`rows.${index}.PercentageDemand` as const}
                                    render={({message}) => <p>{message}</p>}
                                />
                            </td>


                            <td>
                                <button type="button" onClick={() => remove(index)}>Remove</button>
                            </td>
                        </DataRow>
                    ))}

                </DataTable>

                <button onClick={() => addRow()} className="pi pi-plus" style={{fontSize: '1.5rem'}}></button>

                {
                    stateKanban.result
                    &&
                    <div>
                        <h1>El resultado de la suma de kanbans
                            es {stateKanban.total.toFixed(3)} ≈ {Math.round(stateKanban.total)}</h1>
                        <ReadDataTable
                            title={"Resultados Kanaban"}
                            headers={["Semanas", "Demanda", "Tiempo Entrega", "Stock Seguridad", "Capacidad Almacenaje", "Kn"]}
                            subtitle={"Tabla de resultados"}
                            rows={stateKanban.data}
                        />
                    </div>
                }

            </CardContent>

            <CardFooter>
                <Button onClick={handleSubmit(onSubmit)}>Calcular Control de Calidad</Button>
                <ResetButton onClickFromParent={resetResult}/>
            </CardFooter>

        </Card>
    );
}


export default KanbanCalculator;