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
import { translateMessage } from '../../../utils/translate-messages';
import { componentNames, telemetry } from '../../../../telemetry';
import { BANNER_IS_VISIBLE } from '../../../services/graph-constants';
import { useAppSelector } from '../../../../store';

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
    const storageBanner = localStorage.getItem(BANNER_IS_VISIBLE);
    const theme = useAppSelector(s => s.theme)

    const handleDismiss = () => {
        localStorage.setItem(BANNER_IS_VISIBLE, 'false');
    };

    if (storageBanner === 'false') {
        return null;
    }

    return (
        <MessageBar className={`${styles.container} ${theme}`} icon={''}>
            <MessageBarBody className={styles.body}>
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
