import {rowData} from "@/components/formula/Quality/Utils/SchemaValidator";

export function caclculateLC(rows: rowData[]) {

    let totalDefectiveFractions = 0;
    let defectiveCount = 0;

    for (const row of rows) {
        if (row.Defective === 1) {
            totalDefectiveFractions += row.DefectiveFractions;
            defectiveCount++;
        }
    }

    if (defectiveCount === 0) {
       return 0
    }

    return totalDefectiveFractions / defectiveCount;
}

export function calculateLSC(P: number, n: number, Q: number) {
    if (n === 0) {
        throw new Error("M4 no puede ser cero, ya que causaría una división por cero.");
    }

    return P + 3 * Math.sqrt((P * Q) / n);
}

export function calculateLIC(P: number, n: number, Q: number) {
    if (n === 0) {
        throw new Error("M4 no puede ser cero, ya que causaría una división por cero.");
    }

    const LIC = P - 3 * Math.sqrt((P * Q) / n);
    return LIC < 0 ? 0 : LIC;
}