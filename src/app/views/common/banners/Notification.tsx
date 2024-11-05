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
import { translateMessage } from '../../../utils/translate-messages';
import { componentNames, telemetry } from '../../../../telemetry';

interface NotificationProps {
    header: string;
    content: string;
    link: string;
    linkText: string;
}

const handleOnClickLink = (e: React.MouseEvent<HTMLAnchorElement>)=>{
    telemetry.trackLinkClickEvent(
        (e.currentTarget as HTMLAnchorElement).href, componentNames.GRAPH_EXPLORER_TUTORIAL_LINK)
}

export const Notification: React.FunctionComponent<NotificationProps> = (props: NotificationProps) => {
    const styles = useNotificationStyles();
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
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
                <Link
                    onClick={handleOnClickLink}
                    href={props.link}
                    target='_blank'>{props.linkText} <OpenRegular /></Link>
            </MessageBarBody>
            <MessageBarActions
            containerAction={
                <Button
                onClick={handleDismiss}
                aria-label={translateMessage('Dismiss banner')}
                appearance="transparent"
                icon={<DismissRegular />}
                />
            }
            />
        </MessageBar>
    );
};
