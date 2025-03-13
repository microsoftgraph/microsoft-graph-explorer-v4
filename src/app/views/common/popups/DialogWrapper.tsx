import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Spinner
} from '@fluentui/react-components';
import { Suspense } from 'react';

import { WrapperProps } from './popups.types';

export function DialogWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { settings: { title, subtitle } } = popupsProps;

  return (
    <Dialog modalType='modal' open={isOpen} onOpenChange={(_, data) => !data.open && dismissPopup()}>
      <DialogSurface>
        <DialogBody>
          {title && <DialogTitle>{title.toString()}</DialogTitle>}
          <Suspense fallback={<Spinner />}>
            <DialogContent>{subtitle?.toString()}
              <Component
                {...popupsProps}
                data={popupsProps.data || {}}
                dismissPopup={() => dismissPopup()}
                closePopup={(e: any) => closePopup(e)}
              />
            </DialogContent>
            {popupsProps.settings.renderFooter && (
              <DialogActions>{popupsProps.settings.renderFooter()}</DialogActions>
            )}
          </Suspense>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}