import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
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

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Muestra y Fracciones Defectuosas',
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Muestra'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Fraciones defectuosass'
            }
        }
    }
};

type RowData = {
    Sample: number;
    Defective: number;
    DefectiveFractions: number;
};

type ChartProps = {
    rows: RowData[];
};

export const InitialChart: React.FC<ChartProps> = ({ rows }) => {
    const labels = rows.map(row => row.Sample);

    const data = {
        labels,
        datasets: [
            {
                label: 'Grafica Inicial',
                data: rows.map(row => row.DefectiveFractions),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data} />;
};
