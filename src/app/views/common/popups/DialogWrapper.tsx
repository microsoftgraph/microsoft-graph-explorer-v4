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
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && dismissPopup()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title?.toString()}</DialogTitle>
          <DialogContent>{subtitle?.toString()}</DialogContent>
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
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}