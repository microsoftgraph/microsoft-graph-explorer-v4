export interface ISubmitButton {
  handleOnClick: Function;
  submitting: boolean;
  text: string;
  ariaLabel?: string;
  role?: string;
  disabled?: boolean;
  allowDisabledFocus?: boolean;
}
