import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { Suspense } from 'react';

import { translateMessage } from '../../../utils/translate-messages';
import { WrapperProps } from './popups.types';

export function ModalWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && dismissPopup()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger>
                <Dismiss20Regular
                  aria-label={translateMessage('Close expanded response area')}
                  onClick={() => closePopup()}
                />
              </DialogTrigger>
            }
          >
            {popupsProps.settings.title?.toString()}
          </DialogTitle>
          <DialogContent>
            <Suspense fallback={<Spinner />}>
              <Component
                {...popupsProps}
                data={popupsProps.data || {}}
                dismissPopup={() => dismissPopup()}
                closePopup={(e: any) => closePopup(e)}
              />
              {popupsProps.settings.renderFooter && (
                <DialogActions>{popupsProps.settings.renderFooter()}</DialogActions>
              )}
            </Suspense>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}