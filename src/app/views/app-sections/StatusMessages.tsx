import { Link, MessageBar } from 'office-ui-fabric-react';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { IQuery } from '../../../types/query-runner';
import { GRAPH_URL, PERMISSION_MODE_TYPE } from '../../services/graph-constants';
import {
  convertArrayToObject, extractUrl, getMatchesAndParts,
  matchIncludesLink, replaceLinks
} from '../../utils/status-message';

export function statusMessages(queryState: any, sampleQuery: IQuery, actions: any, permissionModeType: PERMISSION_MODE_TYPE, graphResponse: any) {
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
            return <Link onClick={() => setQuery(link)}>{link}</Link>;
          }
          return <Link target="_blank" href={link}>{link}</Link>;
        }
      };
      return (
        <Fragment key={part + index}>{includesLink ?
          displayLink() : part}
        </Fragment>
      );
    })
  }

  function determineErrorMessage() {
    if (graphResponse?.body?.message?.includes("Missing role permissions on the request")) {
      return <>.
        <FormattedMessage id='Please check that you have the' />
        <span style={{ fontWeight: 600 }}>
          <FormattedMessage id='app installed' />
        </span>
        <FormattedMessage id='the correct ID(s)' />
      </>;
    }
    return <>.
      <FormattedMessage id='This is a delegated API call' />
      <span style={{ fontWeight: 600 }}>
        <FormattedMessage id='delegated user mode' />
      </span>
      <FormattedMessage id='to try it out' />
    </>;
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

        {status === 403 && permissionModeType === PERMISSION_MODE_TYPE.User && <>.
          <FormattedMessage id='consent to scopes' />
          <span style={{ fontWeight: 600 }}>
            <FormattedMessage id='modify permissions' />
          </span>
          <FormattedMessage id='tab' />
        </>}

        {status > 400 && permissionModeType === PERMISSION_MODE_TYPE.TeamsApp && determineErrorMessage()}

      </MessageBar>);
  }
}
