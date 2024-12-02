import {
  Button,
  Link,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle
} from '@fluentui/react-components';
import { DismissRegular, OpenRegular } from '@fluentui/react-icons';
import { useState } from 'react';
import { useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { BANNER_IS_VISIBLE } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { useNotificationStyles } from './Notification.styles';

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

const Notification: React.FunctionComponent<NotificationProps> = (props: NotificationProps) => {
  const styles = useNotificationStyles();
  const storageBanner = localStorage.getItem(BANNER_IS_VISIBLE);
  const [isVisible, setIsVisible] = useState(storageBanner === null || storageBanner === 'true');
  const theme = useAppSelector(s => s.theme);

  const handleDismiss = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.NOTIFICATION_BANNER_DISMISS_BUTTON
    });
    localStorage.setItem(BANNER_IS_VISIBLE, 'false');
    setIsVisible(false);
  };

  if (!isVisible) {
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

export default telemetry.trackReactComponent(Notification, componentNames.NOTIFICATION_COMPONENT)