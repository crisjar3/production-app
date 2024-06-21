import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Grafica de Resultados con LIC y LSC',
        },
    },
};


type RowData = {
    Sample: number;
    Defective: number;
    DefectiveFractions: number;
};

type ChartProps = {
    rows: RowData[];
    LSC:number;
    LIC: number;
};

const ResultChart: React.FC<ChartProps> = ({rows,LSC,LIC}) => {
    const labels = rows.map(row => row.Sample);
    const data = {
        labels,
        datasets: [
            {
                label: 'Defective Fractions',
                data: rows.map(row => row.DefectiveFractions),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'LSC',
                data: [LSC],
                borderColor: 'rgb(100, 136, 185)',
                backgroundColor: 'rgb(100, 136, 185)',
            },
            {
                label: 'LIC',
                data: [LIC],
                borderColor: 'rgb(100, 185, 173)',
                backgroundColor: 'rgb(100, 185, 173)',
            },
        ],
    };

    return <Line options={options} data={data}/>;
};

export default ResultChart;
