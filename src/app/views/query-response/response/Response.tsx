
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';
import ResponseDisplay from './ResponseDisplay';

const Response = () => {

  const { dimensions: { response }, graphResponse, responseAreaExpanded } = useSelector((state: any) => state);
  const { body, headers } = graphResponse;

  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 100);

  if (headers) {
    const contentType = getContentType(headers);
    return (
      <div style={{ display: 'block' }}>
        <MessageBar messageBarType={MessageBarType.info}>
          <FormattedMessage id='This response contains a next link property.' />
          <a href={'https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk'}
            target='_blank'
            rel='noopener noreferrer'
            tabIndex={0}
          >
            <FormattedMessage id='Click here to go to the next page' />
          </a>
        </MessageBar>
        <ResponseDisplay
          contentType={contentType}
          body={body}
          height={height}
        />
      </div>
    );
  }
  return <div />;
};

function getContentType(headers: any) {
  let contentType = null;

  const contentTypes = headers['content-type'];
  if (contentTypes) {
    /* Example: application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8
    * Take the first option after splitting since it is the only value useful in the description of the content
    */
    const splitContentTypes = contentTypes.split(';');
    if (splitContentTypes.length > 0) {
      contentType = splitContentTypes[0].toLowerCase();
    }
  }
  return contentType;
}

export default Response;
