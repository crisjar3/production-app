import * as React from "react";
import { useForm } from "react-hook-form";
import "katex/dist/katex.min.css";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditDataTable,
  useEditableTable,
} from "@/components/Generics/EditableTable";
import {
  ButtonState,
  LucFormData,
  LucValidator,
  ResultLTC,
  calculateLTC,
  generateHeaders,
  generateNumberObject,
  headerResults,
} from "@/lib/utils/LUC/utils";
import DataTable from "@/components/Generics/DataTable";

interface State {
  showTableUnits: boolean;
  showTableResults: boolean;
  headerTableUnits: string[];
  buttomValue: ButtonState;
  results: ResultLTC[];
}

export function LucCalculator({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LucFormData>({
    resolver: zodResolver(LucValidator),
  });

  const { toast } = useToast();
  const { areAllRowsGreaterThanZero, updateRow, rows, updateRows } =
    useEditableTable([]);

  const [state, setState] = React.useState<State>({
    showTableUnits: false,
    showTableResults: false,
    headerTableUnits: [""],
    buttomValue: ButtonState.InsertValues,
    results: [],
  });

  const showUnitTable = (leadTime: number) => {
    const headers = generateHeaders(leadTime);
    const initialRows = generateNumberObject(leadTime);

    updateRows([initialRows]);

    setState((prevState) => ({
      ...prevState,
      showTableUnits: true,
      headerTableUnits: headers,
      buttomValue: ButtonState.ShowResults,
    }));
  };

  const showResultTable = (data: LucFormData) => {
    if (!areAllRowsGreaterThanZero()) {
      toast({
        title: "Error",
        description: "Por favor, rellena todas las columnas.",
        variant: "destructive",
      });
      return;
    }

    setState((prevState) => ({
      ...prevState,
      showTableResults: true,
      buttomValue: ButtonState.Reset,
      results: calculateLTC(
        data,
        Object.values(rows[0]).map((row) => row)
      ),
    }));
  };

  const reset = () => {
    setState({
      showTableUnits: false,
      showTableResults: false,
      headerTableUnits: [""],
      buttomValue: ButtonState.InsertValues,
      results: [],
    });
  };

  const handleSteps = (data: LucFormData) => {
    const { orderingCost, holdingCost, leadTime } = data;

    if (!orderingCost || !holdingCost || !leadTime) {
      toast({
        title: "Error",
        description: "Por favor, ingrese todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    if (state.buttomValue === ButtonState.InsertValues) {
      showUnitTable(leadTime);
      return;
    }

    if (state.buttomValue === ButtonState.ShowResults) {
      showResultTable(data);
      return;
    }

    reset();
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => handleSteps(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de LUC para Producción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="orderingCost">Costo de Ordenar (S)</Label>
              <Input
                id="orderingCost"
                {...register("orderingCost")}
                type="text"
                required
                disabled={state.showTableResults}
              />
              {errors?.orderingCost && (
                <p className="text-red-600">{errors.orderingCost.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="holdingCost">Costo de Mantenimiento (K)</Label>
              <Input
                id="holdingCost"
                {...register("holdingCost")}
                type="text"
                disabled={state.showTableResults}
                required
              />
              {errors?.holdingCost && (
                <p className="text-red-600">{errors.holdingCost.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="leadTime">
                Tiempo de Entrega (LT) en Semanas
              </Label>
              <Input
                id="leadTime"
                {...register("leadTime")}
                type="number"
                required
                disabled={state.showTableUnits}
              />
              {errors?.leadTime && (
                <p className="text-red-600">{errors.leadTime.message}</p>
              )}
            </div>

            {state.showTableUnits && (
              <EditDataTable
                title="Semanas"
                subtitle="Unidades en la semana"
                headers={state.headerTableUnits}
                isEditable={!state.showTableResults}
                updateRow={updateRow}
                rows={rows}
              />
            )}

            {state.showTableResults && (
              <DataTable
                title="Resultado"
                subtitle="Resultado"
                headers={headerResults}
                rows={state.results}
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button>{state.buttomValue}</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
