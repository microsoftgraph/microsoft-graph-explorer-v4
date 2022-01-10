import React from 'react';
import { cleanup, render} from '@testing-library/react';
import { responseMessages } from '../../app/views/app-sections/ResponseMessages';

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

  const dispatch = jest.fn();

  return render(
    <div>
      {responseMessages(graphResponse, sampleQuery, dispatch)}
    </div>
  )
}

describe('Renders response messages', () => {
  it('Renders the response messages', () => {
    renderResponseMessages();
  })
})