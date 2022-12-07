import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import { MOZILLA_CORS_DOCUMENTATION_LINK } from '../../../services/graph-constants';
import { runQuery } from '../../../services/slices/graph-response.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { translateMessage } from '../../../utils/translate-messages';

interface ODataLink {
  link: string;
  name: string;
}

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

export const ResponseMessages = () => {
  const dispatch = useAppDispatch();
  const messageBars = [];
  const body = useAppSelector((state)=> state.graphResponse.response.body);
  const headers = useAppSelector((state)=> state.graphResponse.response.headers);
  const sampleQuery = useAppSelector((state)=> state.sampleQuery);
  const authToken= useAppSelector((state)=> state.auth.authToken);
  const graphExplorerMode = useAppSelector((state)=> state.graphExplorerMode);
  const [displayMessage, setDisplayMessage] = useState(true);

  const tokenPresent = !!authToken.token;
  const contentType = getContentType(headers);
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
        <Link onClick={() => setQuery()} underline>
          &nbsp;<FormattedMessage id='Click here to follow the link' />
        </Link>
      </MessageBar>
    );
  }

  // Display link to download file response
  if (body?.contentDownloadUrl) {
    messageBars.push(
      <div key={'contentDownloadUrl'}>
        <MessageBar messageBarType={MessageBarType.warning}>
          <FormattedMessage id={'This response contains unviewable content'} />
          <Link href={body?.contentDownloadUrl} download underline>
            <FormattedMessage id={'Click to download file'} />
          </Link>&nbsp;
        </MessageBar>
      </div>
    );
  }

  // Show CORS compliance message
  if (body?.throwsCorsError) {
    messageBars.push(
      <div key={'throwsCorsError'}>
        <MessageBar messageBarType={MessageBarType.warning}>
          <FormattedMessage id={'Response content not available due to CORS policy'} />
          <Link target='_blank' href={MOZILLA_CORS_DOCUMENTATION_LINK} underline>
            <FormattedMessage id={'here'} />
          </Link>.
        </MessageBar>
      </div>
    );
  }

  if (body && !tokenPresent && displayMessage && graphExplorerMode === Mode.Complete) {
    messageBars.push(
      <div key={'displayMessage'}>
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={true}
          onDismiss={() => setDisplayMessage(false)}
          dismissButtonAriaLabel={translateMessage('Close')}
        >
          {translateMessage('Using demo tenant')}{' '}
          {translateMessage('To access your own data:')}
        </MessageBar>
      </div>
    );
  }

  if (contentType === 'application/json' && typeof body === 'string') {
    messageBars.push(
      <div key={'application/json'}>
        <MessageBar
          messageBarType={MessageBarType.info}
          onDismiss={() => setDisplayMessage(false)}
          dismissButtonAriaLabel={translateMessage('Close')}
        >
          {translateMessage('Malformed JSON body')}
        </MessageBar>
      </div>
    );
  }

  return messageBars;
}