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
    maxWidth: '60%',
    minHeight: '60%'
  },
  dialogBtn: {
    height: 'min-content'
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
    <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button
          appearance='transparent'
          icon={<ExpandUpLeftRegular />}
          aria-label='Expand'
          className={styles.dialogBtn}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogBody>
          <DialogContent>
            <GetPivotItems />
          </DialogContent>
        </DialogBody>
        <Button
          appearance='transparent'
          icon={<DismissRegular />}
          aria-label='Collapse'
          className={styles.dismissBtn}
          onClick={() => setOpen(false)}
        />
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
