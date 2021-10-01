export interface ISubmitButtonControl {
  handleOnClick: Function;
  submitting: boolean;
  text: string;
  className: string;
  ariaLabel?: string;
  role?: string;
  disabled?: boolean;
  allowDisabledFocus?: boolean;
}
