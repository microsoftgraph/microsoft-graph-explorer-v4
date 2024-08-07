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

const StatusMessages = () => {
  const dispatch = useAppDispatch();
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
      {`${statusText} - `}{displayStatusMessage(message, urls)}

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
