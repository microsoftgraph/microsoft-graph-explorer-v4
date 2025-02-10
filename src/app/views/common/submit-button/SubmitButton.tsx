
import { Play24Regular } from '@fluentui/react-icons';
import { ISubmitButtonControl } from '../../../../types/submit-button';
import { Button, Spinner } from '@fluentui/react-components';

const SubmitButtonControl = ({
  handleOnClick,
  submitting,
  className,
  text,
  ariaLabel,
  disabled
}: ISubmitButtonControl) => {

  return (
    <div className={className}>
      <Button disabled={submitting || disabled}
        appearance='primary'
        onClick={() => handleOnClick()}
        aria-label={ariaLabel}
        icon={<Play24Regular/>}
      >
        {text}
        {submitting && <>&nbsp;
          <Spinner size='small' />
        </>}
      </Button>
    </div>
  );
};

export default SubmitButtonControl;
