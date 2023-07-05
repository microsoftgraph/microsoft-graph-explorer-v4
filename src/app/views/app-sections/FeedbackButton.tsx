import {
  DirectionalHint,
  IconButton,
  IIconProps,
  TooltipHost
} from '@fluentui/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
const FeedbackForm = lazy(
  () =>
    import(
      /* webpackChunkName: "feedback-form" */ '../query-runner/request/feedback/FeedbackForm'
    )
);
import { ACCOUNT_TYPE } from '../../services/graph-constants';
import { useAppSelector } from '../../../store';

export const FeedbackButton = () => {
  const [enableSurvey, setEnableSurvey] = useState(false);
  const [renderSurvey, setRenderSurvey] = useState(false);
  const { profile } = useAppSelector((state) => state);

  const feedbackIcon: IIconProps = {
    iconName: 'Feedback'
  };
  const feedbackTitle = translateMessage('Feedback');
  const content = (
    <div style={{ padding: '3px' }}>{translateMessage('Feedback')}</div>
  );

  const feedbackIconStyles = {
    root: {
      height: '50px',
      width: '50px'
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
  useEffect(() => {
    if (enableSurvey && !renderSurvey) {
      setRenderSurvey(true);
      return;
    }
  }, [enableSurvey, renderSurvey]);

  const toggleSurvey = () => {
    setEnableSurvey((prevState) => !prevState);
  };

  const disableSurvey = () => {
    setEnableSurvey(false);
  };

  return (
    <div>
      {profile?.profileType !== ACCOUNT_TYPE.AAD && (
        <div>
          <TooltipHost
            content={content}
            calloutProps={calloutProps}
            styles={hostStyles}
            directionalHint={DirectionalHint.leftCenter}
          >
            <IconButton
              onClick={toggleSurvey}
              iconProps={feedbackIcon}
              ariaDescription={feedbackTitle}
              ariaLabel={feedbackTitle}
              styles={feedbackIconStyles}
              role={'button'}
              disabled={enableSurvey}
            />
          </TooltipHost>
          {renderSurvey && (
            /* use null as a fallback as the feedback form renders in a different DOM sub-tree */
            <Suspense fallback={null}>
              <FeedbackForm
                onDismissSurvey={toggleSurvey}
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
