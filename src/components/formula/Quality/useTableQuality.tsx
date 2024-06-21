// import React, {useState} from "react";
// import {DataRow, DataTable} from "@/components/formula/Quality/Utils/TableQuality";
// import {z} from "zod";
// import {Input} from "@/components/ui/Input";
// import {useToast} from "@/hooks/use-toast";
// import {useForm} from "react-hook-form";
// import {zodResolver} from "@hookform/resolvers/zod";
//
// const preprocessStringToFloat = (value: any) => {
//     // alert("Validating value form proccesing" + value + typeof value)
//     const stringValue = typeof value !== 'string' ? value.toString() : value;
//
//     return parseFloat(stringValue);
// };
//
// const DataValidator = z.object({
//     Sample: z.preprocess(
//         preprocessStringToFloat,
//         z.number().nonnegative("Debe ser un numero Positivo")
//     ),
//     Defective: z.preprocess(
//         preprocessStringToFloat,
//         z.number().nonnegative("Debe ser un numero Positivo")
//     ),
//     DefectiveFractions: z.preprocess(
//         preprocessStringToFloat,
//         z.number().nonnegative("Debe ser un numero Positivo")
//     ),
// });
//
// type DataRowType = z.infer<typeof DataValidator>;
//
//
// const useDefectiveFractions = () => {
//
//     const {
//         register,
//         formState: {errors},
//         getValues
//     } = useForm<DataRowType>({
//         resolver: zodResolver(DataValidator),
//     });
//
//     const inputComponent = (<td>
//         <Input
//             className="min-w-[65px] max-w-1 w-max p-1 border-t-1 border rounded m-2"
//             {...register("DefectiveFractions")}
//             type="text"
//             id={'DefectiveFractions'}
//         />
//
//         {errors?.DefectiveFractions && (
//             <p className="text-red-600">{errors.DefectiveFractions.message}</p>
//         )}
//
//     </td>)
//
//     return {
//         inputComponent,
//         value: getValues("DefectiveFractions")
//     }
// }
//
// export function useTableQuality() {
//     const [rows, setRows] = useState<DataRowType[]>([
//         {Sample: 1, Defective: 1, DefectiveFractions: 1},
//     ]);
//
//     const {toast} = useToast();
//     const {value, inputComponent} = useDefectiveFractions()
//
//     const handleChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//         rowIndex: number,
//         key: keyof DataRowType
//     ) => {
//         const {value} = event.target;
//         const ParsedValue = value === "" ? "0" : value;
//
//         const result = DataValidator.safeParse({
//             ...rows[rowIndex],
//             [key]: ParsedValue.toString(),
//         });
//
//         if (result.success) {
//
//             setRows((prevRows) => {
//                 const updatedRows = [...prevRows];
//                 updatedRows[rowIndex] = {
//                     ...updatedRows[rowIndex],
//                     [key]: result.data[key],
//                 };
//                 return updatedRows;
//             });
//         } else {
//
//             alert(JSON.stringify(result.error))
//             toast({
//                 title: "Por favor ingrese valores validos, solo pueden ser numeros positivos"
//             });
//         }
//     };
//
//     // Add a new row
//     const addRow = () => {
//         const result = DataValidator.safeParse(rows.at(-1))
//
//         if (!rows.every(element => element.Defective > 0 && element.Sample > 0)) {
//             toast({title: "Porfavor ingresa datos mayores a 0"})
//             return
//         }
//
//
//         if (!result.success) {
//             alert(JSON.stringify(result))
//             toast({title: "Porfavor ingresa datos validos"})
//             return
//         }
//
//         if (value <= 0 || value === undefined) {
//             toast({title: "Porfavor agrega un valor valido en Fracciones defectuosas"});
//             return;
//         }
//
//         const updatedRows:DataRowType[] = [rows]
//
//         setRows((prevRows) => [
//             ...prevRows,
//             // {...prevRows[-1], DefectiveFractions: value},
//             {Sample: 1, Defective: 1, DefectiveFractions: 1},
//         ]);
//
//
//         scrollTo90Percent()
//     };
//
//
//     // Get all rows
//     const getAllRows = () => rows;
//
//     const Table = (
//         <DataTable
//             title="Datos"
//             headers={["Muestra", "Defectos", "Fracciones Defectuosas"]}
//         >
//             {rows.map((row, rowIndex) => (
//                 <DataRow key={rowIndex}>
//                     <td>
//                         <Input
//                             className="min-w-[65px] max-w-1 w-max p-1 border-t-1 border rounded m-2"
//                             value={row.Sample.toString()}
//                             onChange={(event) => handleChange(event, rowIndex, "Sample")}
//                             type="number"
//                         />
//
//                     </td>
//                     <td>
//                         <Input
//                             className="min-w-[65px] max-w-1 w-max p-1 border-t-1 border rounded m-2"
//                             value={row.Defective.toString()}
//                             onChange={(event) => handleChange(event, rowIndex, "Defective")}
//                             type="number"
//                         />
//
//                     </td>
//
//                     {inputComponent}
//                 </DataRow>
//             ))}
//         </DataTable>
//     );
//
//     return {
//         Table,
//         addRow,
//         getAllRows,
//     };
// }
//
// function scrollDownFromCenter() {
//     const totalHeight = document.documentElement.scrollHeight;
//
//     const viewportCenter = window.innerHeight / 2;
//
//     const scrollAmount = totalHeight * 0.2;
//
//     const currentScroll = window.scrollY;
//
//     window.scrollTo({
//         top: currentScroll + viewportCenter + scrollAmount,
//         behavior: 'smooth' // Opcional: hace el scroll de manera suave
//     });
// }
//
// function scrollTo90Percent() {
//     // // Obtener la altura total del documento
//     // const totalHeight = document.documentElement.scrollHeight;
//     //
//     // // Realizar el scroll hasta la parte más baja
//     // window.scrollTo({
//     //     top: totalHeight,
//     //     behavior: 'smooth' // Opcional: hace el scroll de manera suave
//     // });
//
//     setTimeout(() => {
//         // Realizar el scroll aquí
//         window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: 'smooth'
//         });
//     }, 5);
// }