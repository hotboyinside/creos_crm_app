import './Comment.css'

import { IComment } from '../../models/models'

function Comment(props: IComment) {
    return(
        <li>
            <img src={props.designer.avatar} alt="designer-avatar" />
            <span>Дизайнер: {props.designer.username}</span>
            <span>Задача: {props.issue}</span>
            <p>Сообщение: {props.message}</p>
            <span>Время: {props.date_created}</span>
        </li>
    )
}

export default Comment