import {z} from "zod";


const preprocessStringToFloat = (value: any) => {

    const stringValue = typeof value !== 'string' ? value.toString() : value;

    return parseFloat(stringValue);
};


const rowKanbanSchema = z.object({
    Product: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(1, "Debe ser un número entero positivo mayor a 1")
    ),
    Demand: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(0, "Debe ser un numero entero positivo a mayor a 1")
    ),
    DeliveryTime: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(1, "Debe ser un numero entero positivo a mayor a 1")
    ),
    SecurityStock: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(0, "Debe ser un numero entero positivo a mayor a 1").max(100, "Existe un rango mayor de 1 a 100")
    ),
    Storage: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(1, "Debe ser un numero entero positivo a mayor a 1")
    ),
    PercentageDemand: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(1, "Debe ser un numero entero positivo a mayor a 1").max(100, "Existe un rango mayor de 1 a 100")
    ),
});

export type rowKanbanData = z.infer<typeof rowKanbanSchema>;

export const kanbanSchema = z.object({
    rows: z.array(rowKanbanSchema).min(1),
});

export type kanbanRowsSchema = z.infer<typeof kanbanSchema>;