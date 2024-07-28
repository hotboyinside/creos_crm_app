import './BarChart.css';

import { Bar } from "react-chartjs-2";

import { IChartData } from '../../models/models.ts';

interface BarChartProps {
    statisticsData: IChartData;
}

function BarChart({statisticsData}: BarChartProps) {
    return (
        <div className="bar-chart__container">
            <h2 className='title'>Bar Chart</h2>
            <Bar
                data={ statisticsData }
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Экономика проектов по рабочим неделям"
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    )
}

export default BarChart
