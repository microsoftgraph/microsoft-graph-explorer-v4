jest.mock('../../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn' },
  componentNames: { SHARE_QUERY_COPY_BUTTON: 'ShareCopy' }
}));
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../../utils/query-url-sanitization', () => ({
  sanitizeQueryUrl: (url: string) => url
}));
jest.mock('../../../common/copy', () => ({
  copy: jest.fn()
}));
jest.mock('../../../common/share', () => ({
  createShareLink: jest.fn(() => 'https://share-link.com/test')
}));
jest.mock('../../../common/lazy-loader/component-registry', () => ({
  CopyButton: ({ handleOnClick, isIconButton }: any) => (
    <button onClick={handleOnClick}>{isIconButton ? 'CopyIcon' : 'Copy'}</button>
  )
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test-utils';
import ShareQuery from './ShareQuery';

describe('ShareQuery', () => {
  const mockDismiss = jest.fn();

  it('renders share link textarea', () => {
    renderWithProviders(
      <ShareQuery dismissPopup={mockDismiss} closePopup={jest.fn()}
        data={null as any} settings={{ title: '' }} />
    );
    const textarea = document.getElementById('share-query-text') as HTMLTextAreaElement;
    expect(textarea).toBeDefined();
    expect(textarea.defaultValue).toBe('https://share-link.com/test');
  });

  it('renders copy button', () => {
    renderWithProviders(
      <ShareQuery dismissPopup={mockDismiss} closePopup={jest.fn()}
        data={null as any} settings={{ title: '' }} />
    );
    expect(screen.getByText('Copy')).toBeDefined();
  });

  it('renders close button', () => {
    renderWithProviders(
      <ShareQuery dismissPopup={mockDismiss} closePopup={jest.fn()}
        data={null as any} settings={{ title: '' }} />
    );
    expect(screen.getByText('Close')).toBeDefined();
  });

  it('calls dismissPopup on close', () => {
    renderWithProviders(
      <ShareQuery dismissPopup={mockDismiss} closePopup={jest.fn()}
        data={null as any} settings={{ title: '' }} />
    );
    fireEvent.click(screen.getByText('Close'));
    expect(mockDismiss).toHaveBeenCalled();
  });
});
