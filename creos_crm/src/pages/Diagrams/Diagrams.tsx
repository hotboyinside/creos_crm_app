import './Diagrams.css'

import { Service } from '../../service/service';
import { Statistic, WeekNumber, IssueStatusStatistic } from '../../models/models.ts';

import { useState, useEffect } from "react";

import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import Header from '../../components/Header/Header';

function Diagrams() {
    const service = Service.getInstance();

    const [statistics, setStatistics] = useState<Map<WeekNumber, Statistic> | null>(null);
    const [loadingStatistic, setLoadingStatistic] = useState<boolean>(true);
    const [errorStatistic, setErrorStatistic] = useState<string | null>(null);

    const [statusIssues, setStatusIssues] = useState<IssueStatusStatistic>({});
    const [loadingStatusIssues, setLoadingStatusIssues] = useState<boolean>(true);
    const [errorStatusIssues, setErrorLoadingStatusIssues] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatusIssues = async () => {
            try {
                const stats = await service.getIssuesStatus();
                setStatusIssues(stats);
            } catch (err) {
                setErrorLoadingStatusIssues('Невозможно подключиться к серверу');
            } finally {
                setLoadingStatusIssues(false);
            }
        };

        fetchStatusIssues();
    }, []);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const stats = await service.getEconomicStatistic();
                setStatistics(stats);
            } catch (err) {
                setErrorStatistic('Невозможно подключиться к серверу');
            } finally {
                setLoadingStatistic(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loadingStatistic || loadingStatusIssues) {
        return <div>Loading...</div>;
    }

    if (errorStatistic || errorStatusIssues) {
        return <div>{errorStatistic}</div>;
    }

    const chartData = {
        labels: statistics ? Array.from(statistics.keys()).map(week => `Week ${week}`) : [],
        datasets: [
            {
                label: 'Income',
                data: statistics ? Array.from(statistics.values()).map(stat => stat.income) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Expense',
                data: statistics ? Array.from(statistics.values()).map(stat => stat.expense) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Difference',
                data: statistics ? Array.from(statistics.values()).map(stat => stat.differense) : [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

    const chartData2 = {
        labels: statusIssues ? Object.keys(statusIssues) : [],
        datasets: [
            {
                label: 'Done',
                data: statusIssues ? [statusIssues["Done"], statusIssues["In Progress"], statusIssues["New"]] : [],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    Chart.register(CategoryScale);

    return (
        <>
            <Header />
            <div className="container">
                <div className="chart-container">
                    <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
                    <Bar
                        data={chartData}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Users Gained between 2016-2020"
                                },
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />
                    <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
                    <Pie
                        data={chartData2}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Users Gained between 2016-2020"
                                },
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default Diagrams