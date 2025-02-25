import {
  Button,
  makeStyles,
  MessageBar,
  MessageBarBody,
  DrawerFooter,
  tokens
} from '@fluentui/react-components';
import { ReactNode } from 'react';
import { translateMessage } from '../../../../utils/translate-messages';

interface CommonCollectionsPanelProps {
  messageBarText?: string;
  messageBarSpanText?: string;
  primaryButtonText: string;
  primaryButtonAction: () => void;
  primaryButtonDisabled: boolean;
  closePopup: () => void;
  children: ReactNode;
}

const useStyles = makeStyles({
  drawerFooter: {
    display: 'flex',
    justifyContent: 'flex-start',
    position: 'sticky',
    bottom: 0,
    width: '100%',
    gap: tokens.spacingHorizontalXXXL,
    paddingInline: tokens.spacingHorizontalL,
    paddingBlock: tokens.spacingVerticalL,
    paddingLeft: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    marginInlineStart: tokens.spacingHorizontalL
  },
  messageBar: {
    marginInlineStart: tokens.spacingHorizontalM,
    width: '100%'
  }
});

const CommonCollectionsPanel: React.FC<CommonCollectionsPanelProps> = ({
  messageBarText,
  messageBarSpanText,
  primaryButtonText,
  primaryButtonAction,
  primaryButtonDisabled,
  closePopup,
  children
}) => {
  const styles = useStyles();

  return (
    <>
      {messageBarText ? <MessageBar className={styles.messageBar} intent='info'>
        <MessageBarBody>
          {translateMessage(messageBarText)}
          {messageBarSpanText ? (
            <span style={{ fontWeight: 'bold' }}>
              {translateMessage(messageBarSpanText)}
            </span>
          ) : null}
        </MessageBarBody>
      </MessageBar> : null}
      {children}
      <DrawerFooter className={styles.drawerFooter}>
        <Button appearance="primary" onClick={primaryButtonAction} disabled={primaryButtonDisabled}>
          {translateMessage(primaryButtonText)}
        </Button>
        <Button onClick={closePopup}>
          {translateMessage('Close')}
        </Button>
      </DrawerFooter>
    </>
  );
};

export default CommonCollectionsPanel;
