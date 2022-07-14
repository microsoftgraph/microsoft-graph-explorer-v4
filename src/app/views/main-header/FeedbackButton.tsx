import { getTheme, IButton, IconButton, IIconProps, IRefObject, TooltipHost } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import { useSelector } from 'react-redux';
import FeedbackForm from '../query-runner/request/feedback/FeedbackForm';
import { IRootState } from '../../../types/root';
import { ACCOUNT_TYPE } from '../../services/graph-constants';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';

interface IFeedbackButton {
  feedbackButtonRef: IRefObject<IButton>;
  setFocus: Function;
}
export const FeedbackButton = (props: IFeedbackButton) => {
  const [enableSurvey, setEnableSurvey] = useState(false);
  const { profile } = useSelector( (state: IRootState) => state );
  const currentTheme = getTheme();
  const feedbackIcon : IIconProps = {
    iconName : 'Feedback'
  }
  const feedbackTitle = translateMessage('Feedback');
  const content = <div style={{padding:'3px'}}>{translateMessage('Feedback')}</div>

  const feedbackIconStyles = {
    root:{
      height: '50px',
      width: '50px',
      marginTop: '-8px',
      ':hover': {
        background: `${currentTheme.palette.neutralLight} !important`
      }
    }
  }
  const calloutProps = {
    gapSpace: 0
  };
  const hostStyles = { root: {
    display: 'inline-block'
  }
  };

  const activateSurvey = () => {
    setEnableSurvey(true);
    trackFeedbackButtonEvent();
  }

  const disableSurvey = () => {
    props.setFocus();
    setEnableSurvey(false);
  }

  const trackFeedbackButtonEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.FEEDBACK_BUTTON
    });
  }

  return (
    <div>
      {profile?.profileType !== ACCOUNT_TYPE.AAD &&
      <div>
        <TooltipHost
          content={content}
          calloutProps={calloutProps}
          styles={hostStyles}
        >
          <IconButton onClick={activateSurvey}
            iconProps={feedbackIcon}
            ariaDescription={feedbackTitle}
            ariaLabel={feedbackTitle}
            styles={feedbackIconStyles}
            role={'button'}
            disabled={enableSurvey}
            componentRef = {props.feedbackButtonRef}
          />
        </TooltipHost>

        <FeedbackForm onDismissSurvey={disableSurvey}
          activated={enableSurvey} onDisableSurvey={disableSurvey} />
      </div>
      }
    </div>
  )
}