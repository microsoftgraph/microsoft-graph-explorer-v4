
import { Link, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IQuery } from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';
import ResponseDisplay from './ResponseDisplay';

interface OdataLink {
  link: string;
  name: string;
};

const Response = () => {
  const dispatch = useDispatch();

  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } = useSelector((state: IRootState) => state);
  const { body, headers } = graphResponse;

  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 100);
  const odataLink = getOdataLinkFromBody(body);

  const setQuery = () => {
    const query: IQuery = { ...sampleQuery };
    query.sampleUrl = odataLink!.link;
    dispatch(setSampleQuery(query));
    dispatch(runQuery(query));
  }

  if (headers) {
    const contentType = getContentType(headers);
    return (
      <div style={{ display: 'block' }}>
        {odataLink &&
          <MessageBar messageBarType={MessageBarType.info}>
            <FormattedMessage id={`This response contains an @odata property`} />: @odata.{odataLink!.name}
            <Link onClick={() => setQuery()}>
              &nbsp;<FormattedMessage id='Click here to follow the link' />
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

function getOdataLinkFromBody(body: any): OdataLink | null {
  const odataLinks = ['nextLink', 'deltaLink'];
  let data = null;
  if (body) {
    odataLinks.forEach(link => {
      if (body[`@odata.${link}`]) {
        data = {
          link: decodeURIComponent(body[`@odata.${link}`]),
          name: link
        };
      }
    });
  }
  return data;
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
