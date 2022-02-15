import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { IGraphResponse } from '../../../types/query-response';

import { IQuery } from '../../../types/query-runner';
import { runQuery } from '../../services/actions/query-action-creators';
import { setSampleQuery } from '../../services/actions/query-input-action-creators';
import {
  MOZILLA_CORS_DOCUMENTATION_LINK,
  ONE_DRIVE_CONTENT_DOWNLOAD_DOCUMENTATION_LINK,
  WORKLOAD
} from '../../services/graph-constants';

interface ODataLink {
  link: string;
  name: string;
}

export function responseMessages(graphResponse: IGraphResponse, sampleQuery: IQuery, dispatch: Function) {

  function getOdataLinkFromResponseBody(responseBody: any): ODataLink | null {
    const odataLinks = ['nextLink', 'deltaLink'];
    let data = null;
    if (responseBody) {
      odataLinks.forEach(link => {
        if (responseBody[`@odata.${link}`]) {
          data = {
            link: responseBody[`@odata.${link}`],
            name: link
          };
        }
      });
    }
    return data;
  }

  const { body } = graphResponse;
  const odataLink = getOdataLinkFromResponseBody(body);

  const setQuery = () => {
    const query: IQuery = { ...sampleQuery };
    query.sampleUrl = odataLink!.link;
    dispatch(setSampleQuery(query));
    dispatch(runQuery(query));
  }

  // Display link to step to next result
  if (odataLink) {
    return (
      <MessageBar messageBarType={MessageBarType.info}>
        <FormattedMessage id={'This response contains an @odata property.'} />: @odata.{odataLink!.name}
        <Link onClick={() => setQuery()}>
          &nbsp;<FormattedMessage id='Click here to follow the link' />
        </Link>
      </MessageBar>
    );
  }

  // Display link to download file response
  if (body?.contentDownloadUrl) {
    return (
      <div>
        <MessageBar messageBarType={MessageBarType.warning}>
          <FormattedMessage id={'This response contains unviewable content'} />
          <Link href={body?.contentDownloadUrl} download>
            <FormattedMessage id={'Click to download file'} />
          </Link>&nbsp;
        </MessageBar>
      </div>
    );
  }

  // Show CORS compliance message
  if (body?.throwsCorsError) {
    const documentationLink = body?.workload === WORKLOAD.ONEDRIVE
      ? ONE_DRIVE_CONTENT_DOWNLOAD_DOCUMENTATION_LINK
      : MOZILLA_CORS_DOCUMENTATION_LINK;
    return (
      <div>
        <MessageBar messageBarType={MessageBarType.warning}>
          <FormattedMessage id={'Response content not available due to CORS policy'} />
          <Link href={documentationLink}>
            <FormattedMessage id={'here'} />
          </Link>.
        </MessageBar>
      </div>
    );
  }
}
