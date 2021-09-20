import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { IGraphResponse } from '../../../types/query-response';

import { IQuery } from '../../../types/query-runner';
import { runQuery } from '../../services/actions/query-action-creators';
import { setSampleQuery } from '../../services/actions/query-input-action-creators';
import { ONE_DRIVE_CONTENT_DOWNLOAD_DOCUMENTATION_LINK } from '../../services/graph-constants';

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

  // Display link to step to next result
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

  // Display link to downlod file response
  if (body?.contentDownloadUrl) {
    return (
      <div>
        <MessageBar messageBarType={MessageBarType.info}>
          <FormattedMessage id={`This response contains unviewable content`}/>
          <Link href={body?.contentDownloadUrl} download>
              <FormattedMessage id={`Click to download file`}/>
          </Link>&nbsp;
        </MessageBar>
        {body?.isWorkaround == true &&
          <MessageBar messageBarType={MessageBarType.warning}>
            <FormattedMessage id={`Response is result of workaround`}/>
            {body?.isOriginalFormat == false &&
              <span>
                &nbsp;
                <FormattedMessage id={`File response is available in original format only`}/>
              </span>
            }
            &nbsp;
            <FormattedMessage id={`For more information`}/>
            <Link href={ONE_DRIVE_CONTENT_DOWNLOAD_DOCUMENTATION_LINK} target='_blank'>
              <FormattedMessage id={`documentation`}/>.
            </Link>
          </MessageBar>
        }
      </div>
      );
  }
}
