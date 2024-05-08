import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { MOZILLA_CORS_DOCUMENTATION_LINK } from '../../../services/graph-constants';
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
  const dispatch: AppDispatch = useDispatch();
  const messageBars = [];

  const { graphResponse: { body, headers }, sampleQuery, authToken, graphExplorerMode
  } = useAppSelector((state) => state);
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
    messageBars.push(
      <MessageBar messageBarType={MessageBarType.info}>
        {translateMessage('This response contains an @odata property.')}: @odata.{odataLink.name}
        <Link onClick={() => setQuery()} underline>
          &nbsp;{translateMessage('Click here to follow the link')}
        </Link>
      </MessageBar>
    );
  }

  // Display link to download file response
  if (body?.contentDownloadUrl) {
    messageBars.push(
      <div>
        <MessageBar messageBarType={MessageBarType.warning}>
          {translateMessage('This response contains unviewable content')}
          <Link href={body?.contentDownloadUrl} download underline>
            {translateMessage('Click to download file')}
          </Link>&nbsp;
        </MessageBar>
      </div>
    );
  }

  // Show CORS compliance message
  if (body?.throwsCorsError) {
    messageBars.push(
      <div>
        <MessageBar messageBarType={MessageBarType.warning}>
          {translateMessage('Response content not available due to CORS policy')}
          <Link target='_blank' href={MOZILLA_CORS_DOCUMENTATION_LINK} underline>
            {translateMessage('here')}
          </Link>.
        </MessageBar>
      </div>
    );
  }

  if (body && !tokenPresent && displayMessage && graphExplorerMode === Mode.Complete) {
    messageBars.push(
      <div>
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
      <div>
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