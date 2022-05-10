import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { Permission } from './Permission';

afterEach(cleanup);

const renderPermission = (args?: any) => {
  return render(
    <Permission {...args} />
  );
}

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests Permission', () => {
  it('Renders permissions panel without crashing', () => {
    renderPermission({ panel: true, permissionsPanelOpen: true });
    screen.getByText(/To try out different Microsoft Graph API endpoints/)
  })

  it('Renders permissions tab without crashing', () => {
    renderPermission();
    screen.getByText(/Permissions for the query are missing on this tab/)
  })
})