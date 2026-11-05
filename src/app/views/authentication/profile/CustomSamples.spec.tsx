import '@testing-library/jest-dom';
jest.mock('../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackException: jest.fn() },
  componentNames: jest.requireActual('../../../../telemetry/component-names'),
  eventTypes: jest.requireActual('../../../../telemetry/event-types'),
  errorTypes: jest.requireActual('../../../../telemetry/error-types')
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn() }
}));
jest.mock('../../../../modules/cache/samples.cache', () => ({
  samplesCache: { readSamples: jest.fn().mockResolvedValue([]), saveSamples: jest.fn().mockResolvedValue(undefined) }
}));
jest.mock('../../../../modules/cache/resources.cache', () => ({
  resourcesCache: {
    readResources: jest.fn().mockResolvedValue(null), saveResources: jest.fn().mockResolvedValue(undefined)
  }
}));

import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { authenticationWrapper } from '../../../../modules/authentication';
import { renderWithProviders } from '../../../../test-utils';
import { devxAccountSynced } from '../../../services/devx-events';
import devxApi from '../../../services/slices/devxapi.slice';
import samples from '../../../services/slices/samples.slice';
import resources from '../../../services/slices/resources.slice';
import { DialogWrapper } from '../../common/popups/DialogWrapper';
import CustomSamples from './CustomSamples';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';

