import { getTheme, IButton, IconButton, IIconProps, TooltipHost } from '@fluentui/react';
import { useRef, useState, useEffect } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import FeedbackForm from '../query-runner/request/feedback/FeedbackForm';
import { ACCOUNT_TYPE } from '../../services/graph-constants';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { useAppSelector } from '../../../store';

export const FeedbackButton = () => {
  const [enableSurvey, setEnableSurvey] = useState(false);
  const user = useAppSelector((state) => state.profile.user)

  const currentTheme = getTheme();
  const feedbackIcon : IIconProps = {
    iconName : 'Feedback'
  }
  const feedbackTitle = translateMessage('Feedback');
  const content = <div style={{padding:'3px'}}>{translateMessage('Feedback')}</div>

  const feedbackButtonRef = useRef<IButton>(null)
  const isFirstRender = useRef(true);
  useEffect( () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if(!enableSurvey){
      feedbackButtonRef.current?.focus();
    }
  },[enableSurvey])

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
    setEnableSurvey(false);
  }

  const trackFeedbackButtonEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.FEEDBACK_BUTTON
    });
  }

  return (
    <div>
      {user?.profileType !== ACCOUNT_TYPE.AAD &&
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
            componentRef={feedbackButtonRef}
          />
        </TooltipHost>

        <FeedbackForm onDismissSurvey={disableSurvey}
          activated={enableSurvey} onDisableSurvey={disableSurvey} />
      </div>
      }
    </div>
  )
}