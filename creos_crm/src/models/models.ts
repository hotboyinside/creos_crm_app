 export interface IComment {
    id: string,
    issue: string,
    designer: { [key: string]: string },
    date_created: string,
    message: string
}

// export interface IIssue {
//     id: number,
//     status: string,
//     designer: string,
//     project: string,
//     date_created: string,
//     date_started_by_designer: string,
//     date_finished_by_designer: string,
//     [key: string]: any
// }

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