jest.mock('../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: {},
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import CopyButton from './CopyButton';

describe('CopyButton', () => {
  it('renders icon button mode', () => {
    const handleClick = jest.fn();
    renderWithProviders(<CopyButton handleOnClick={handleClick} isIconButton={true} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders text button mode', () => {
    const handleClick = jest.fn();
    renderWithProviders(<CopyButton handleOnClick={handleClick} isIconButton={false} />);
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('handles click', () => {
    const handleClick = jest.fn();
    renderWithProviders(<CopyButton handleOnClick={handleClick} isIconButton={false} />);
    fireEvent.click(screen.getByText('Copy'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
