import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  makeStyles
} from '@fluentui/react-components';
import { ExpandUpLeftRegular } from '@fluentui/react-icons';
import { useState } from 'react';
import { GetPivotItems } from './pivot-items/pivot-item-v9';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    overflow: 'hidden',
    height: '-webkit-fill-available'
  },
  dialog: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '40%',
    minHeight: '60%'
  },
  dialogBtn: {
    display: 'block'
  }
});

const PivotItemsDialog = () => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  return (
    <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
      <div className={styles.dialogBtn}>
        <DialogTrigger disableButtonEnhancement>
          <Button
            appearance='transparent'
            icon={<ExpandUpLeftRegular />}
            aria-label='Expand'
          />
        </DialogTrigger>
      </div>
      <DialogSurface className={styles.dialog}>
        <DialogBody>
          <DialogContent>
            <GetPivotItems />
          </DialogContent>
          <div className={styles.dialogBtn}>
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
