import {
  IPopup, POPUPS, usePopupsDispatchContext,
  usePopupsStateContext
} from '../../../services/context/popups-context/PopupsContext';
import { ModalWrapper } from './ModalWrapper';
import { PanelWrapper } from './PanelWrapper';

const PopupWrapper = () => {

  const { popups } = usePopupsStateContext();
  const dispatch = usePopupsDispatchContext();

  const close = (payload: IPopup, result: any) => {
    if (result) {
      payload.result = result;
    }
    payload.status = 'closed';
    dispatch({ type: POPUPS.DELETE_POPUPS, payload });
  }

  const dismiss = (payload: IPopup) => {
    payload.status = 'dismissed';
    dispatch({ type: POPUPS.DELETE_POPUPS, payload });
  }

  return (
    <>
      {popups && popups.map((popup: IPopup, index: number) => {
        const { component, type, popupsProps, open } = popup;
        if (type === 'panel') {
          return component && <PanelWrapper
            isOpen={!!open}
            key={index}
            dismissPopup={() => dismiss(popup)}
            Component={component}
            popupsProps={popupsProps}
            closePopup={(e: any) => close(popup, e)}
          />
        }

        return component && <ModalWrapper
          isOpen={!!open}
          key={index}
          dismissPopup={() => dismiss(popup)}
          Component={component}
          popupsProps={popupsProps}
          closePopup={(e: any) => close(popup, e)}
        />

      })}
    </>
  );
};

export default PopupWrapper;