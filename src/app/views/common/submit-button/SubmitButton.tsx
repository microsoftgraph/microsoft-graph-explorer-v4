import { PrimaryButton, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ISubmitButtonControl } from '../../../../types/submit-button';

const SubmitButtonControl = ({
  handleOnClick,
  submitting,
  className,
  text,
}: ISubmitButtonControl) => {
    if (submitting) {
        return (
            <div className={className}>
            <PrimaryButton
              onClick={() => handleOnClick()}
            >
              <FormattedMessage
                id={text}
              />
            &nbsp;
            <Spinner size={SpinnerSize.small} />
            </PrimaryButton>
          </div>
        );
      } else {
        return (
            <div className={className}>
            <PrimaryButton
                onClick={() => handleOnClick()}
            >
                <FormattedMessage
                id={text}
                />
            </PrimaryButton>
            </div>
        );
      }
};

export default SubmitButtonControl;
