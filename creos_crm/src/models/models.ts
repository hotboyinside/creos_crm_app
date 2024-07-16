interface IComment {
    id: string,
    issue: string,
    designer: { [key: string]: string },
    date_created: string,
    message: string
}

export default IComment