import { DismissRegular, OpenRegular } from '@fluentui/react-icons';
import {
    MessageBar,
    MessageBarActions,
    MessageBarTitle,
    MessageBarBody,
    Button,
    Link
  } from '@fluentui/react-components';
import { useNotificationStyles } from './Notification.styles';
import { useState } from 'react';

interface NotificationProps {
    header: string;
    content: string;
    link: string;
    linkText: string;
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
        <MessageBar className={styles.container} icon={''}>
            <MessageBarBody>
                <MessageBarTitle>{props.header}</MessageBarTitle><br></br>
                {props.content}{' '}
                <Link href={props.link} target='_blank'>{props.linkText} <OpenRegular /></Link>
            </MessageBarBody>
            <MessageBarActions
            containerAction={
                <Button
                onClick={handleDismiss}
                aria-label="dismiss"
                appearance="transparent"
                icon={<DismissRegular />}
                />
            }
            />
        </MessageBar>
    );
};
