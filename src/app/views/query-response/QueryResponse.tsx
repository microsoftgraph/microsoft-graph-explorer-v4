import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { DismissRegular, ExpandUpLeftRegular } from '@fluentui/react-icons';
import { useState } from 'react';
import { GetPivotItems } from './pivot-items/pivot-item';

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

  return (
    <div>
      <Button
        appearance='transparent'
        icon={<ExpandUpLeftRegular />}
        aria-label='Expand'
        className={styles.dialogBtn}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
        <DialogSurface className={styles.dialog}>
          <DialogBody>
            <DialogContent>
              <GetPivotItems />
            </DialogContent>
          </DialogBody>
          <DialogTrigger disableButtonEnhancement>
            <Button
              appearance='transparent'
              icon={<DismissRegular />}
              aria-label='Collapse'
              className={styles.dismissBtn}
              onClick={() => setOpen(false)}
            />
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
