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
  const TitleFormula1 = String.raw`\text{Valor promedio del inventario =}`;
  const formula1 = String.raw`\frac{D(T)}{2} + \text{SS}`;
  const TitleFormula2 = String.raw`\text{Rotación de inventario} =`;
  const formula2 = String.raw` \frac{D}{\text{Inventario promedio}}`;
  // const TitleFormula3 = String.raw`\text{Valor promedio del inventario} =`;
  //
  // const formula3 = String.raw`\frac{Q}{2} + \text{SS}`;
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Formulas</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="">
          <BlockMath math={TitleFormula1} />
          <BlockMath math={formula1} />
        </div>
        <div className="">
          <BlockMath math={TitleFormula2} />
          <BlockMath math={formula2} />
        </div>
        {/*<div className="">*/}
        {/*  <BlockMath math={TitleFormula3} />*/}
        {/*  <BlockMath math={formula3} />*/}
        {/*</div>*/}
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

export const KanbanFormula = () => {
    const KFormula = String.raw`K = \frac{D \cdot L \cdot (1 + \infty)}{c}`;
    const totalFormula = String.raw`Total = K1 + K2 + K3 + K4 + K5 +...Kn`;

    return (
        <div>
            <h2>Fórmulas</h2>
            <h3>Fórmula para K:</h3>
            <BlockMath math={KFormula} />
            <BlockMath math={totalFormula} />
        </div>
    );
};

export const TreeFormula = () => {
  const formulaExplanation = `Vamos a calcular la demanda como: 
  SubComponenteN * ComponenteN * Producto + SubComponenteN+1 * ComponenteN * Producto, 
  y así sucesivamente.`;

  return (
      <div>
          <h2>Fórmulas</h2>
          <h3>Explicación de la Demanda:</h3>
          <p>{formulaExplanation}</p>
      </div>
  );
};
