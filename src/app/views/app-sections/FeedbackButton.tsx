import { IconButton, IIconProps } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import { useSelector } from 'react-redux';
import FeedbackForm from '../query-runner/request/feedback/FeedbackForm';
import { IRootState } from '../../../types/root';
import { ACCOUNT_TYPE } from '../../services/graph-constants';

export const FeedbackButton = () => {
  const [enableSurvey, setEnableShowSurvey] = useState(false);
  const { profile } = useSelector( (state: IRootState) => state )

  const toggleFeedback = () => {
    setEnableShowSurvey(prevState => !prevState);
  }

  const feedbackIcon : IIconProps = {
    iconName : 'Feedback'
  }
  const feedbackTitle = translateMessage('Feedback');

  const feedbackIconStyles = {
    root: {
      height: '40px',
      width: '40px'
    }
  }

  return (
    <>
      {profile?.profileType !== ACCOUNT_TYPE.AAD && <>
        <IconButton onClick={toggleFeedback}
          iconProps={feedbackIcon}
          title={feedbackTitle}
          ariaLabel={feedbackTitle}
          styles={feedbackIconStyles}
        />
      <FeedbackForm dismissSurvey={toggleFeedback} activated={enableSurvey} />
      </>}
    </>
  )
}