 export interface IComment {
    id: string,
    issue: string,
    designer: { [key: string]: string },
    date_created: string,
    message: string
}

export interface IIssue {
    id: number,
    status: string,
    designer: string,
    project: string,
    date_created: string,
    date_started_by_designer: string,
    date_finished_by_designer: string,
    [key: string]: any
}

export interface IDesignerKPI {
    designer: string,
    workTime: number[],
    countWorks: number,
    me: number
}
