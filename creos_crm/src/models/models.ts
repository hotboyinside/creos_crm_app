 export interface IComment {
    id: string,
    issue: string,
    designer: { [key: string]: string },
    date_created: string,
    message: string
}

export interface IIssue {
    key: string,
    date_started_by_designer: string,
    date_finished_by_designer: string,
    status: string,
    [key: string]: string
}

export interface IDesignerFromApi {
    avatar: string,
    username: string,
    email: string,
    issues: IIssue[]
    thumbnails: {[key: string]: string},
}

export interface IResponseWithCommonData {
    count: number,
    next: null | string,
    previous: null | string,
    results: IDesignerFromApi[]
}

export interface IDesignerKPI {
    avatar: string,
    designer: string,
    workTime: number[],
    countWorks: number,
    me: number
}

export interface IIssueWithOptional {
    id: number
    status: string
    designer: string
    project: string
    received_from_client: number
    send_to_project_manager: number
    send_to_designer: number
    summary: string
    date_updated: string
    date_started_by_designer: string
    date_finished_by_designer: string
    date_finished: string
}

export type Statistic = {
    income: number,
    expense: number,
    differense: number
}

export interface IChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string;
        borderWidth: number;
    }[];
}

export type WeekNumber = number

export interface IssueStatusStatistic {
    [key: string]: number
}
