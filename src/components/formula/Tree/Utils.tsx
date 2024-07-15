import * as z from "zod";

export const SubComponentSchema = z.object({
  name: z.string().nonempty("Nombre de subcomponente requerido"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
});

export const ComponentSchema = z.object({
  name: z.string().nonempty("Nombre de Componente es requerido"),
  quantity: z.number().int().positive("Cantidad debe ser un numero Positivo"),
  subcomponents: z.array(SubComponentSchema).optional(),
});

export const ProductSchema = z.object({
  name: z.string().nonempty("Nombre de producto es requerido"),
  quantity: z.number().int().positive("Cantidad debe ser un numero Positivo"),
  components: z.array(ComponentSchema).min(1, "Debe agregar al menos un Componente "),
});

export type SubComponent = z.infer<typeof SubComponentSchema>;
export type Component = z.infer<typeof ComponentSchema>;
export type Product = z.infer<typeof ProductSchema>;

export default function generateProductTreeV2(product: Product): string {
  console.log("Product:", product);
  let tree = `digraph G {\n`;

  tree += `  graph [bgcolor=transparent];\n`;
  tree += `  node [shape=box, style=filled, color=lightblue];\n`;

  product.components.forEach((component) => {
    let fillColor = getRandomColor();

    tree += `  "${product.name}" -> "${component.name}";\n`;
    tree += `  "${component.name}" [label="${component.name} (${component.quantity})", fillcolor="${fillColor}"];\n`;

    component.subcomponents?.forEach((subcomponent) => {
      let subFillColor = getRandomColor();
      tree += `  "${component.name}" -> "${subcomponent.name}";\n`;
      tree += `  "${subcomponent.name}" [label="${subcomponent.name} (${subcomponent.quantity})", fillcolor="${subFillColor}"];\n`;
    });
  });

  tree += `}\n`;

  console.log("DOT code:", tree);
  return tree;
}

function getRandomColor() {
  const colors = [
    "#F2F2F2", // Blanco-grisáceo
    "#FFEFBC", // Amarillo pálido
    "#D1E2CE", // Verde claro
    "#FADAE5", // Rosa claro
    "#ECE3D5", // Beige claro
    "#ECE3C1", // Amarillo claro
    "#BEDFC8", // Verde agua
    "#F9F2B6", // Amarillo pastel
    "#DDD0E5", // Lila claro
    "#F2E4C8", // Crema
    "#CBCBCB", // Gris claro
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

function generateGraphURL(dotCode: string) {
  dotCode = dotCode.trim().replace(/\n\s*/g, "");

  let encodedDot = encodeURIComponent(dotCode);

  let url = `https://quickchart.io/graphviz?graph=${encodedDot}`;

  return url;
}

export const fetchGraphvizImageAsync = async (
  dotcode: string
): Promise<string | null> => {
  const apiUrl = "https://quickchart.io/graphviz";
  const requestBody = {
    graph: dotcode,
    layout: "dot",
    format: "png",
  };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const blob = await response.blob();
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return base64Data;
    } else {
      console.error(`Error: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching the image:", error);
    return null;
  }
};
