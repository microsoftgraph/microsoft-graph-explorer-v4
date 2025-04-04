import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  makeStyles,
  tokens,
  Tooltip,
  useRestoreFocusTarget
} from '@fluentui/react-components';
import { DismissRegular, ExpandUpLeftRegular } from '@fluentui/react-icons';
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
    justifyContent: 'center',
    maxWidth: '70%',
    minHeight: '70%'
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
            <DialogContent>
              <GetPivotItems />
            </DialogContent>
          </DialogBody>
          <DialogTrigger disableButtonEnhancement>
            <Tooltip relationship='label' content={translateMessage('Close')}>
              <Button
                appearance='transparent'
                icon={<DismissRegular />}
                aria-label={translateMessage('Close')}
                className={styles.dismissBtn}
                onClick={() => setOpen(false)}
              />
            </Tooltip>
          </DialogTrigger>
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
