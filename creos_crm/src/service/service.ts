import { Transport } from "../transport/transport";
import { IComment, IIssue, IDesignerKPI } from "../models/models";

const trans = Transport.getInstance();

interface IService {
    getLastComments(): Promise<IComment[]>
    getDesigners(): Promise<IDesignerKPI[]>
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

    public async getDesigners(byTime: boolean = true): Promise<IDesignerKPI[]> {
        // функция проверки дизайнера в списке
        const checkDesignerExist = (designersInformation: IDesignerKPI[], designerName: string): number => {
            return designersInformation.findIndex(designerData => designerData.designer === designerName);
        }

        // функция, сравнивающая 2 числа
        const compareNumbers = (a: number, b: number): number => a - b;

        // получаем информацию  о всех выподненных задачах
        const response2: Promise<IIssue[]> = trans.getData('issue/');
        const issues = await response2.then(data => { return data.filter((value) => { return value.status === 'Done' }) });

        // считаем количество выполненных задач и время(в часах), затраченное на каждую задачу
        let designersKPI: IDesignerKPI[] = [];
        issues.forEach((issueInfo) => {
            const existAnswer = checkDesignerExist(designersKPI, issueInfo.designer);
            const workTime = (new Date(issueInfo.date_finished_by_designer).getTime() - new Date(issueInfo.date_started_by_designer).getTime()) / 1000 / 60 / 60;

            if (existAnswer === -1) {
                designersKPI.push({
                    designer: issueInfo.designer,
                    workTime: [workTime],
                    countWorks: 1,
                    me: workTime
                })
            } else {
                designersKPI[existAnswer].workTime.push(workTime);
                designersKPI[existAnswer].countWorks += 1;
            }
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
}