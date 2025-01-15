import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  makeStyles
} from '@fluentui/react-components';
import { useState } from 'react';
import { GetPivotItems } from './pivot-items/pivot-items-v9';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%', // Ensure the container has a defined width
    overflow: 'hidden'
  },
  dialog: {
    maxWidth: '70%',
    minHeight: '60%'
  },
  dialogClose: {
    // soid
  }
});

const PivotItemsDialog = () => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  return (
    <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button>Expand</Button>
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogBody>
          <DialogContent>
            <GetPivotItems />
          </DialogContent>
          <Button className={styles.dialogClose} onClick={() => setOpen(false)}>
            Close
          </Button>
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
