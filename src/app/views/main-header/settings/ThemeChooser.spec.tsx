import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../../utils/string-operations';

jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackReactComponent: jest.fn((c: any) => c),
    trackTabClickEvent: jest.fn()
  },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' },
  componentNames: { SELECT_THEME_BUTTON: 'select-theme' }
}));

jest.mock('../../../services/hooks', () => ({
  usePopups: jest.fn(() => ({ show: jest.fn() }))
}));

jest.mock('./ThemeChooser.styles', () => ({
  useIconOptionStyles: () => ({ root: 'icon-root', icon: 'icon', radio: 'radio' }),
  useRadioGroupStyles: () => ({ root: 'radio-group-root' })
}));

jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import ThemeChooser from './ThemeChooser';
import { renderWithProviders } from '../../../../test-utils';

describe('ThemeChooser', () => {
  const dismissPopup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders light and dark radio options', () => {
    renderWithProviders(
      <ThemeChooser {...{ dismissPopup, closePopup: jest.fn(), data: null, settings: { title: '' } } as any} />,
      { preloadedState: { theme: 'light' } }
    );
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('renders save button', () => {
    renderWithProviders(
      <ThemeChooser {...{ dismissPopup, closePopup: jest.fn(), data: null, settings: { title: '' } } as any} />,
      { preloadedState: { theme: 'light' } }
    );
    expect(screen.getByRole('button', { name: /Save changes/i })).toBeInTheDocument();
  });

  it('renders with dark theme selected', () => {
    renderWithProviders(
      <ThemeChooser {...{ dismissPopup, closePopup: jest.fn(), data: null, settings: { title: '' } } as any} />,
      { preloadedState: { theme: 'dark' } }
    );
    const darkRadio = screen.getByRole('radio', { name: /Dark/i });
    expect(darkRadio).toBeChecked();
  });

  it('renders with light theme selected', () => {
    renderWithProviders(
      <ThemeChooser {...{ dismissPopup, closePopup: jest.fn(), data: null, settings: { title: '' } } as any} />,
      { preloadedState: { theme: 'light' } }
    );
    const lightRadio = screen.getByRole('radio', { name: /Light/i });
    expect(lightRadio).toBeChecked();
  });

  it('clicking dark radio dispatches theme change and sets localStorage', () => {
    const { telemetry } = require('../../../../telemetry');
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    renderWithProviders(
      <ThemeChooser {...{ dismissPopup, closePopup: jest.fn(), data: null, settings: { title: '' } } as any} />,
      { preloadedState: { theme: 'light' } }
    );
    const darkRadio = screen.getByRole('radio', { name: /Dark/i });
    fireEvent.click(darkRadio);
    expect(setItemSpy).toHaveBeenCalledWith('CURRENT_THEME', 'dark');
    expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', expect.objectContaining({
      ComponentName: 'select-theme'
    }));
    setItemSpy.mockRestore();
  });

  it('clicking light radio dispatches theme change and sets localStorage', () => {
    const { telemetry } = require('../../../../telemetry');
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    renderWithProviders(
      <ThemeChooser {...{ dismissPopup, closePopup: jest.fn(), data: null, settings: { title: '' } } as any} />,
      { preloadedState: { theme: 'dark' } }
    );
    const lightRadio = screen.getByRole('radio', { name: /Light/i });
    fireEvent.click(lightRadio);
    expect(setItemSpy).toHaveBeenCalledWith('CURRENT_THEME', 'light');
    expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', expect.objectContaining({
      ComponentName: 'select-theme'
    }));
    setItemSpy.mockRestore();
  });

  it('save button calls dismissPopup', () => {
    renderWithProviders(
      <ThemeChooser {...{ dismissPopup, closePopup: jest.fn(), data: null, settings: { title: '' } } as any} />,
      { preloadedState: { theme: 'light' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /Save changes/i }));
    expect(dismissPopup).toHaveBeenCalled();
  });
});
