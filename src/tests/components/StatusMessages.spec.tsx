import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { statusMessages } from '../../app/views/app-sections/StatusMessages';

afterEach(cleanup)
const renderStatusMessage = () => {
  const queryState = {
    messageType: 0,
    ok: true,
    status: 200,
    statusText: 'OK',
    duration: 200
  }

  const sampleQuery = {
    selectedVerb: 'GET',
    selectedVersion: 'v1',
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    sampleHeaders: []
  }

  const actions = {
    clearQueryStatus: jest.fn(),
    clearTermsOfUse: jest.fn(),
    setSampleQuery: jest.fn(),
    runQuery: jest.fn(),
    toggleSidebar: jest.fn(),
    signIn: jest.fn(),
    storeScopes:jest.fn()
  }

  return render(
    <div>
      {statusMessages(queryState, sampleQuery, actions)}
    </div>
  )
}

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Renders the status bar', () =>{
  it('Renders the status bar', () => {
    renderStatusMessage();
    expect(screen.getByRole('status')).toBeDefined();
  })
})