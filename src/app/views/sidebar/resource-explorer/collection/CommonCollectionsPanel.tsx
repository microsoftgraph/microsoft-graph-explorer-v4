import {
  Button,
  DialogActions,
  makeStyles,
  MessageBar,
  MessageBarBody
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
  dialogFooter: {
    display: 'flex',
    justifyContent: 'start',
    position: 'sticky',
    bottom: 0,
    width: '100%',
    marginBlockStart: '10px',
    zIndex: 1
  },
  children: {
    height: '100%'
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
      {messageBarText ? <MessageBar intent='info'>
        <MessageBarBody>
          {translateMessage(messageBarText)}
          {messageBarSpanText ? (
            <span style={{ fontWeight: 'bold' }}>
              {translateMessage(messageBarSpanText)}
            </span>
          ) : null}
        </MessageBarBody>
      </MessageBar> : null}
      <div className={styles.children}>{children}</div>
      <DialogActions className={styles.dialogFooter}>
        <Button appearance="primary" onClick={primaryButtonAction} disabled={primaryButtonDisabled}>
          {translateMessage(primaryButtonText)}
        </Button>
        <Button onClick={closePopup}>
          {translateMessage('Close')}
        </Button>
      </DialogActions>
    </>
  );
};

export default CommonCollectionsPanel;
