"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, Product } from "../Tree/Utils"; // Asume que el validador se exporta desde un archivo separado
import { Button } from "@/components/ui/Button"; // Ajusta el import según tu estructura de archivos
import Graph from "../Tree/Graph";
import { useGraph } from "../Tree/Hooks/useGraph";
import Image from "next/image";

interface SubComponentsProps {
  control: any;
  register: any;
  index: number;
  errors: any;
}

function SubComponents({
  control,
  register,
  index,
  errors,
}: SubComponentsProps) {
  const { fields: subComponentFields, append: appendSubComponent } =
    useFieldArray({
      control,
      name: `components.${index}.subcomponents`,
    });

  return (
    <div>
      {subComponentFields.map((subComponent, subIndex) => (
        <div key={subComponent.id} className="mb-4 pl-4 border-l">
          <div className="mb-4">
            <label className="block mb-2">Nombre de SubComponente</label>
            <input
              className="border p-2 w-full"
              {...register(
                `components.${index}.subcomponents.${subIndex}.name`
              )}
            />
            {errors.components?.[index]?.subcomponents?.[subIndex]?.name && (
              <p className="text-red-600">
                {
                  errors.components[index].subcomponents[subIndex]?.name
                    ?.message
                }
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Cantidad de SubComponente</label>
            <input
              className="border p-2 w-full"
              type="number"
              {...register(
                `components.${index}.subcomponents.${subIndex}.quantity`,
                { valueAsNumber: true }
              )}
            />
            {errors.components?.[index]?.subcomponents?.[subIndex]
              ?.quantity && (
              <p className="text-red-600">
                {
                  errors.components[index].subcomponents[subIndex]?.quantity
                    ?.message
                }
              </p>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => appendSubComponent({ name: "", quantity: 0 })}
      >
        Agregar SubComponente
      </Button>
    </div>
  );
}

export function TreeCalculator() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(ProductSchema),
  });
  const [state, setState] = useState<Product>({
    components: [],
    name: "",
  });

  const { loading, image, demand, show } = useGraph(state);

  const {
    fields: componentFields,
    append: appendComponent,
  } = useFieldArray({
    control,
    name: "components",
  });

  const onSubmit = (data: Product) => {
    setState(data);
  };

  const onReset = () => {
    reset({
      name: "",
      components: [],
    });
    setState({
      components: [],
      name: "",
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="mb-4">
          <label className="block mb-2">Nombre de Producto</label>
          <input className="border p-2 w-full" {...register("name")} />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>

        {errors.components && <p className="text-red-600">{errors.components.message}</p>}
        {componentFields.map((component, index) => (
          <div key={component.id} className="mb-4 border p-4">
            <div className="mb-4">
              <label className="block mb-2">Nombre de Componente</label>
              <input
                className="border p-2 w-full"
                {...register(`components.${index}.name`)}
              />
              {errors.components?.[index]?.name && (
                <p className="text-red-600">
                  {errors.components[index]?.name?.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Cantidad</label>
              <input
                className="border p-2 w-full"
                type="number"
                {...register(`components.${index}.quantity`, {
                  valueAsNumber: true,
                })}
              />
              {errors.components?.[index]?.quantity && (
                <p className="text-red-600">
                  {errors.components[index]?.quantity?.message}
                </p>
              )}
            </div>
            <SubComponents
              control={control}
              register={register}
              index={index}
              errors={errors}
            />
          </div>
        ))}
        <div className="flex gap-4 border-r-4">
          <Button
            type="button"
            onClick={() =>
              appendComponent({ name: "", quantity: 0, subcomponents: [] })
            }
          >
            Agregar componente
          </Button>
          <Button type="submit" className="br-1">
            Guardar Producto
          </Button>

          <Button type="button" onClick={onReset} className="br-1">
            Resetear
          </Button>
        </div>
      </form>

      {!loading && show && (
        <div className="flex justify-center items-center flex-row">
          <Image
            style={{
              maxWidth: "100%",
              height: "auto",
              width: "auto",
              alignItems: "center",
            }}
            width={100} // Ajusta el ancho de la imagen según sea necesario
            height={80} // Ajusta la altura de la imagen según sea necesario
            src={image ?? ""}
            alt="Image"
          />
          <h1>EL resultado de la demanda es {demand}</h1>
        </div>
      )}
    </>
  );
}
