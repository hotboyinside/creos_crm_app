import './DesignerKPIRow.css'

import { IDesignerKPI } from '../../models/models'

function DesignersKPIRow(props: IDesignerKPI) {
    return (
        <tr>
            <th><img src={props.avatar} alt="" /></th>
            <th>{props.designer}</th>
            <th>{props.me}</th>
            <th>{props.countWorks}</th>
        </tr>
    )
}

export default DesignersKPIRow