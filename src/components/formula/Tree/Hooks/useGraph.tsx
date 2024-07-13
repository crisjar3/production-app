import { useEffect, useState } from "react";
import generateProductTreeV2, {
  Product,
  fetchGraphvizImageAsync,
  Component,
} from "../Utils";

interface GraphData {
  image: string | null;
  loading: boolean;
  error: Error | null;
  demand: number;
  show?: false | boolean;
}

export const useGraph = (data: Product) => {
  const [graphData, setGraphData] = useState<GraphData>({
    image: null,
    loading: true,
    error: null,
    demand: 0,
  });
  const demand = calculateTotalComponents(data);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const graphUrl = generateProductTreeV2(data);
        const result = await fetchGraphvizImageAsync(graphUrl);
        setGraphData({
          image: result,
          loading: false,
          error: null,
          demand: 0,
        });
      } catch (error) {
        setGraphData({
          image: null,
          loading: false,
          error: error as Error,
          demand: 0,
        });
      }
    };

    if (data.components.length > 0) {
      fetchGraph();
    }
  }, [data]);

  return { ...graphData, demand, show: data.components.length > 0 };
};

export default function calculateTotalComponents(product: Product): number {
  function calculateComponentTotal(
    component: Component,
    multiplier: number
  ): number {
    let total = 0;

    if (
      component.subcomponents !== undefined &&
      component.subcomponents!.length > 0
    ) {
      total = component.quantity * multiplier;
    }

    component.subcomponents?.forEach((subcomponent) => {
      total += subcomponent.quantity * component.quantity;
    });

    // alert(`el total es ${total} de el componente ${component.name}`)
    return total;
  }

  let total = 0;

  product.components.forEach((component) => {
    total += calculateComponentTotal(component, 1);
  });

  return total;
}
