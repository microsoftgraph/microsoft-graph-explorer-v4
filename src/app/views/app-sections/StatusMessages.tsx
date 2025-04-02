import { MessageBar, MessageBarBody, MessageBarActions, MessageBarIntent, Button } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { IQuery } from '../../../types/query-runner';
import { clearQueryStatus } from '../../services/slices/query-status.slice';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const intentMap: { [key: string]: MessageBarIntent } = {
  'info': 'info',
  'error': 'error',
  'warning': 'warning',
  'success': 'success'
};

const StatusMessages = () => {
  const dispatch = useAppDispatch();
  const queryRunnerStatus = useAppSelector((state) => state.queryRunnerStatus);
  const sampleQuery = useAppSelector((state) => state.sampleQuery);

  function setQuery(link: string) {
    const query: IQuery = { ...sampleQuery };
    link = link.replace(/\.$/, '');
    query.sampleUrl = link;
    query.selectedVerb = 'GET';
    dispatch(setSampleQuery(query));
  }

  if (
    !queryRunnerStatus?.status ||
    typeof queryRunnerStatus.status === 'string' && queryRunnerStatus.status.trim() === ''
  ) {
    return <div />;
  }

  const { messageBarType, statusText, status, duration, hint } = queryRunnerStatus;
  return (
    <MessageBar intent={intentMap[messageBarType]} politeness='assertive'>
      <MessageBarBody>
        <MessageDisplay message={`**${statusText} - **${status}`} onSetQuery={setQuery} />
        {duration && <> - {duration} {translateMessage('milliseconds')}</>}
        {status === 403 && <>
          {translateMessage('consent to scopes')}
          <span style={{ fontWeight: 600 }}>
            {translateMessage('modify permissions')}
          </span>
          {translateMessage('tab')}
        </>}
        {hint && <div>{hint}</div>}
      </MessageBarBody>
      <MessageBarActions
        containerAction={
          <Button
            onClick={() => dispatch(clearQueryStatus())}
            aria-label="dismiss"
            appearance="transparent"
            icon={<DismissRegular />}
          />
        }
      />
    </MessageBar>
  );
};

export default StatusMessages;