import { Link, MessageBar } from '@fluentui/react';
import { Fragment } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { IQuery } from '../../../types/query-runner';
import { GRAPH_URL } from '../../services/graph-constants';
import { clearQueryStatus } from '../../services/slices/query-status.slice';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import {
  convertArrayToObject, extractUrl, getMatchesAndParts,
  matchIncludesLink, replaceLinks
} from '../../utils/status-message';
import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const StatusMessages = () => {
  const dispatch = useAppDispatch();
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
    if (Object.keys(queryRunnerStatus).length === 0) { return null; }

    let urls: { [key: string]: string; } = {};
    let message = status.toString();
    const extractedUrls = extractUrl(status.toString());
    if (extractedUrls) {
      message = replaceLinks(status.toString());
      urls = convertArrayToObject(extractedUrls);
    }

    return <MessageBar messageBarType={messageType}
      isMultiline={true}
      onDismiss={() => dispatch(clearQueryStatus())}
      dismissButtonAriaLabel='Close'
      aria-live={'assertive'}>
      {`${statusText} - `}{<MessageDisplay message={status.toString()} onSetQuery={setQuery} />}

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
