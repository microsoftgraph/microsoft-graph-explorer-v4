import { classNames } from '../../classnames'

interface NotificationProps {
    header: string
    content: string
}


export const Notification:  React.FunctionComponent<NotificationProps>  = (props: NotificationProps)=>{
    const notificationClassNames = classNames(props)

    return <div className={notificationClassNames.container}>
        <h2>{props.header}</h2>
        <p>{props.content}</p>
    </div>
}