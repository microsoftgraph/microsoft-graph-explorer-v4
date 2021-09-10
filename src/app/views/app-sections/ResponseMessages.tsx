import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { IGraphResponse } from '../../../types/query-response';

import { IQuery } from '../../../types/query-runner';
import { runQuery } from '../../services/actions/query-action-creators';
import { setSampleQuery } from '../../services/actions/query-input-action-creators';

interface ODataLink {
  link: string;
  name: string;
};

export function responseMessages(graphResponse: IGraphResponse, sampleQuery: IQuery, dispatch: Function) {

  function getOdataLinkFromResponseBody(body: any): ODataLink | null {
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

  const { body } = graphResponse;
  const odataLink = getOdataLinkFromResponseBody(body);

  const setQuery = () => {
    const query: IQuery = { ...sampleQuery };
    query.sampleUrl = odataLink!.link;
    dispatch(setSampleQuery(query));
    dispatch(runQuery(query));
  }

  if (odataLink) {
    return (
      <MessageBar messageBarType={MessageBarType.info}>
        <FormattedMessage id={`This response contains an @odata property`} />: @odata.{odataLink!.name}
        <Link onClick={() => setQuery()}>
          &nbsp;<FormattedMessage id='Click here to follow the link' />
        </Link>
      </MessageBar>
    );
  }

  const contentDownloadUrl = body['contentDownloadUrl'];
  if (contentDownloadUrl) {
    const isOriginalFormat = body['isOriginalFormat'];
    const isWorkaround = body['isWorkaround'];

    return (
      <MessageBar messageBarType={MessageBarType.warning}>
        <FormattedMessage id={`This response contains unviewable content`}/>&nbsp;
        <Link href={contentDownloadUrl} download>
            <FormattedMessage id={`Click here to download`}/>
        </Link>&nbsp;
        {isOriginalFormat && <FormattedMessage id={`File response is available in original format only`}/>}&nbsp;
        {isWorkaround && <FormattedMessage id={`Response is result of workaround`}/>}
      </MessageBar>
    );
  }
}
