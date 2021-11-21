import { Coachmark, DirectionalHint, IButtonProps, TeachingBubbleContent } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { translateMessage } from './translate-messages';

interface IBubbleProps {
  headline: string;
  target: string;
  content: string;
  position: DirectionalHint;
  onDismiss: Function;
}

const HintBubble = (props: IBubbleProps) => {
  const [defaultCoachmarkPosition] = useState(DirectionalHint.bottomCenter);
  const [isCoachMarkVisible, setIsCoachMarkVisible] = useState(false);

  useEffect(() => {
    setIsCoachMarkVisible(true);
  },[])

  const closePopup = () => {
    setIsCoachMarkVisible(false);
    props.onDismiss();
  }

  const closeButton : IButtonProps = React.useMemo(
    () => ({
      children: <FormattedMessage id='Got it' />,
      onClick: closePopup
    }),[]
  )

  const positioningContainerProps = React.useMemo(
    () => ({
      directionalHint: props.position ? props.position : defaultCoachmarkPosition,
      doNotLayer: false
    }),
    [defaultCoachmarkPosition, props.position],
  );

  return (
    <div>
      {isCoachMarkVisible && (
        <Coachmark target={props.target}
          positioningContainerProps={positioningContainerProps}
          ariaAlertText={translateMessage('A coachmark has appeared')}
          ariaDescribedBy={translateMessage('Coachmark description')}
          ariaDescribedByText={translateMessage('How to open the coachmark')}
          ariaLabelledByText={translateMessage('Coachmark notification')}
        >
          <TeachingBubbleContent
            headline={props.headline}
            onDismiss={closePopup}
            primaryButtonProps={closeButton}
            styles={{root: {lineHeight: '1.5'}}}
            hasCloseButton
            closeButtonAriaLabel={translateMessage('Close')}
          >
            <div style={{lineHeight: '1.5'}}>{props.content}</div>
          </TeachingBubbleContent>
        </Coachmark>
      )}
    </div>
  )
}

export default HintBubble;