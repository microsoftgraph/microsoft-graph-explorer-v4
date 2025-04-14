import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  makeStyles,
  tokens,
  Tooltip,
  useRestoreFocusTarget
} from '@fluentui/react-components';
import { ExpandUpLeftRegular } from '@fluentui/react-icons';
import { useState } from 'react';
import { GetPivotItems } from './pivot-items/pivot-item';
import { translateMessage } from '../../utils/translate-messages';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    position: 'relative'
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    maxWidth: '1000px',
    overflow: 'hidden',
    height: '600px',
    maxHeight: '100%'
  },
  dialogBtn: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    zIndex: 10
  },
  dismissBtn: {
    height: 'min-content',
    marginTop: tokens.spacingVerticalL
  },
  dialogContent: {
    padding: '16px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    flexGrow: 1
  }
});

const PivotItemsDialog = () => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  const restoreFocusTargetAttribute = useRestoreFocusTarget();


  return (
    <div>
      <Tooltip content={translateMessage('Expand')} relationship='label'>
        <Button
          appearance='transparent'
          icon={<ExpandUpLeftRegular />}
          aria-label={translateMessage('Expand')}
          className={styles.dialogBtn}
          {...restoreFocusTargetAttribute}
          onClick={() => setOpen(true)}
        />
      </Tooltip>
      <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
        <DialogSurface className={styles.dialog}>
          <DialogBody>
            <DialogContent className={styles.dialogContent}>
              <GetPivotItems />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance='secondary'>{translateMessage('Close')}</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

const QueryResponse = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <GetPivotItems />
      <PivotItemsDialog />
    </div>
  );
};

export default QueryResponse;
