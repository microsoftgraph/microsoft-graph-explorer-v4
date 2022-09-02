import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { IAuthenticateResult } from '../../../../types/authentication';
import { Mode } from '../../../../types/enums';
import { IGraphResponse } from '../../../../types/query-response';

import { IQuery } from '../../../../types/query-runner';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { MOZILLA_CORS_DOCUMENTATION_LINK } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';

interface ODataLink {
  link: string;
  name: string;
}

export function responseMessages(
  graphResponse: IGraphResponse,
  sampleQuery: IQuery,
  authToken: IAuthenticateResult,
  graphExplorerMode: Mode,
  dispatch: Function) {

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
  const [displayMessage, setDisplayMessage] = useState(true);
  const tokenPresent = !!authToken.token;
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
        <FormattedMessage id={'This response contains an @odata property.'} />: @odata.{odataLink.name}
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
    return (
      <div>
        <MessageBar messageBarType={MessageBarType.warning}>
          <FormattedMessage id={'Response content not available due to CORS policy'} />
          <Link target='_blank' href={MOZILLA_CORS_DOCUMENTATION_LINK}>
            <FormattedMessage id={'here'} />
          </Link>.
        </MessageBar>
      </div>
    );
  }

  if(body && !tokenPresent && displayMessage && graphExplorerMode === Mode.Complete) {
    return (
      <div>
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={true}
          onDismiss={() => setDisplayMessage(false)}
          dismissButtonAriaLabel={translateMessage('Close')}
        >
          <FormattedMessage id='Using demo tenant' />{' '}
          <FormattedMessage id='To access your own data:' />
        </MessageBar>
      </div>
    );
  }
}
