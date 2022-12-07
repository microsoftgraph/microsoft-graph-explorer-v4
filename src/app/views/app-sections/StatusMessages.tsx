import { MessageBar } from '@fluentui/react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { IQuery } from '../../../types/query-runner';
import { clearQueryStatus } from '../../services/slices/query-status.slice';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { translateMessage } from '../../utils/translate-messages';
import MessageDisplay from '../common/message-display/MessageDisplay';

const StatusMessages = () => {
  const dispatch: AppDispatch = useDispatch();
  const { queryRunnerStatus, sampleQuery } =
    useAppSelector((state) => state);

  function displayStatusMessage(message: string, urls: any) {
    const { matches, parts } = getMatchesAndParts(message);

    if (!parts || !matches || !urls || Object.keys(urls).length === 0) {
      return message;
    }

    return parts.map((part: string, index: number) => {
      const includesLink = matchIncludesLink(matches, part);
      const displayLink = (): React.ReactNode => {
        const link = urls[part];
        if (link) {
          if (link.includes(GRAPH_URL)) {
            return <Link onClick={() => setQuery(link)} underline>{link}</Link>;
          }
          return <Link target="_blank" href={link} underline>{link}</Link>;
        }
      };
      return (
        <Fragment key={part + index}>{includesLink ?
          displayLink() : part}
        </Fragment>
      );
    })
  }

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
