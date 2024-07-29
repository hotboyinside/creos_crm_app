import './Diagrams.css'

import { Service } from '../../service/service';
import PieChart from '../../components/PieChart/PieChart.tsx';
import BarChart from '../../components/BarChart/BarChart.tsx';
import { Statistic, WeekNumber, IssueStatusStatistic, IChartData } from '../../models/models.ts';

import { useState, useEffect } from "react";

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
    const [errorStatusIssues, setErrorStatusIssues] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatusIssues = async () => {
            try {
                const stats = await service.getIssuesStatus();
                setStatusIssues(stats);
            } catch (err) {
                setErrorStatusIssues('Невозможно подключиться к серверу');
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

    const statisticsDataForChart: IChartData = {
        labels: statistics ? Array.from(statistics.keys()).map(week => `Week ${week}`) : [],
        datasets: [
            {
                label: 'Прибыль',
                data: statistics ? Array.from(statistics.values()).map(stat => stat.income) : [],
                backgroundColor: ['rgba(75, 192, 192, 0.6)'],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Расходы',
                data: statistics ? Array.from(statistics.values()).map(stat => stat.expense) : [],
                backgroundColor: ['rgba(255, 99, 132, 0.6)'],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Разница',
                data: statistics ? Array.from(statistics.values()).map(stat => stat.differense) : [],
                backgroundColor: ['rgba(54, 162, 235, 0.6)'],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

    const issuesStatusDataForChart: IChartData = {
        labels: statusIssues ? Object.keys(statusIssues) : [],
        datasets: [
            {
                label: 'Количество',
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
                    <BarChart statisticsData = {statisticsDataForChart}/>
                    <PieChart issuesStatusData={issuesStatusDataForChart} />
                </div>
            </div>
        </>
    )
}

export default Diagrams