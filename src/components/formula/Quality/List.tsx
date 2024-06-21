"use client";

import React from "react";
import {EoqFormula,} from "../Eoq";
import {cx} from "class-variance-authority";
import {QualityCalculator} from "@/components/formula/Forms/QualityCalculator";

export interface FormulaItem {
    title: string;
    description: string;
    formulaComponent: React.FC;
    Id: string;
    FormulaDialog: React.FC;
}

interface Props {
    items: FormulaItem[];
}

export const FormulaItems: React.FC<Props> = ({items}) => {

    return (
        <div>
            {items.map((item) => (
                <div
                    id={item.Id}
                    key={item.Id}
                    tabIndex={0}
                    aria-label={`Show formula for ${item.title}`}
                    className={cx(
                        'rounded-md shadow mt-10 bg-white'
                    )}
                >
                    <div className="px-6 py-4 flex justify-between">
                        <div className="w-0 flex-1">
                            <div className="max-h-40 mt-1 text-xs text-gray-500">
                                <a
                                    className="underline text-zinc-900 text-sm underline-offset-2"
                                    href={`/calculator`}
                                >
                                    Calculadora de Control de Calidad
                                </a>
                                <span className="px-1">•</span>
                                <span>Metodo:</span>
                                {item.title}
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
                                    {item.title}
                                </h1>

                                <h2 className="text-base text-gray-700">{item.description}</h2>

                                {/*<item.formulaComponent/>*/}
                            </div>

                            <item.FormulaDialog/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const Items = () => {
    return <FormulaItems items={data}/>;
};

const data: FormulaItem[] = [
    {
        title: "Control de Calidad",
        description:
            "Control de Calidad",
        formulaComponent: EoqFormula,
        Id: "Calidad Control",
        FormulaDialog: QualityCalculator,
    },
];
