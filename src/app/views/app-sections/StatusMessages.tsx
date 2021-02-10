import { Link, MessageBar } from 'office-ui-fabric-react';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { IQuery } from '../../../types/query-runner';
import { GRAPH_URL } from '../../services/graph-constants';
import { convertArrayToObject, extractUrl, replaceLinks } from '../../utils/status-message';

export function statusMessages(queryState: any, sampleQuery: IQuery, actions: any) {
  function displayStatusMessage(message: string, urls: any) {
    const pattern = /([$0-9]+)/g;
    message = message.toString();
    const matches = message.match(pattern);
    const parts = message.split(pattern);

    if (!parts || !matches || !urls || Object.keys(urls).length === 0) {
      return message;
    }


    return parts.map((part: string, index: number) => {
      const displayLink = (): React.ReactNode => {
        const link = urls[part];
        if (link.includes(GRAPH_URL)) {
          return <Link onClick={() => setQuery(link)}>{link}</Link>;
        }
        return <Link target="_blank" href={link}>{link}</Link>;
      };

      return (
        <Fragment key={part + index}>{matches.includes(part) ?
          displayLink() : part}
        </Fragment>
      );
    })
  }

  function setQuery(link: string) {
    const query: IQuery = { ...sampleQuery };
    query.sampleUrl = link;
    actions.setSampleQuery(query);
  };

  if (queryState) {
    const { messageType, statusText, status, duration } = queryState;
    let urls: any = {};
    let message = status;
    const extractedUrls = extractUrl(status);
    if (extractedUrls) {
      message = replaceLinks(status);
      urls = convertArrayToObject(extractedUrls);
    }

    return (
      <MessageBar messageBarType={messageType}
        isMultiline={true}
        onDismiss={actions.clearQueryStatus}
        dismissButtonAriaLabel='Close'
        aria-live={'assertive'}>
        {`${statusText} - `}{displayStatusMessage(message, urls)}

        {duration && <>
          {` - ${duration}`}<FormattedMessage id='milliseconds' />
        </>}

        {status === 403 && <>.
          <FormattedMessage id='consent to scopes' />
          <span style={{ fontWeight: 600 }}>
            <FormattedMessage id='modify permissions' />
          </span>
          <FormattedMessage id='tab' />
        </>}

      </MessageBar>);
  }
}
