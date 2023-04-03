import { PopupsComponent, PopupsProps } from '../../../services/context/popups-context';

export interface WrapperProps<Data = {}> {
  isOpen: boolean;
  dismissPopup: Function;
  Component: React.ElementType<PopupsComponent<Data>>;
  popupsProps: PopupsProps<Data>;
  closePopup: Function;
}