import { PopupsProvider } from './PopupsContext';

export interface PopupsComponent<Data = {}> {
  dismissPopup: () => void;
  closePopup: (results?: object | string) => void;
  data: Data;
  settings: PopupSettings;
}

interface PopupSettings {
  title: React.ReactNode | string;
  subtitle?: string;
  width?: width;
}

export interface PopupsProps<Data = {}> {
  settings: PopupSettings;
  data?: Data;
}

export type PopupsStatus = 'open' | 'closed' | 'dismissed' | null;
export type PopupsType = 'modal' | 'panel' | 'dialog';
export type width = 'xs' | 'sm' | 'md' | 'lg';

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

export interface Popup<Data = {}> {
  component: React.ElementType<PopupsComponent<Data>>,
  popupsProps: PopupsProps<Data>,
  type: PopupsType,
  id: string;
  result?: any;
  open?: boolean;
  status?: PopupsStatus;
  reference?: string;
}

export const initialState: PopupState = {
  popups: []
};

export { PopupsProvider };