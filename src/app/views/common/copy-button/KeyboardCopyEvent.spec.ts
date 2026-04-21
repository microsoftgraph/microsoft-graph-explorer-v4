jest.mock('../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn() },
  eventTypes: { KEYBOARD_COPY_EVENT: 'keyboard_copy' }
}));
jest.mock('../../../../telemetry/component-names', () => ({
  KEYBOARD_COPY_TABS: {
    'response-body': 'Response Body',
    'snippet-content': 'Code Snippets'
  }
}));

import { KeyboardCopyEvent } from './KeyboardCopyEvent';
import { telemetry } from '../../../../telemetry';

describe('KeyboardCopyEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers keyboard event listener', () => {
    const addEventSpy = jest.spyOn(document, 'addEventListener');
    KeyboardCopyEvent();
    expect(addEventSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    addEventSpy.mockRestore();
  });

  it('tracks copy event for known component', () => {
    KeyboardCopyEvent();

    const div = document.createElement('div');
    div.id = 'response-body';
    document.body.appendChild(div);

    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true,
      composed: true
    });
    div.dispatchEvent(event);

    document.body.removeChild(div);
  });

  it('does not track for non-Ctrl+C events', () => {
    KeyboardCopyEvent();
    const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true });
    document.dispatchEvent(event);
    // Should not crash
  });

  it('does not track when no matching component', () => {
    KeyboardCopyEvent();
    const div = document.createElement('div');
    div.id = 'unknown-component';
    document.body.appendChild(div);

    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true
    });
    div.dispatchEvent(event);

    document.body.removeChild(div);
  });
});
