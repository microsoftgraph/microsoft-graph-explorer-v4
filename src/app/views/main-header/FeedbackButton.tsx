import { Button, MenuTrigger, Tooltip } from '@fluentui/react-components'
import { PersonFeedback20Regular } from '@fluentui/react-icons'
import { useState, useRef } from 'react'
import { useAppSelector } from '../../../store'
import { eventTypes, telemetry } from '../../../telemetry'
import { FEEDBACK_BUTTON } from '../../../telemetry/component-names'
import { ACCOUNT_TYPE } from '../../services/graph-constants'
import { translateMessage } from '../../utils/translate-messages'
import FeedbackForm from '../query-runner/request/feedback/FeedbackForm'
import { useHeaderStyles } from './utils'

const trackFeedbackButtonEvent = () => {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    ComponentName: FEEDBACK_BUTTON
  });
}
const FeedbackButton = ()=>{
  const [enableSurvey, setEnableSurvey] = useState(false);
  const user = useAppSelector(state=> state.profile.user)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const activateSurvey = () => {
    setEnableSurvey(true);
    trackFeedbackButtonEvent();
  }

  const disableSurvey = () => {
    setEnableSurvey(false);
    setTimeout(() => buttonRef.current?.focus(), 0);
  }

  const styles = useHeaderStyles()
  return (user?.profileType !== ACCOUNT_TYPE.AAD ? (
    <>
      <Tooltip content={translateMessage('Feedback')} relationship="description">
        <Button
          aria-label={translateMessage('Feedback')}
          onClick={activateSurvey}
          ref={buttonRef}
          className={styles.iconButton} appearance="subtle" icon={<PersonFeedback20Regular />} />
      </Tooltip>
      <FeedbackForm onDismissSurvey={disableSurvey}
        activated={enableSurvey} onDisableSurvey={disableSurvey} />
    </>
  ) : null)
}

export { FeedbackButton }

