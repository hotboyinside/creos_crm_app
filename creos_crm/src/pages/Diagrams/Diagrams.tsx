import './Diagrams.css'

import { Service } from '../../service/service';

import { useState } from "react";

import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import Header from '../../components/Header/Header';
import { Data } from '../../data.ts'

function Diagrams() {
    const now = new Date();
    const currDateWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekdays: {
        [key: number]: number
    } = {
        0: 6,
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5
    }
    const currDay = now.getDay();
    const remainDaysOfEndWeek = weekdays[currDay];
    const passedDaysFromStart = remainDaysOfEndWeek * 1000 * 60 * 60 * 24;
    const startDayOfWeekInMiliseconds = currDateWithoutTime.getTime() - passedDaysFromStart;
    const weekInMiliseconds = 7 * 1000 * 60 * 60 * 24;
    const currDate = new Date("2024-06-21T11:00:18Z").getTime();
    const countWorkWeeksFromUser = 8;
    for (let i=0; i < countWorkWeeksFromUser; i++) {
        const currStartOfWeekInMiliseconds = startDayOfWeekInMiliseconds - (i * weekInMiliseconds);
        if (currDate > currStartOfWeekInMiliseconds) {
            console.log('Рабочая неделя: ' + (i + 1))
            break
        }
    }

    console.log(startDayOfWeekInMiliseconds)
    console.log(new Date(currDateWithoutTime.getTime() - passedDaysFromStart).toLocaleString());
    
    const service = Service.getInstance();
    
    // console.log('День недели:' + now.getDay())
    // console.log('Часы:' + now.getHours())
    // console.log('Минуты:' + now.getMinutes())
    // console.log('Секунды:' + now.getSeconds())

    Chart.register(CategoryScale);

    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.year),
        datasets: [
            {
                label: "Users Gained ",
                data: Data.map((data) => data.userGain),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "&quot;#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
            }
        ]
    })
    console.log(chartData)

    return (
        <>
            <Header />
            <div className="chart-container">
                <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
                <Pie
                    data={chartData}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: "Users Gained between 2016-2020"
                            }
                        }
                    }} />
            </div>
        </>
    )
}

export default Diagrams