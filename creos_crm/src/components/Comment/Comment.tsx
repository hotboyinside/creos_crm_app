import './Comment.css'

import { IComment } from '../../models/models'

function Comment(props: IComment) {
    const timeDifference: number = (Date.now() - new Date(props.date_created).getTime()) / 1000;

    // Переводим секунды в дни, часы и минуты
    const secondsInDay = 24 * 60 * 60;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

    const days = Math.floor(timeDifference / secondsInDay);
    const remainingAfterDays = timeDifference % secondsInDay;

    const hours = Math.floor(remainingAfterDays / secondsInHour);
    const remainingAfterHours = remainingAfterDays % secondsInHour;

    const minutes = Math.floor(remainingAfterHours / secondsInMinute);
    

    return (
        <li className='comments__item comment'>
            <div className='comment__upper'>
                <img className='comment__avatar' src={ props.designer.avatar } alt="designer-avatar" />
                <div className='comment__titles'>
                    <h3 className='comment__author'>{ props.designer.username }</h3>
                    <h4 className='comment__task'>{ props.issue }</h4>
                </div>
            </div>
            <p className='comment__text'>{props.message}</p>
            <time className='comment__time-created'>{`${minutes > 0 ? minutes + ' мин.' : ''} ${hours > 0 ? hours + ' час.' : ''} ${days > 0 ? days + ' дн.' : ''} назад`}</time>
        </li>
    )
}

export default Comment