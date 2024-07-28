import './PieChart.css';

import { Pie } from "react-chartjs-2";

import { IChartData } from '../../models/models.ts';

interface PieChartProps {
    issuesStatusData: IChartData;
}

function PieChart({issuesStatusData}: PieChartProps) {
    return (
        <div className="pie-chart__container">
            <h2 className='title'>Pie Chart</h2>
            <Pie
                data={ issuesStatusData }
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Соотношение задач"
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

export default PieChart
