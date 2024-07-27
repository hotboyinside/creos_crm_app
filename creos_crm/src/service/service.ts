import { Transport } from "../transport/transport";
import {
    IComment, IDesignerKPI, IResponseWithCommonData, IDesignerFromApi, IIssueWithOptional,
    Statistic, WeekNumber, IssueStatusStatistic
} from "../models/models";

const trans = Transport.getInstance();

interface IService {
    getLastComments(): Promise<IComment[]>
    getDesigners(byTime: boolean): Promise<IDesignerKPI[]>
}

export class Service implements IService {
    private static instance: Service;

    constructor() { };

    public static getInstance(): Service {
        if (!Service.instance) {
            Service.instance = new Service();
        }

        return Service.instance;
    }

    public async getLastComments(): Promise<IComment[]> {
        const response: Promise<IComment[]> = trans.getData();
        return (await response).slice(0, 10)
    }

    // Promise<IDesignerKPI>
    public async getDesigners(byTime: boolean = true): Promise<IDesignerKPI[]> {
        // функция, сравнивающая 2 числа
        const compareNumbers = (a: number, b: number): number => a - b;

        let designersWithCompletedTasks: IDesignerFromApi[] = [];
        let url: string | null = 'https://sandbox.creos.me/api/v1/designer/';
        do {
            const response: IResponseWithCommonData = await trans.getData(url);

            response.results.forEach(designer => {
                designer.issues = designer.issues.filter(issue => issue.status === 'Done');
                if (designer.issues.length > 0) {
                    designersWithCompletedTasks.push({
                        ...designer
                    });
                }
            });
            url = response.next;
        } while (url)

        let designersKPI: IDesignerKPI[] = [];
        designersWithCompletedTasks.forEach(designerInfo => {
            let designersWorkTime: number[] = [];
            designersWorkTime = designerInfo.issues.map(issueInfo => {
                return (new Date(issueInfo.date_finished_by_designer).getTime() - new Date(issueInfo.date_started_by_designer).getTime()) / 1000 / 60 / 60;
            })
            designersKPI.push({
                avatar: designerInfo.avatar,
                designer: designerInfo.username,
                workTime: designersWorkTime,
                countWorks: designersWorkTime.length,
                me: designersWorkTime[0]
            })
        });
        // сортируем время затраченное на каждую задачу и находим медианное время
        designersKPI.forEach(designerData => {
            designerData.workTime.sort(compareNumbers)
            const middle = designerData.workTime.length / 2;
            if (designerData.workTime.length % 2 === 0) {
                designerData.me = (designerData.workTime[middle] + designerData.workTime[middle - 1]) / 2;
            } else {
                designerData.me = designerData.workTime[Math.floor(middle)];
            }
        })

        if (byTime) {
            // сортируем по медианному времени
            designersKPI.sort((designerData1, designerData2) => designerData1.me - designerData2.me)
        } else {
            // сортируем по количеству выполненных задач
            designersKPI.sort((designerData1, designerData2) => designerData1.countWorks - designerData2.countWorks).reverse()
        }
        return designersKPI.slice(0, 10)
    }

    public async getEconomicStatistic(countWorkWeeks: number = 8): Promise<Map<WeekNumber, Statistic>> {
        const weekInMiliseconds = 7 * 1000 * 60 * 60 * 24;
        const weekdaysDaysBeforeStart: { [key: number]: number } = {
            0: 6,
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5
        }

        const filterByWorkWeeks = (dateInMiliseconds: number): number | false => {
            for (let workWeekNumber=0; workWeekNumber < countWorkWeeks; workWeekNumber++) {
                const currStartOfWeekInMiliseconds = startDayOfWeekInMiliseconds - (workWeekNumber * weekInMiliseconds);
                if (dateInMiliseconds > currStartOfWeekInMiliseconds) {
                    return workWeekNumber + 1;
                }
            }
            return false;
        }

        const url = 'https://sandbox.creos.me/api/v1/issue/';
        const responseData: IIssueWithOptional[] = await trans.getData(url);
        const onlyCopmpletedIssues = responseData.filter(responseData => responseData.status == "Done");
        
        const currDate = new Date();
        const currDayOfWeek = currDate.getDay();
        const currDateWithoutTime = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
        const startDayOfWeekInMiliseconds = currDateWithoutTime.getTime() - (weekdaysDaysBeforeStart[currDayOfWeek] * 1000 * 60 * 60 * 24);        

        const statisticAboutIssues = new Map<WeekNumber, Statistic>();
        for (let workWeekNumber = 1; workWeekNumber <= countWorkWeeks; workWeekNumber++) {
            statisticAboutIssues.set(workWeekNumber, {income: 0, expense: 0, differense: 0});
        }

        onlyCopmpletedIssues.forEach(issue => {
            const timeInMiliSeconds = new Date(issue.date_finished).getTime();
            const response = filterByWorkWeeks(timeInMiliSeconds)
            if (response) {
                const currentStatistic = statisticAboutIssues.get(response)!;
                const updatedIncome = currentStatistic.income + issue.received_from_client;
                const updatedExpense = currentStatistic.expense + issue.send_to_designer + issue.send_to_project_manager;
                const updatedDifference = currentStatistic.differense + issue.received_from_client - issue.send_to_designer - issue.send_to_project_manager;

                statisticAboutIssues.set(response, {
                    income: updatedIncome,
                    expense: updatedExpense,
                    differense: updatedDifference
                })
            }
        })

        return statisticAboutIssues
    }

    public async getIssuesStatus() {
        const url = 'https://sandbox.creos.me/api/v1/issue/';
        const responseData: IIssueWithOptional[] = await trans.getData(url);
        const statusStatistic: IssueStatusStatistic = {};
        const completedIssues = responseData.filter(responseData => responseData.status == "Done");
        const inProgressIssues = responseData.filter(responseData => responseData.status == "In Progress");
        const newIssues = responseData.filter(responseData => responseData.status == "New");
        
        statusStatistic["Done"] = completedIssues.length;
        statusStatistic["In Progress"] = inProgressIssues.length;
        statusStatistic["New"] = newIssues.length;
        return statusStatistic
    }
}