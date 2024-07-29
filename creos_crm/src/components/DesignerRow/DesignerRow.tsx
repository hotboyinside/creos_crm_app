import './DesignerRow.css'

import { IDesignerFromApi } from '../../models/models'

function DesignersRow(props: IDesignerFromApi) {
    const completedIssues = props.issues.filter(issue => issue.status === "Done");
    const inProgressIssues = props.issues.filter(issue => issue.status === "In Progress");

    return (
        <tr>
            <th><img src={props.avatar} alt="" /></th>
            <th>{props.username}</th>
            <th>{props.email}</th>
            <th>{completedIssues.length}</th>
            <th>{inProgressIssues.length}</th>
        </tr>
    )
}

export default DesignersRow