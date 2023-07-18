import {
  getTheme,
  IButton,
  IconButton,
  IIconProps,
  TooltipHost
} from '@fluentui/react';
import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { translateMessage } from '../../utils/translate-messages';
const FeedbackForm = lazy(
  () =>
    import(
      /* webpackChunkName: "feedback-form" */ '../query-runner/request/feedback/FeedbackForm'
    )
);
import { ACCOUNT_TYPE } from '../../services/graph-constants';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { useAppSelector } from '../../../store';

export const FeedbackButton = () => {
  const [enableSurvey, setEnableSurvey] = useState(false);
  const [renderSurvey, setRenderSurvey] = useState(false);
  const { profile } = useAppSelector((state) => state);
  const currentTheme = getTheme();
  const feedbackIcon: IIconProps = {
    iconName: 'Feedback'
  };
  const feedbackTitle = translateMessage('Feedback');
  const content = (
    <div style={{ padding: '3px' }}>{translateMessage('Feedback')}</div>
  );

  const feedbackButtonRef = useRef<IButton>(null);
  const isFirstSurveyRender = useRef(true);
  useEffect(() => {
    if (enableSurvey && !renderSurvey) {
      setRenderSurvey(true);
    }
    if (isFirstSurveyRender.current) {
      isFirstSurveyRender.current = false;
      return;
    }
    if (!enableSurvey) {
      feedbackButtonRef.current?.focus();
    }
  }, [enableSurvey, renderSurvey]);

  const feedbackIconStyles = {
    root: {
      height: '50px',
      width: '50px',
      marginTop: '-8px',
      ':hover': {
        background: `${currentTheme.palette.neutralLight} !important`
      }
    }
  };
  const calloutProps = {
    gapSpace: 0
  };
  const hostStyles = {
    root: {
      display: 'inline-block'
    }
  };

  const activateSurvey = () => {
    setEnableSurvey(true);
    trackFeedbackButtonEvent();
  };

  const disableSurvey = () => {
    setEnableSurvey(false);
  };

  const trackFeedbackButtonEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.FEEDBACK_BUTTON
    });
  };

  return (
    <div>
      {profile?.profileType !== ACCOUNT_TYPE.AAD && (
        <div>
          <TooltipHost
            content={content}
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <IconButton
              onClick={activateSurvey}
              iconProps={feedbackIcon}
              ariaDescription={feedbackTitle}
              ariaLabel={feedbackTitle}
              styles={feedbackIconStyles}
              role={'button'}
              disabled={enableSurvey}
              componentRef={feedbackButtonRef}
            />
          </TooltipHost>
          {renderSurvey && (
            /* use null as a fallback as the feedback form renders in a different DOM sub-tree */
            <Suspense fallback={null}>
              <FeedbackForm
                onDismissSurvey={disableSurvey}
                activated={enableSurvey}
                onDisableSurvey={disableSurvey}
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
};
