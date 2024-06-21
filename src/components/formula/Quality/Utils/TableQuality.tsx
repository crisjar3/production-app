import {Children, ReactElement, ReactNode} from "react";

type DataTableProps = {
    title: ReactNode;
    subtitle?: ReactNode;
    headers: string[];
};

type DataRowProps = {
    children: ReactElement[];
};

const DataTable: React.FC<DataTableProps> = ({title, subtitle, headers, children}) => {
    return (
        // <MagicMotion>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <caption
                    className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    {title}
                    {subtitle && (
                        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    {headers.map((header, index) => (
                        <th scope="col" key={index} className="px-6 py-3">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {Children.map(children, (child, index) => {
                    if (isValidDataRow(child)) {
                        return (
                            <tr
                                key={index}
                                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700`}
                            >
                                {child.props.children}
                            </tr>
                        );
                    } else {
                        return null;
                    }
                })}
                </tbody>
            </table>
        </div>
        // </MagicMotion>
    );
};

const DataRow: React.FC<DataRowProps> = ({children}) => {
    return <>{children}</>;
};

const isValidDataRow = (child: any): child is ReactElement<DataRowProps> => {
    return child && typeof child === "object" && "props" in child && "children" in child.props;
};

export {DataTable, DataRow};
