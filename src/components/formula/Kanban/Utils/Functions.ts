import {rowKanbanData} from "./SchemaValidator";

export type resultKanban = {
    Weeks: number
    Demand: number
    DeliveryTime: number
    SecurityStock: number
    StorageCapacity: number
    Kanban: number
}

export function calculateKanban(data: rowKanbanData[]) {

    const results: resultKanban[] = []

    data.forEach(row => {
        const result: resultKanban = {
            Weeks: row.Product,
            Demand: row.Demand * (row.PercentageDemand / 100),
            DeliveryTime: row.DeliveryTime,
            SecurityStock: row.SecurityStock / 100,
            StorageCapacity: row.Storage,
            Kanban: 0
        }

        const kanban = (result.Demand * result.DeliveryTime * (1 + result.SecurityStock)) / result.StorageCapacity;

        result.Kanban = Number(kanban.toFixed(3))

        results.push(result);
    })

    return results;
}