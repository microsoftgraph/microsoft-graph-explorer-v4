import { PopupsProvider, usePopupsDispatchContext, usePopupsStateContext } from './PopupsContext';

export interface PopupsComponent<Data = {}> {
  dismissPopup: () => void;
  closePopup: (results?: object | string) => void;
  data: Data;
  settings: PopupSettings;
}

interface PopupSettings {
  title: string;
  subtitle?: string;
  width?: width;
  renderFooter?: () => JSX.Element;
}

export interface PopupsProps<Data = {}> {
  settings: PopupSettings;
  data?: Data;
}

export type PopupsStatus = 'open' | 'closed' | 'dismissed' | null;
export type PopupsType = 'modal' | 'panel' | 'dialog';
export type width = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ShowPopupsParameters<Data = {}> {
  component: React.ElementType<PopupsComponent<Data>>;
  type: PopupsType;
  dialogProps: PopupsProps<Data>;
}

export interface PopupAction {
  type: string;
  payload: Popup;
}

export interface PopupState {
  popups: Popup[];
}

export const POPUPS = {
  ADD_POPUPS: 'ADD_POPUPS',
  DELETE_POPUPS: 'DELETE_POPUPS'
}

interface BasePopupState {
  status?: PopupsStatus;
  result?: any;
  reference?: string;
}

export interface Popup<Data = {}> extends BasePopupState {
  component: React.ElementType<PopupsComponent<Data>>,
  popupsProps: PopupsProps<Data>,
  type: PopupsType,
  id: string;
  isOpen?: boolean;
}

type ShowPopupsFn<Data> = (properties: PopupsProps<Data>) => void;

export interface UsePopupsResponse<Data> extends BasePopupState {
  show: ShowPopupsFn<Data>;
}

export const initialState: PopupState = {
  popups: []
};

export { PopupsProvider, usePopupsStateContext, usePopupsDispatchContext };