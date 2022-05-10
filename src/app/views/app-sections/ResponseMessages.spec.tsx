import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { responseMessages } from './ResponseMessages';
import { Mode } from '../../../types/enums';

afterEach(cleanup);
const renderResponseMessages = (): any => {
  const graphResponse = {
    body: {
      '@odata.nextLink': 'https://graph.microsoft.com/v1.0/me/messages?$skip=18',
      contentDownloadUrl: 'https://www.microsoft.com',
      isWorkaround: true
    },
    headers: {}
  };

  const sampleQuery = {
    selectedVerb: 'GET',
    selectedVersion: 'v1',
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    sampleHeaders: []
  };

  const authToken = {pending: false, token: false };
  const graphExplorerMode = Mode.Complete

  const dispatch = jest.fn();

  return render(
    <div>
      {responseMessages(graphResponse, sampleQuery, authToken, graphExplorerMode, dispatch)}
    </div>
  )
}

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Renders response messages', () => {
  it('Renders the response messages', () => {
    renderResponseMessages();
  })
})