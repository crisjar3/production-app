"use client";

import React, { useState } from "react";
import {
  EoqFormula,
  CorrectiveMaintenanceFormula,
  LtcFormula,
  ConatinerInventaryFormula,
  InventoryFormula,
} from "./Eoq";
import { EOQCalculator } from "./Forms/EoqCalculator";
import { CorrectiveMaintenanceCalculator } from "./Forms/CorrectiveMaintenanceCalculator";
import { LtcCalculator } from "./Forms/LtcCalculator";
import { ContainerInventoryCalculator } from "./Forms/ConatinerInventaryCalculator";
import SearchBar from "./SearchBarCalculator";
import { cx } from "class-variance-authority";
import { InventoryCalculator } from "./Forms/InventoryCalculator";

interface FormulaItem {
  title: string;
  description: string;
  formulaComponent: React.FC;
  Id: string;
  FormulaDialog: React.FC;
}

interface Props {
  items: FormulaItem[];
}

export const FormulaItems: React.FC<Props> = ({ items }) => {
  const [show, setShow] = useState({
    state: false,
    Id: "0",
  });

  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const highlightElementById = (id: string) => {
    setHighlightedId(() => id);
    setTimeout(() => {
      setHighlightedId(()=> "");
    }, 1500);
  };

  const handleClick = (id: string) => {
    setShow({ state: !show.state, Id: id });
  };

  return (
    <div>
      <SearchBar data={items} highlightElementById={highlightElementById} />

      {items.map((item) => (
        <div
          id={item.Id}
          key={item.Id}
          tabIndex={0}
          aria-label={`Show formula for ${item.title}`}
          className={cx(
            'rounded-md shadow mt-10',
            {
              'bg-white': highlightedId !== item.Id,
              'bg-gray-300': highlightedId === item.Id,
            }
          )}
        >
          <div className="px-6 py-4 flex justify-between">
            <div className="w-0 flex-1">
              <div className="max-h-40 mt-1 text-xs text-gray-500">
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/calculator`}
                >
                  Calculator
                </a>
                <span className="px-1">•</span>
                <span>Method:</span>
                {item.title}
              </div>
              <div onClick={() => handleClick(item.Id)}>
                <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
                  {item.title}
                </h1>

                <h2 className="text-base text-gray-700">{item.description}</h2>

                <item.formulaComponent />

                {/* {show.state && show.Id === item.Id && <item.FormulaDialog />} */}
              </div>

              {show.state && show.Id === item.Id && <item.FormulaDialog />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Items = () => {
  return <FormulaItems items={data} />;
};

const data: FormulaItem[] = [
  {
    title: "EOQ",
    description:
      "EOQ El cálculo del EOQ ayuda a las empresas a equilibrar estos tres costes y a eliminar cualquier gasto innecesario importante",
    formulaComponent: EoqFormula,
    Id: "Eoq",
    FormulaDialog: EOQCalculator,
  },
  {
    title: "Mantenimiento Correctivo",
    description:
      "Conjunto de tareas técnicas, destinadas a corregir las fallas del equipo que demuestren la necesidad de reparación o reemplazo.",
    formulaComponent: CorrectiveMaintenanceFormula,
    Id: "CorrectiveMaintenance",
    FormulaDialog: CorrectiveMaintenanceCalculator,
  },
  {
    title: "LTC Y LUC",
    description: "Métodos para encontrar la cantidad óptima de pedidos por LTC Y LUC",
    formulaComponent: LtcFormula,
    Id: "LTC",
    FormulaDialog: LtcCalculator,
  },
  {
    title: "Cantidad de recipientes y inventario acumulado",
    description:
      "Cálculos para determinar recipientes y inventario acumulado que necesita una empresa",
    formulaComponent: ConatinerInventaryFormula,
    Id: "ContainerInventary",
    FormulaDialog: ContainerInventoryCalculator,
  },
  {
    title: "Administracion de Inventario",
    description:
      "Calculos Relacionado a Inventario con un modelo de periodo fijo.",
    formulaComponent: InventoryFormula,
    Id: "Inventary",
    FormulaDialog: InventoryCalculator,
  },
];
