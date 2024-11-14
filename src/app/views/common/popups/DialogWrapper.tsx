import { Dialog, DialogType, Spinner } from '@fluentui/react';
import { Suspense } from 'react';

import { WrapperProps } from './popups.types';

export function DialogWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { settings: { title, subtitle } } = popupsProps;

  const getDialogType = () => {
    switch (popupsProps.settings.width) {
    case 'md':
      return DialogType.normal;
    case 'lg':
      return DialogType.largeHeader;
    }
    return DialogType.normal;
  }

  const type = getDialogType();

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={() => dismissPopup()}
      dialogContentProps={{
        type,
        title: title?.toString(),
        isMultiline: false,
        subText: subtitle?.toString()
      }}
    >
      {
        <Suspense fallback={<Spinner />}>

          <Component
            {...popupsProps}
            data={popupsProps.data || {}}
            dismissPopup={() => dismissPopup()}
            closePopup={(e: any) => closePopup(e)}
          />
          {
            popupsProps.settings.renderFooter && popupsProps.settings.renderFooter()
          }
        </Suspense>
      }
    </Dialog>
  );
}