import { DirectionalHint, IconButton, IIconProps, TooltipHost } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import { useSelector } from 'react-redux';
import FeedbackForm from '../query-runner/request/feedback/FeedbackForm';
import { IRootState } from '../../../types/root';
import { ACCOUNT_TYPE } from '../../services/graph-constants';

export const FeedbackButton = () => {
  const [enableSurvey, setEnableShowSurvey] = useState(false);
  const { profile } = useSelector( (state: IRootState) => state );

  const toggleFeedback = () => {
    setEnableShowSurvey(prevState => !prevState);
  }

  const feedbackIcon : IIconProps = {
    iconName : 'Feedback'
  }
  const feedbackTitle = translateMessage('Feedback');
  const content_ = <div style={{padding:'3px'}}>{translateMessage('Feedback')}</div>

  const feedbackIconStyles = {
    root:{
      height: '50px',
      width: '50px'
    }
  }
  const calloutProps = {
    gapSpace: 0
  };
  const hostStyles = { root: {
    display: 'inline-block',
    padding: '15px'
  }
  };

  return (
    <div>
      {profile?.profileType !== ACCOUNT_TYPE.AAD &&
      <div>
        <TooltipHost
          content={content_}
          calloutProps={calloutProps}
          styles={hostStyles}
          directionalHint={DirectionalHint.leftBottomEdge}
        >
          <IconButton onClick={toggleFeedback}
            iconProps={feedbackIcon}
            ariaDescription={feedbackTitle}
            ariaLabel={feedbackTitle}
            styles={feedbackIconStyles}
            role={'button'}
            disabled={enableSurvey}
          />
        </TooltipHost>
        <FeedbackForm dismissSurvey={toggleFeedback} activated={enableSurvey} />
      </div>
      }
    </div>
  )
}