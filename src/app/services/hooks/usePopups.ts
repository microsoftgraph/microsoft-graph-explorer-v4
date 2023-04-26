import { PopupItem, popups } from '../../views/common/registry/popups';
import {
  POPUPS, PopupsProps, PopupsStatus, PopupsType,
  usePopupsDispatchContext, usePopupsStateContext
} from '../context/popups-context';

type OpenPopupsFn<Data> = (properties: PopupsProps<Data>) => void;

interface UsePopupsResponse<Data> {
  open: OpenPopupsFn<Data>;
  status?: PopupsStatus;
  result: any;
  reference: string | null;
}

const usePopups = <Data = {}>(item: PopupItem, type: PopupsType,
  reference: string | null = null): UsePopupsResponse<Data> => {
  const dispatch = usePopupsDispatchContext();
  const { popups: popupsState } = usePopupsStateContext();
  const current = popupsState.find(k => k.reference === reference)

  function open(properties: PopupsProps<Data>) {

    let component = null;
    if (typeof (item) === 'string' && popups.has(item)) {
      component = popups.get(item);
    }

    const payload = {
      component,
      popupsProps: properties,
      type,
      id: new Date().getTime().toString(),
      reference
    };

    dispatch({
      type: POPUPS.ADD_POPUPS,
      payload
    });
  }
  return { open, status: current?.status, result: current?.result, reference };
}

export { usePopups };

