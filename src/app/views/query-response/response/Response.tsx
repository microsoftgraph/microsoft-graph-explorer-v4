
import { Link, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IQuery } from '../../../../types/query-runner';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';
import ResponseDisplay from './ResponseDisplay';

const Response = () => {
  const dispatch = useDispatch();

  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } = useSelector((state: any) => state);
  const { body, headers } = graphResponse;

  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 100);
  const nextLink = getNextLinkFromBody(body);

  const setQuery = () => {
    const query: IQuery = { ...sampleQuery };
    query.sampleUrl = nextLink;
    dispatch(setSampleQuery(query));
    dispatch(runQuery(query));
  }

  if (headers) {
    const contentType = getContentType(headers);
    return (
      <div style={{ display: 'block' }}>
        {nextLink &&
          <MessageBar messageBarType={MessageBarType.info}>
            <FormattedMessage id='This response contains an @odata.nextLink property.' />
            <Link onClick={() => setQuery()}>
              &nbsp;<FormattedMessage id='Click here to go to the next page' />
            </Link>
          </MessageBar>
        }
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

function getNextLinkFromBody(body: any) {
  if (body && body['@odata.nextLink']) {
    return body['@odata.nextLink'];
  }
  return null;
}

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
