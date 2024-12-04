import { MessageBar, MessageBarType } from '@fluentui/react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { IQuery } from '../../../types/query-runner';
import { clearQueryStatus } from '../../services/slices/query-status.slice';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const StatusMessages = () => {
  const dispatch = useAppDispatch();
  const queryRunnerStatus = useAppSelector((state)=> state.queryRunnerStatus);
  const sampleQuery = useAppSelector((state)=> state.sampleQuery);

  function setQuery(link: string) {
    const query: IQuery = { ...sampleQuery };
    link = link.replace(/\.$/, '');
    query.sampleUrl = link;
    query.selectedVerb = 'GET';
    dispatch(setSampleQuery(query));
  }

  if (queryRunnerStatus) {
    const { statusText, status, duration, hint } = queryRunnerStatus;

    return <MessageBar messageBarType={MessageBarType.info}
      isMultiline={true}
      onDismiss={() => dispatch(clearQueryStatus())}
      dismissButtonAriaLabel='Close'
      aria-live={'assertive'}>
      <MessageDisplay message={`**${statusText} - **${status.toString()}`} onSetQuery={setQuery} />

      {duration && <>
        {` - ${duration} ${translateMessage('milliseconds')}`}
      </>}

      {status === 403 && <>.
        {translateMessage('consent to scopes')}
        <span style={{ fontWeight: 600 }}>
          {translateMessage('modify permissions')}
        </span>
        {translateMessage('tab')}
      </>}

      {hint && <div>{hint}</div>}

    </MessageBar>;
  }
  return <div />;
}

export default StatusMessages;
