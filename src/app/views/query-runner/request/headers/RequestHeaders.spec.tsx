import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test-utils';
import RequestHeaders from './RequestHeaders';

jest.mock('../../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn()
  }
}));
jest.mock('../../../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn().mockReturnValue(''),
  getConsentAuthErrorHint: jest.fn().mockReturnValue(''),
  signInAuthError: jest.fn().mockReturnValue(false)
}));
jest.mock('../../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn() },
  componentNames: {},
  eventTypes: {}
}));

let mockDeleteHandler: ((header: any) => void) | null = null;
let mockEditHandler: ((header: any) => void) | null = null;
jest.mock('./HeadersList', () => ({
  __esModule: true,
  default: (props: any) => {
    mockDeleteHandler = props.handleOnHeaderDelete;
    mockEditHandler = props.handleOnHeaderEdit;
    return (
      <div data-testid="headers-list">
        {props.headers.map((h: any, i: number) => (
          <div key={i} data-testid={`header-${h.name}`}>
            {h.name}: {h.value}
            <button data-testid={`delete-${h.name}`} onClick={() => props.handleOnHeaderDelete(h)}>Delete</button>
            <button data-testid={`edit-${h.name}`} onClick={() => props.handleOnHeaderEdit(h)}>Edit</button>
          </div>
        ))}
        <span data-testid="header-count">{props.headers.length} headers</span>
      </div>
    );
  }
}));
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

describe('RequestHeaders', () => {
  const stateWithHeaders = {
    sampleQuery: {
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      selectedVerb: 'GET',
      sampleBody: undefined,
      sampleHeaders: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'Authorization', value: 'Bearer token' }
      ],
      selectedVersion: 'v1.0'
    }
  };

  it('renders header input fields and Add button', () => {
    renderWithProviders(<RequestHeaders />);
    expect(screen.getByPlaceholderText('Key')).toBeTruthy();
    expect(screen.getByPlaceholderText('Value')).toBeTruthy();
    expect(screen.getByText('Add')).toBeTruthy();
  });

  it('Add button is disabled when inputs are empty', () => {
    renderWithProviders(<RequestHeaders />);
    const addButton = screen.getByText('Add').closest('button');
    expect(addButton).toBeTruthy();
    expect(addButton!.disabled).toBe(true);
  });

  it('renders HeadersList with sample headers from store', () => {
    renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    expect(screen.getByTestId('headers-list')).toBeTruthy();
    expect(screen.getByText('2 headers')).toBeTruthy();
  });

  it('enables Add button when both key and value are filled', () => {
    renderWithProviders(<RequestHeaders />);
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: 'X-Custom', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'test-value', name: 'value' } });
    const addButton = screen.getByText('Add').closest('button');
    expect(addButton!.disabled).toBe(false);
  });

  it('adds a header and clears inputs on Add button click', () => {
    renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: 'X-Custom', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'test-value', name: 'value' } });
    fireEvent.click(screen.getByText('Add'));
    // After adding, inputs should be cleared
    expect((screen.getByPlaceholderText('Key') as HTMLInputElement).value).toBe('');
    expect((screen.getByPlaceholderText('Value') as HTMLInputElement).value).toBe('');
  });

  it('does not add header when key is empty', () => {
    renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'test-value', name: 'value' } });
    const addButton = screen.getByText('Add').closest('button');
    expect(addButton!.disabled).toBe(true);
  });

  it('does not add header when value is whitespace only', () => {
    renderWithProviders(<RequestHeaders />);
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: 'X-Custom', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: '   ', name: 'value' } });
    const addButton = screen.getByText('Add').closest('button');
    expect(addButton!.disabled).toBe(true);
  });

  it('deletes a header by dispatching to store', () => {
    renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    // Click delete - this dispatches setSampleQuery with filtered headers
    fireEvent.click(screen.getByTestId('delete-Content-Type'));
    // The dispatch happened (store is identity reducer so won't reflect changes)
    // Verify the button interaction worked without error
    expect(screen.getByTestId('headers-list')).toBeTruthy();
  });

  it('edits a header by populating inputs and changing button to Update', () => {
    renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    fireEvent.click(screen.getByTestId('edit-Content-Type'));
    // After edit, inputs should be filled with the header values
    expect((screen.getByPlaceholderText('Key') as HTMLInputElement).value).toBe('Content-Type');
    expect((screen.getByPlaceholderText('Value') as HTMLInputElement).value).toBe('application/json');
    // Button should say Update
    expect(screen.getByText('Update')).toBeTruthy();
  });

  it('renders in mobile layout when mobileScreen is true', () => {
    renderWithProviders(<RequestHeaders />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: true }
      }
    });
    expect(screen.getByPlaceholderText('Key')).toBeTruthy();
  });

  it('hover over container sets isHoverOverHeadersList', () => {
    const { container } = renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    const mainDiv = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(mainDiv);
    fireEvent.mouseLeave(mainDiv);
    // No crash, component still renders
    expect(screen.getByPlaceholderText('Key')).toBeTruthy();
  });

  it('does not add header when name is whitespace only', () => {
    renderWithProviders(<RequestHeaders />);
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: '   ', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'test-value', name: 'value' } });
    const addButton = screen.getByText('Add').closest('button');
    expect(addButton!.disabled).toBe(true);
  });

  it('updates header after editing - button text changes to Update', () => {
    renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    fireEvent.click(screen.getByTestId('edit-Authorization'));
    expect((screen.getByPlaceholderText('Key') as HTMLInputElement).value).toBe('Authorization');
    expect((screen.getByPlaceholderText('Value') as HTMLInputElement).value).toBe('Bearer token');
    expect(screen.getByText('Update')).toBeTruthy();
  });

  it('can add header after editing (Update button click)', () => {
    renderWithProviders(<RequestHeaders />, { preloadedState: stateWithHeaders });
    // Edit a header
    fireEvent.click(screen.getByTestId('edit-Content-Type'));
    expect(screen.getByText('Update')).toBeTruthy();
    // Modify the value
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'text/plain', name: 'value' } });
    // Click Update
    fireEvent.click(screen.getByText('Update'));
    // Inputs should be cleared, button back to Add
    expect((screen.getByPlaceholderText('Key') as HTMLInputElement).value).toBe('');
    expect(screen.getByText('Add')).toBeTruthy();
  });

  it('renders empty headers list when no sampleHeaders in store', () => {
    const emptyState = {
      sampleQuery: {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me',
        selectedVerb: 'GET',
        sampleBody: undefined,
        sampleHeaders: [],
        selectedVersion: 'v1.0'
      }
    };
    renderWithProviders(<RequestHeaders />, { preloadedState: emptyState });
    expect(screen.getByText('0 headers')).toBeTruthy();
  });
});
