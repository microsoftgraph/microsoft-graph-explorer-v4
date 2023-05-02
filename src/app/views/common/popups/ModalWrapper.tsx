import { IconButton, Modal, Spinner } from '@fluentui/react';
import { Suspense } from 'react';

import { translateMessage } from '../../../utils/translate-messages';
import { WrapperProps } from './popups.types';

export function ModalWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={() => dismissPopup()}
      layerProps={{ eventBubblingEnabled: true }}
    >
      <IconButton
        styles={{
          root: {
            float: 'right',
            zIndex: 1
          }
        }}
        iconProps={{ iconName: 'Cancel' }}
        ariaLabel={translateMessage('Close expanded response area')}
        onClick={() => closePopup()}
      />
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
    </Modal>
  );
}


