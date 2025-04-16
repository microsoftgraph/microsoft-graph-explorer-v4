import { useState } from 'react';

import {
  Button,
  Link,
  MessageBar,
  MessageBarActions,
  MessageBarBody, Text
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { Mode } from '../../../../types/enums';
import { CustomBody } from '../../../../types/query-response';
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
    odataLinks.forEach((link) => {
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
  const body = useAppSelector((state) => state.graphResponse.response.body);
  const headers = useAppSelector(
    (state) => state.graphResponse.response.headers
  );
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const graphExplorerMode = useAppSelector((state) => state.graphExplorerMode);
  const [displayMessage, setDisplayMessage] = useState(true);

  const tokenPresent = !!authToken.token;
  const contentType = getContentType(headers);
  const odataLink = getOdataLinkFromResponseBody(body);

  const setQuery = () => {
    const query: IQuery = { ...sampleQuery };
    query.sampleUrl = odataLink!.link;
    dispatch(setSampleQuery(query));
    dispatch(runQuery(query));
  };

  // Display link to step to next result
  if (odataLink) {
    messageBars.push(
      <MessageBar intent='info' key={'odataLink'}>
        <MessageBarBody>
          {translateMessage('This response contains an @odata property.')}&nbsp;
          <Text font="monospace">@odata.{odataLink.name}</Text>&nbsp;
          <Link onClick={setQuery} inline>{translateMessage('Click here to follow the link')}</Link>
        </MessageBarBody>
      </MessageBar>
    );
  }

  // Display link to download file response
  const contentDownloadUrl = (body as CustomBody)?.contentDownloadUrl;
  if (contentDownloadUrl) {
    messageBars.push(
      <div key={'contentDownloadUrl'}>
        <MessageBar intent='warning'>
          <MessageBarBody>
            {translateMessage('This response contains unviewable content')}
            <Link href={contentDownloadUrl} download inline>
              {translateMessage('Click to download file')}
            </Link>
          </MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  // Show CORS compliance message
  const throwsCorsError = (body as CustomBody)?.throwsCorsError;
  if (throwsCorsError) {
    messageBars.push(
      <div key={'throwsCorsError'}>
        <MessageBar intent='warning'>
          <MessageBarBody>
            {translateMessage(
              'Response content not available due to CORS policy'
            )}
            <Link target='_blank' href={MOZILLA_CORS_DOCUMENTATION_LINK} inline>
              {translateMessage('here')}
            </Link>
          </MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  if (
    body &&
    !tokenPresent &&
    displayMessage &&
    graphExplorerMode === Mode.Complete
  ) {
    messageBars.push(
      <div key={'displayMessage'}>
        <MessageBar intent='warning'>
          <MessageBarBody>
            {translateMessage('Using demo tenant')}{' '}
            {translateMessage('To access your own data:')}
          </MessageBarBody>
          <MessageBarActions
            containerAction={
              <Button
                onClick={() => setDisplayMessage(false)}
                aria-label={translateMessage('Close')}
                appearance='transparent'
                icon={<DismissRegular />}
              />
            }
          ></MessageBarActions>
        </MessageBar>
      </div>
    );
  }

  if (contentType === 'application/json' && typeof body === 'string') {
    messageBars.push(
      <div key={'application/json'}>
        <MessageBar intent='warning'>
          <MessageBarBody>
            {translateMessage('Malformed JSON body')}
          </MessageBarBody>
          <MessageBarActions
            containerAction={
              <Button
                onClick={() => setDisplayMessage(false)}
                aria-label={translateMessage('Close')}
                appearance='transparent'
                icon={<DismissRegular />}
              />
            }
          ></MessageBarActions>
        </MessageBar>
      </div>
    );
  }

  return messageBars;
};
