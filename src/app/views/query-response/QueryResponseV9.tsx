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
import { ExpandUpLeftRegular } from '@fluentui/react-icons';
import { useState } from 'react';
import { GetPivotItems } from './pivot-items/pivot-item-v9';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '-webkit-fill-available',
    width: '100%',
    position: 'relative'
  },
  dialog: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '40%',
    minHeight: '60%'
  },
  dialogBtn: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    zIndex: 10
  },
  closeBtn: {
    ddisplay: 'block'
  }
});

const PivotItemsDialog = () => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  return (
    <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button
          className={styles.dialogBtn}
          appearance='transparent'
          icon={<ExpandUpLeftRegular />}
          aria-label='Expand'
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogBody>
          <DialogContent>
            <GetPivotItems />
          </DialogContent>
          <div className={styles.closeBtn}>
            <Button appearance='transparent' onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

const QueryResponseV9 = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <GetPivotItems />
      <PivotItemsDialog />
    </div>
  );
};

export default QueryResponseV9;
