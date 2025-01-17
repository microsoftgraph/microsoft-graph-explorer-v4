import {
  Button,
  DialogActions,
  makeStyles,
  MessageBar
} from '@fluentui/react-components';
import { FC, ReactNode } from 'react';
import { translateMessage } from '../../../../utils/translate-messages';

interface CommonCollectionsPanelProps {
  messageBarText: string;
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
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 1,
    padding: '10px'
  }
});

const CommonCollectionsPanel: FC<CommonCollectionsPanelProps> = ({
  messageBarText,
  primaryButtonText,
  primaryButtonAction,
  primaryButtonDisabled,
  closePopup,
  children
}) => {
  const styles = useStyles();

  return (
    <>
      <MessageBar>
        {translateMessage(messageBarText)}
      </MessageBar>
      {children}
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
