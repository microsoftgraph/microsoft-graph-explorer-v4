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

export { PopupsProvider };