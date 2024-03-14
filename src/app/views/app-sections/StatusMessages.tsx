import { MessageBar } from '@fluentui/react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../store';
import { IQuery } from '../../../types/query-runner';
import { setSampleQuery } from '../../services/actions/query-input-action-creators';
import { clearQueryStatus } from '../../services/actions/query-status-action-creator';
import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const StatusMessages = () => {
  const dispatch: AppDispatch = useDispatch();
  const { queryRunnerStatus, sampleQuery } =
    useAppSelector((state) => state);

  function setQuery(link: string) {
    const query: IQuery = { ...sampleQuery };
    link = link.replace(/\.$/, '');
    query.sampleUrl = link;
    query.selectedVerb = 'GET';
    dispatch(setSampleQuery(query));
  }

  if (queryRunnerStatus) {
    const { messageType, statusText, status, duration, hint } = queryRunnerStatus;

    return <MessageBar messageBarType={messageType}
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
