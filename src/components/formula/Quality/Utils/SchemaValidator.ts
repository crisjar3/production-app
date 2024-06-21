import {z} from "zod";


const preprocessStringToFloat = (value: any) => {

    const stringValue = typeof value !== 'string' ? value.toString() : value;

    return parseFloat(stringValue);
};


const rowSchema = z.object({
    Sample: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(1, "Debe ser un número entero positivo mayor a 1")
    ),
    Defective: z.preprocess(
        preprocessStringToFloat,
        z.number().int().min(0, "Debe ser un numero entero positivo a mayor a 1")
    ),
    DefectiveFractions: z.preprocess(
        preprocessStringToFloat,
        z.number().nonnegative("Debe ser un número positivo")
    ),
});

export type rowData= z.infer<typeof rowSchema>;


export const schema = z.object({
    P: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number().positive("Debe ser un numero Positivo")
            .int("Debe ser un numero entero de el 1% al 100%")
            .min(1,"El valor minimo es 1")
            .max(100,"El valor maximo es 100")
    ),
    Quantity: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number().positive("Debe ser un numero Positivo")
            .int("Debe ser un numero entero Positivo")
    ),
    Q: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number().positive("Debe ser un numero Positivo")
            .int("Debe ser un numero entero de el 1% al 100%")
            .min(1,"El valor minimo es 1")
            .max(100,"El valor maximo es 100")
    ),
    rows: z.array(rowSchema).min(1),
});

export type schemaRows = z.infer<typeof schema>;