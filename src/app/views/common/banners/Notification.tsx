import { MessageBar, MessageBarType } from '@fluentui/react';
import { useNotificationStyles } from './Notification.styles';
import { useState } from 'react';

interface NotificationProps {
    header: string;
    content: string;
    messageType?: MessageBarType;
}

export const Notification: React.FunctionComponent<NotificationProps> = (props: NotificationProps) => {
    const styles = useNotificationStyles();
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        // TODO: track as dismissed in telemetry
        // TODO: don't show again. Persist choice to state
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <MessageBar
            messageBarType={props.messageType || MessageBarType.info}
            className={styles.container}
            onDismiss={handleDismiss}
        >
            <h2>{props.header}</h2>
            {/* TODO: Track content when link is clicked in telemetry */}
            <p>{props.content}</p>
        </MessageBar>
    );
};
