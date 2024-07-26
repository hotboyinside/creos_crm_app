import { Transport } from "../transport/transport";
import { IComment, IIssue, IDesignerKPI, IResponseWithCommonData, IDesignerFromApi } from "../models/models";

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
        // функция проверки дизайнера в списке
        // const checkDesignerExist = (designersInformation: IDesignerKPI[], designerName: string): number => {
        //     return designersInformation.findIndex(designerData => designerData.designer === designerName);
        // }

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

    public async getStatisticsOfProjects(countWorkWeeks: number = 8): Promise<any> {
        const findWorkWeekOfDay = (dateInMiliseconds: number): number => {
            for (let i=0; i < countWorkWeeks; i++) {
                const currStartOfWeekInMiliseconds = startDayOfWeekInMiliseconds - (i * weekInMiliseconds);
                if (inputDate > currStartOfWeekInMiliseconds) {
                    console.log('Рабочая неделя: ' + (i + 1))
                    break
                }
            }
            return -1
        }

        const weekdaysDaysBeforeStart: { [key: number]: number } = {
            0: 6,
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5
        }
        const weekInMiliseconds = 7 * 1000 * 60 * 60 * 24;

        const currDate = new Date();
        const currDayOfWeek = currDate.getDay();
        const currDateWithoutTime = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
        const remainDaysOfEndWeek = weekdaysDaysBeforeStart[currDayOfWeek];
        const passedDaysFromStart = remainDaysOfEndWeek * 1000 * 60 * 60 * 24;
        const startDayOfWeekInMiliseconds = currDateWithoutTime.getTime() - passedDaysFromStart;
        const inputDate = new Date("2024-06-21T11:00:18Z").getTime();
        findWorkWeekOfDay(inputDate);
    }
}