import { Dialog, DialogType, Spinner } from '@fluentui/react';
import { Suspense } from 'react';

import { WrapperProps } from './popups.types';

export function DialogWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { settings: { title, subtitle } } = popupsProps;

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={() => dismissPopup()}
      dialogContentProps={{
        type: DialogType.normal,
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
        </Suspense>
      }
    </Dialog>
  );
}