import * as z from "zod";

export const LucValidator = z.object({
  orderingCost: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z.number().positive("Costo de ordenar (S) debe ser un número positivo")
    )
    .optional(),
  holdingCost: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z
        .number()
        .positive("Costo de mantenimiento (K) debe ser un número positivo")
    )
    .optional(),
  leadTime: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().positive("Tiempo de entrega (LT) debe ser un número positivo")
  ),
});

export type LucFormData = z.infer<typeof LucValidator>;

export function generateNumberObject(n: number): { [key: string]: number } {
  return Array.from({ length: n }, (_, i) => (i + 1).toString()).reduce(
    (acc: { [key: string]: number }, key) => {
      acc[key] = 0;
      return acc;
    },
    {}
  );
}

export function generateHeaders(n: number) {
  return Array.from({ length: n }, (_, i) => (i + 1).toString());
}

export enum ButtonState {
  InsertValues = "Insertar Unidades",
  ShowResults = "Mostrar Resultados",
  Reset = "Resetear",
}

export const headerResults = [
  "Periodo",
  "Unidades",
  "Periodos Mantenidos",
  "Costo de Mantenimiento",
  "Costo de Mantenimiento Acumulado",
];

export interface ResultLTC {
  period: number;
  units: number;
  holdingPeriods: number;
  holdingCost: number;
  cumulativeHoldingCost: number;
}

export function calculateLTC(data: LucFormData, units: number[]): ResultLTC[] {
  const results: ResultLTC[] = [];
  let counter = 0;

  units.forEach((unit) => {
    let beforeCost = 0;

    if (counter > 0) {
      beforeCost = results[counter - 1].holdingCost;
    }
    const period: ResultLTC = {
      period: counter,
      units: unit,
      holdingPeriods: counter,
      holdingCost: data.holdingCost ?? 0,
      cumulativeHoldingCost: data.holdingCost ?? 0 + beforeCost,
    };

    results.push(period);
    counter++;
  });

  return results;
}
