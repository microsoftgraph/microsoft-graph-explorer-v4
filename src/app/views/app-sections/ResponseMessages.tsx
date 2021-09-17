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

  if (body?.contentDownloadUrl) {
    const workaroundQueries = {
      oneDrive: `await client.api('/drive/items/{item-id}').get().select('content.downloadUrl')`
    };
    return (
      <MessageBar messageBarType={MessageBarType.warning}>
        <FormattedMessage id={`This response contains unviewable content`}/>&nbsp;
        <Link href={body?.contentDownloadUrl} download>
            <FormattedMessage id={`Click here to download`}/>
        </Link>&nbsp;
        {body?.isWorkaround == true && <div><FormattedMessage id={`Response is result of workaround`}/> {workaroundQueries.oneDrive} </div>}
        {body?.isOriginalFormat == false && <div><FormattedMessage id={`File response is available in original format only`}/></div>}&nbsp;
      </MessageBar>
    );
  }
}
