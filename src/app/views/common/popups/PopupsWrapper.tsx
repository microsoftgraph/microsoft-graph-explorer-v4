import {
  POPUPS, Popup, usePopupsDispatchContext,
  usePopupsStateContext
} from '../../../services/context/popups-context';
import ErrorBoundary from '../error-boundary/ErrorBoundary';
import { DialogWrapper } from './DialogWrapper';
import { ModalWrapper } from './ModalWrapper';
import { DrawerWrapper } from './DrawerWrapper';

const PopupWrapper = () => {

  const { popups } = usePopupsStateContext();
  const dispatch = usePopupsDispatchContext();

  const close = (payload: Popup, result: any) => {
    if (result) {
      payload.result = result;
    }
    payload.status = 'closed';
    dispatch({ type: POPUPS.DELETE_POPUPS, payload });
    const triggerBtn = payload.popupsProps.settings.trigger;
    if (triggerBtn?.current){
      triggerBtn.current?.focus();
    }
  }

  const dismiss = (payload: Popup) => {
    payload.status = 'dismissed';
    dispatch({ type: POPUPS.DELETE_POPUPS, payload });
    const triggerBtn = payload.popupsProps.settings.trigger;
    if (triggerBtn?.current){
      triggerBtn.current?.focus();
    }
  }

  return (
    <ErrorBoundary>
      {popups && popups.map((popup: Popup) => {
        const { component, type, popupsProps, isOpen } = popup;
        if (type === 'panel') {
          return component && <DrawerWrapper
            isOpen={!!isOpen}
            key={popup.id}
            dismissPopup={() => dismiss(popup)}
            Component={component}
            popupsProps={popupsProps}
            closePopup={(e: any) => close(popup, e)}
          />
        }

        if (type === 'dialog') {
          return component && <DialogWrapper
            isOpen={!!isOpen}
            key={popup.id}
            dismissPopup={() => dismiss(popup)}
            Component={component}
            popupsProps={popupsProps}
            closePopup={(e: any) => close(popup, e)}
          />
        }

        return component && <ModalWrapper
          isOpen={!!isOpen}
          key={popup.id}
          dismissPopup={() => dismiss(popup)}
          Component={component}
          popupsProps={popupsProps}
          closePopup={(e: any) => close(popup, e)}
        />

      })}
    </ErrorBoundary>
  );
};

export default PopupWrapper;