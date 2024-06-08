// EoqFormula.js
import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export const EoqFormula = () => {
  const eoqFormula = String.raw`\text{EOQ} = \sqrt{2d \cdot \frac{S}{H}}`;
  return (
    <div>
      <h2>Fórmula</h2>
      <BlockMath math={eoqFormula} />
    </div>
  );
};

export const CorrectiveMaintenanceFormula = () => {
  const cmcFormula = String.raw`\text{CMC} = \text{NF} \cdot (\text{CTM} + \text{CF})`;
  return (
    <div>
      <h2>Fórmula</h2>
      <BlockMath math={cmcFormula} />
    </div>
  );
};

export const LtcFormula = () => {
  const LucFormula = String.raw`\text{Primera Iteracion} = \text{S} \cdot \text{K}`;
  return (
    <div>
      <h2>Fórmula</h2>
      <BlockMath math={LucFormula} />
    </div>
  );
};

export const InventoryFormula = () => {
  const formula1 = String.raw`\text{Valor promedio del inventario} = \frac{D(T)}{2} + \text{SS}`;
  const formula3 = String.raw`\text{Rotación de inventario} = \frac{D}{\text{Inventario promedio}}`;
  const formula5 = String.raw`\text{Valor promedio del inventario} = \frac{Q}{2} + \text{SS}`;
  

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Formulas</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="">
          <BlockMath math={formula1} />
        </div>
        <div className="">
          <BlockMath math={formula3} />
        </div>
        <div className="">
          <BlockMath math={formula5} />
        </div>
      </div>
    </div>
  );
};




export const ConatinerInventaryFormula = () => {
  const NFormula = String.raw`N = \frac{D \cdot T}{60 \cdot C}`;
  const IMFormula = String.raw`IM = N \cdot C`;

  return (
    <div>
      <h2>Fórmulas</h2>
      <h3>Fórmula para N:</h3>
      <BlockMath math={NFormula} />
      <h3>Fórmula para IM:</h3>
      <BlockMath math={IMFormula} />
    </div>
  );
};
