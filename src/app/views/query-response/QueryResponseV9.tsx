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
import { useState } from 'react';
import { GetPivotItems } from './pivot-items/pivot-item-v9';
import { ExpandUpLeftRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    overflow: 'hidden',
    border: `solid ${tokens.colorStrokeFocus2} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalMNudge
  },
  dialog: {
    display: 'flex',
    maxWidth: '70%',
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
          <Button appearance='transparent' icon={<ExpandUpLeftRegular/>}>Expand</Button>
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
