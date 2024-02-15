import { PopupItem, popups } from '../../views/common/lazy-loader/component-registry/popups';
import {
  POPUPS, PopupsProps, PopupsType,
  UsePopupsResponse,
  usePopupsDispatchContext, usePopupsStateContext
} from '../context/popups-context';

const usePopups = <Data = {}>(item: PopupItem , type: PopupsType,
  reference?: string): UsePopupsResponse<Data> => {
  const dispatch = usePopupsDispatchContext();
  const { popups: popupsState } = usePopupsStateContext();
  const current = popupsState.find(k => k.reference === reference)

  function show(properties: PopupsProps<Data>) {

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
  return { show, status: current?.status, result: current?.result, reference };
}

export { usePopups };

