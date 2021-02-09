import { Link, MessageBar } from 'office-ui-fabric-react';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { convertArrayToObject, extractUrl, linkExists, replaceLinks } from '../../utils/status.util';

function displayStatusMessage(text: string, values: any) {
  const pattern = /([$0-9]+)/g;
  text = text.toString();
  const matches = text.match(pattern);
  const parts = text.split(pattern);

  if (!parts || !matches || !values || Object.keys(values).length === 0) {
    return text;
  }

  return parts.map((part: string, index: number) => {
    return (
      <Fragment key={part + index}>{matches.includes(part) ?
        <Link href={values[part]}>{values[part]}</Link> : part}
      </Fragment>
    );
  })
}

export function statusMessages(queryState: any, actions: any) {
  if (queryState) {
    const { messageType, statusText, status, duration } = queryState;
    let urls: any = {};
    let message = status;
    if (linkExists(status)) {
      message = replaceLinks(status);
      urls = convertArrayToObject(extractUrl(status));
    }

    return (
      <MessageBar messageBarType={messageType}
        isMultiline={true}
        onDismiss={actions.clearQueryStatus}
        dismissButtonAriaLabel='Close'
        aria-live={'assertive'}>
        {`${statusText} - `}{displayStatusMessage(message, urls)}

        {duration && <>
          {`- ${duration}`}<FormattedMessage id='milliseconds' />
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