describe('Custom Samples dialog', () => {
  const dismissPopup = jest.fn();
  const accountKey = 'account:tenant';
  const props = { dismissPopup, closePopup: jest.fn(), data: { accountKey }, settings: { title: 'Custom samples' } };

  function renderDialog(wrapped = false) {
    const store = configureStore({
      reducer: {
        devxApi, samples, resources,
        auth: () => ({ authToken: { token: true, pending: false }, consentedScopes: [] })
      }
    });
    store.dispatch(devxAccountSynced({ accountKey, eligible: true }));
    const rendered = renderWithProviders(wrapped ? <DialogWrapper isOpen
      Component={popupProps => <CustomSamples {...popupProps} data={{ accountKey }} />}
      popupsProps={{ settings: props.settings, data: props.data }}
      dismissPopup={dismissPopup} closePopup={props.closePopup} /> : <CustomSamples {...props} />, { store });
    dismissPopup.mockImplementation(rendered.unmount);
    return { store, unmount: rendered.unmount };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    dismissPopup.mockReset();
    (authenticationWrapper.getAccount as jest.Mock).mockReturnValue({
      username: 'alias@microsoft.com', homeAccountId: 'account', tenantId: 'tenant'
    });
    global.fetch = jest.fn(async (url: string) => ({
      ok: true, json: async () => new URL(url).pathname === '/samples'
        ? { sampleQueries: [] } : { labels: [], children: [], segment: '/' }
    })) as jest.Mock;
  });

  function enterSource() {
    fireEvent.change(screen.getByRole('textbox', { name: 'Organization' }), { target: { value: 'org' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Branch' }), { target: { value: 'feature/a' } });
  }

  it('focuses the Organization field when opened in the dialog', () => {
    renderDialog(true);
    expect(screen.getByRole('textbox', { name: 'Organization' })).toHaveFocus();
  });

  it('validates required fields and invalid URLs without fetching', () => {
    renderDialog();
    expect(screen.getByLabelText('DevX API URL')).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getAllByText('This field is required.')).toHaveLength(2);
    enterSource();
    fireEvent.change(screen.getByLabelText('DevX API URL'), { target: { value: 'http://custom.example' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByText(/Enter an HTTPS URL without credentials/)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(telemetry.trackEvent).toHaveBeenCalledWith(eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
      ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: 'failed', Reason: 'required-fields'
    });
    expect(telemetry.trackEvent).toHaveBeenLastCalledWith(eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
      ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: 'failed', Reason: 'invalid-url'
    });
    expect((telemetry.trackEvent as jest.Mock).mock.calls.filter(([, properties]) =>
      properties.ComponentName === componentNames.CUSTOM_SAMPLES_APPLY_BUTTON)).toHaveLength(2);
  });

  it('uses the default when the optional URL is blank, applies an empty sample set, and closes', async () => {
    const { store } = renderDialog();
    enterSource();
    fireEvent.change(screen.getByLabelText('DevX API URL'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(dismissPopup).toHaveBeenCalled());
    expect(store.getState().devxApi.custom).toBe(true);
    expect(store.getState().devxApi.branchName).toBe('feature/a');
    expect(store.getState().samples.queries).toEqual([]);
    expect((telemetry.trackEvent as jest.Mock).mock.calls).toEqual([
      [eventTypes.WINDOW_OPEN_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG }],
      [eventTypes.BUTTON_CLICK_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_APPLY_BUTTON }],
      [eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
        ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: 'succeeded'
      }],
      [eventTypes.WINDOW_CLOSE_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: 'applied' }]
    ]);
  });

  it('shows a loading failure, retains defaults, and does not dismiss', async () => {
    const { store } = renderDialog();
    enterSource();
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error('Private service failure: https://custom.example/org/feature/a')
    );
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Default samples remain active');
    expect(store.getState().devxApi.custom).toBe(false);
    expect(dismissPopup).not.toHaveBeenCalled();
    expect(telemetry.trackEvent).toHaveBeenLastCalledWith(eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
      ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: 'failed', Reason: 'loading-failed'
    });
    const events = JSON.stringify((telemetry.trackEvent as jest.Mock).mock.calls);
    expect(events).not.toContain('custom.example');
    expect(events).not.toContain('feature/a');
    expect(events).not.toContain(accountKey);
  });

  it('clears a previous failure when the dialog is reopened', async () => {
    const { store } = renderDialog();
    enterSource();
    (global.fetch as jest.Mock).mockRejectedValue(new Error('failure'));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(store.getState().devxApi.error).not.toBeNull();

    renderWithProviders(<CustomSamples {...props} />, { store });
    expect(store.getState().devxApi.error).toBeNull();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('cancel leaves settings unchanged', () => {
    const { store } = renderDialog();
    enterSource();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(store.getState().devxApi.custom).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(dismissPopup).toHaveBeenCalled();
    expect((telemetry.trackEvent as jest.Mock).mock.calls).toEqual([
      [eventTypes.WINDOW_OPEN_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG }],
      [eventTypes.BUTTON_CLICK_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_CANCEL_BUTTON }],
      [eventTypes.WINDOW_CLOSE_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: 'cancel' }]
    ]);
  });

  it('Escape dismisses the dialog without applying settings', () => {
    const { store } = renderDialog(true);
    enterSource();
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Organization' }), { key: 'Escape' });
    expect(dismissPopup).toHaveBeenCalled();
    expect(store.getState().devxApi.custom).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(telemetry.trackEvent).toHaveBeenLastCalledWith(eventTypes.WINDOW_CLOSE_EVENT, {
      ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: 'dismissed'
    });
  });

  it('disables duplicate Apply while loading and allows cancellation', async () => {
    const { store } = renderDialog();
    enterSource();
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => undefined));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(store.getState().devxApi.pending).toBe(false));
    expect(store.getState().devxApi.custom).toBe(false);
    expect((telemetry.trackEvent as jest.Mock).mock.calls).toEqual([
      [eventTypes.WINDOW_OPEN_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG }],
      [eventTypes.BUTTON_CLICK_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_APPLY_BUTTON }],
      [eventTypes.BUTTON_CLICK_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_CANCEL_BUTTON }],
      [eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
        ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: 'cancelled', Reason: 'cancel'
      }],
      [eventTypes.WINDOW_CLOSE_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: 'cancel' }]
    ]);
  });

  it('tracks pending application as cancelled on unmount, without a late failure or duplicate close', async () => {
    const { store, unmount } = renderDialog();
    enterSource();
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => undefined));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    unmount();
    await waitFor(() => expect(store.getState().devxApi.pending).toBe(false));
    expect((telemetry.trackEvent as jest.Mock).mock.calls.slice(2)).toEqual([
      [eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
        ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: 'cancelled', Reason: 'dismissed'
      }],
      [eventTypes.WINDOW_CLOSE_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: 'dismissed' }]
    ]);
  });

  it('tracks account-driven dismissal and cancels an in-flight apply', async () => {
    const { store } = renderDialog();
    enterSource();
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => undefined));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    act(() => { store.dispatch(devxAccountSynced({ accountKey: 'other:tenant', eligible: false })); });
    await waitFor(() => expect(dismissPopup).toHaveBeenCalledTimes(1));
    expect((telemetry.trackEvent as jest.Mock).mock.calls.slice(2)).toEqual([
      [eventTypes.CUSTOM_SAMPLES_APPLY_EVENT, {
        ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Status: 'cancelled', Reason: 'account-changed'
      }],
      [eventTypes.WINDOW_CLOSE_EVENT, {
        ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: 'account-changed'
      }]
    ]);
  });

  it('the title Close action aborts an in-flight apply and records one dismissal', async () => {
    const { store } = renderDialog(true);
    enterSource();
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => undefined));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(store.getState().devxApi.pending).toBe(false));
    expect(dismissPopup).toHaveBeenCalledTimes(1);
    expect(telemetry.trackEvent).toHaveBeenLastCalledWith(eventTypes.WINDOW_CLOSE_EVENT, {
      ComponentName: componentNames.CUSTOM_SAMPLES_DIALOG, Reason: 'dismissed'
    });
    expect(store.getState().devxApi.custom).toBe(false);
  });
});
