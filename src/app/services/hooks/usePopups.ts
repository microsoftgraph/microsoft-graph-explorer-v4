import {
  ShareQuery, FullPermissions, PreviewCollection, ThemeChoser
} from '../../views/common/lazy-loader/component-registry';
import {
  POPUPS, PopupsProps, PopupsType,
  UsePopupsResponse,
  usePopupsDispatchContext, usePopupsStateContext
} from '../context/popups-context';

type PopupItem =
  'share-query' |
  'theme-chooser' |
  'preview-collection' |
  'full-permissions';

const popups = new Map<string, any>([
  ['share-query', ShareQuery],
  ['theme-chooser', ThemeChoser],
  ['preview-collection', PreviewCollection],
  ['full-permissions', FullPermissions]
])

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

