import * as z from "zod";

export const LtcValidator = z.object({
  orderingCost: z
    .preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z.number().positive("Costo de ordenar (S) debe ser un número positivo")
    )
    .optional(),
  holdingCost: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z
      .number()
      .positive("Costo de mantenimiento (K) debe ser un número positivo")
  ),
  leadTime: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().positive("Tiempo de entrega (LT) debe ser un número positivo")
  ),
});

export type LtcFormData = z.infer<typeof LtcValidator>;

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

export const headerResultsLTC = [
  "Periodo",
  "Unidades",
  "Periodos Mantenidos",
  "Costo de Mantenimiento",
  "Costo de Mantenimiento Acumulado",
];

export const headerResultsLUC = [
  "Periodo",
  "Unidades",
  "S",
  "K",
  "Costo Total",
  "Costo Total por unidades",
];

export interface ResultLTC {
  period: number;
  units: number;
  holdingPeriods: number;
  holdingCost: number;
  cumulativeHoldingCost: number;
}

export function calculateLTC(data: LtcFormData, units: number[]): ResultLTC[] {
  const results: ResultLTC[] = [];
  let periodCounter = 0;
  let Counter = 0;

  units.forEach((unit) => {
    let beforeRow: ResultLTC = {
      period: 0,
      cumulativeHoldingCost: 0,
      holdingCost: 0,
      holdingPeriods: 0,
      units: 0,
    };

    if (periodCounter > 0) {
      beforeRow = results[Counter - 1];
    }

    const holdingCost = unit * periodCounter * data.holdingCost;
    const cumulativeHoldingCost =
      (holdingCost ?? 0) + beforeRow.cumulativeHoldingCost;

    const period: ResultLTC = {
      period: periodCounter + 1,
      units: unit,
      holdingPeriods: periodCounter,
      holdingCost: holdingCost,
      cumulativeHoldingCost: cumulativeHoldingCost,
    };

    results.push(period);

    periodCounter++;
    Counter++;
    if (cumulativeHoldingCost > (data.orderingCost ?? 0)) {
      periodCounter = 0;
    }
  });

  return results;
}

export interface ResultLUC {
  period: number;
  units: number;
  orderingCost: number;
  holdingCost: number;
  totalCost: number;
  totalUnitCost: number;
}

export function calculateLuC(data: LtcFormData, units: number[]): ResultLUC[] {
  const results: ResultLUC[] = [];
  let Counter = 0;
  let AccoumulateUnits = 0;
  let CostTotalBefore = 0;

  units.forEach((unit) => {
    const periodCounter = calculateAccoumulative(Counter + 1);
    AccoumulateUnits = AccoumulateUnits + unit;
    const orderingCost = data.orderingCost ?? 0;
    const holdingCost = data.holdingCost * periodCounter * Counter;
    let totalCost = CostTotalBefore + holdingCost;

    if (Counter === 0) {
      totalCost = orderingCost + holdingCost;
    }
    const period: ResultLUC = {
      period: periodCounter,
      units: AccoumulateUnits,
      orderingCost: parseFloat(orderingCost.toFixed(3)),
      holdingCost: parseFloat(holdingCost.toFixed(3)),
      totalCost: parseFloat(totalCost.toFixed(3)),
      totalUnitCost: parseFloat((totalCost / AccoumulateUnits).toFixed(3)),
    };

    results.push(period);

    Counter++;
    CostTotalBefore = totalCost;
  });

  return results;
}

//Costo de ordenar (S) debe ser un número positivo
// Costo de mantenimiento (K) debe ser un número positivo

function calculateAccoumulative(n: number): number {
  const sum = (n * (n + 1)) / 2;
  return sum;
}
