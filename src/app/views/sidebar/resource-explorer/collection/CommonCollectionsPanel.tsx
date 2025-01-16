import { DefaultButton, Dialog, DialogFooter, DialogType, Label, MessageBar, PrimaryButton } from '@fluentui/react';
import { FC, ReactNode } from 'react';
import { translateMessage } from '../../../../utils/translate-messages';

interface CommonCollectionsPanelProps {
  messageBarText: string;
  primaryButtonText: string;
  primaryButtonAction: () => void;
  primaryButtonDisabled: boolean;
  closePopup: () => void;
  children: ReactNode;
  isDialogHidden?: boolean;
  dialogTitle?: string;
  dialogSubText?: string;
  mergeAction?: () => void;
  replaceAction?: () => void;
  toggleDialog?: () => void;
}

const CommonCollectionsPanel: FC<CommonCollectionsPanelProps> = ({
  messageBarText,
  primaryButtonText,
  primaryButtonAction,
  primaryButtonDisabled,
  closePopup,
  children,
  isDialogHidden,
  dialogTitle,
  dialogSubText,
  mergeAction,
  replaceAction,
  toggleDialog
}) => {
  return (
    <>
      <MessageBar isMultiline={true}>
        {translateMessage(messageBarText)}
      </MessageBar>
      {children}
      <DialogFooter
        styles={{
          actionsRight: { bottom: 0, justifyContent: 'start', position: 'fixed', width: '100%', zIndex: 1 }
        }}>
        <PrimaryButton onClick={primaryButtonAction} disabled={primaryButtonDisabled}>
          {translateMessage(primaryButtonText)}
        </PrimaryButton>
        <DefaultButton onClick={closePopup}>
          {translateMessage('Close')}
        </DefaultButton>
      </DialogFooter>
      {!isDialogHidden && (
        <Dialog
          hidden={isDialogHidden}
          onDismiss={toggleDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: translateMessage(dialogTitle ?? ''),
            closeButtonAriaLabel: 'Close',
            subText: translateMessage(dialogSubText ?? '')
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={mergeAction} text={translateMessage('Merge with existing')} />
            <DefaultButton onClick={replaceAction} text={translateMessage('Replace existing')} />
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};

export default CommonCollectionsPanel;
