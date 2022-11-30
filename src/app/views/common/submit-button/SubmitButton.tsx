import { PrimaryButton, Spinner, SpinnerSize } from '@fluentui/react';
import { ISubmitButtonControl } from '../../../../types/submit-button';

const SubmitButtonControl = ({
  handleOnClick,
  submitting,
  className,
  text,
  ariaLabel,
  role,
  disabled,
  allowDisabledFocus
}: ISubmitButtonControl) => {

  return (
    <div className={className}>
      <PrimaryButton disabled={submitting || disabled}
        onClick={() => handleOnClick()}
        ariaLabel={ariaLabel}
        role={role}
        allowDisabledFocus={allowDisabledFocus}
      >
        {text}
        {submitting && <>&nbsp;
          <Spinner size={SpinnerSize.small} />
        </>}
      </PrimaryButton>
    </div>
  );
};

export default SubmitButtonControl;
