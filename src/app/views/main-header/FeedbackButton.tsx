import { getTheme, IconButton, IIconProps, TooltipHost } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import { useSelector } from 'react-redux';
import FeedbackForm from '../query-runner/request/feedback/FeedbackForm';
import { IRootState } from '../../../types/root';
import { ACCOUNT_TYPE } from '../../services/graph-constants';

interface IFeedback {
  feedbackRef: any;
  onSetFocus: Function
}
export const FeedbackButton = (props: IFeedback) => {
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

  const toggleSurvey = () => {
    props.onSetFocus();
    setEnableSurvey(prevState => !prevState);
  }

  const disableSurvey = () => {
    setEnableSurvey(false);
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
          <IconButton onClick={toggleSurvey}
            iconProps={feedbackIcon}
            ariaDescription={feedbackTitle}
            ariaLabel={feedbackTitle}
            styles={feedbackIconStyles}
            role={'button'}
            disabled={enableSurvey}
            componentRef = {props.feedbackRef}
          />
        </TooltipHost>

        <FeedbackForm onDismissSurvey={toggleSurvey}
          activated={enableSurvey} onDisableSurvey={disableSurvey} />
      </div>
      }
    </div>
  )
}