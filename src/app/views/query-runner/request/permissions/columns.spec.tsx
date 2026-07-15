import React from 'react';
import { render } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

jest.mock('../../../../../store', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => ({})
}));
jest.mock('../../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logOut: jest.fn(),
    getAccount: jest.fn(),
    getSessionId: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn(),
    refreshToken: jest.fn()
  }
}));

const mockTrackLinkClickEvent = jest.fn();
jest.mock('../../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackTabClickEvent: jest.fn(),
    trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: mockTrackLinkClickEvent,
    trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: { CONSENT_TYPE_DOC_LINK: 'consent-type', ADMIN_CONSENT_DOC_LINK: 'admin-consent' },
  eventTypes: {},
  errorTypes: {}
}));
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../../services/graph-constants', () => ({
  ADMIN_CONSENT_DOC_LINK: 'https://docs.microsoft.com/admin-consent',
  CONSENT_TYPE_DOC_LINK: 'https://docs.microsoft.com/consent-type',
  REVOKING_PERMISSIONS_REQUIRED_SCOPES: ''
}));
jest.mock('./PermissionItem', () => {
  const MockPermissionItem = (props: any) => (
    <div data-testid={`permission-item-${props.column.key}`}>
      {props.column.key}:{props.index}
    </div>
  );
  MockPermissionItem.displayName = 'MockPermissionItem';
  return { __esModule: true, default: MockPermissionItem };
});

import { getColumns } from './columns';

// Helper to call getColumns within a React render context (needed for makeStyles)
function callGetColumnsInContext(props: { source: 'panel' | 'tab'; tokenPresent: boolean }) {
  let result: ReturnType<typeof getColumns> = [];
  const TestComponent = () => {
    result = getColumns(props);
    return null;
  };
  render(
    <FluentProvider theme={webLightTheme}>
      <TestComponent />
    </FluentProvider>
  );
  return result;
}

describe('getColumns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns columns for panel source without token', () => {
    const columns = callGetColumnsInContext({ source: 'panel', tokenPresent: false });

    const columnIds = columns.map(c => c.columnId);
    expect(columnIds).toContain('value');
    expect(columnIds).toContain('isAdmin');
    expect(columnIds).not.toContain('consentDescription');
    expect(columnIds).not.toContain('consented');
    expect(columnIds).not.toContain('consentType');
  });

  it('returns columns with description for tab source', () => {
    const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: false });

    const columnIds = columns.map(c => c.columnId);
    expect(columnIds).toContain('value');
    expect(columnIds).toContain('consentDescription');
    expect(columnIds).toContain('isAdmin');
    expect(columnIds).not.toContain('consented');
  });

  it('returns additional columns when tokenPresent', () => {
    const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });

    const columnIds = columns.map(c => c.columnId);
    expect(columnIds).toContain('value');
    expect(columnIds).toContain('consentDescription');
    expect(columnIds).toContain('isAdmin');
    expect(columnIds).toContain('consented');
    expect(columnIds).toContain('consentType');
  });

  it('panel without token returns exactly value and isAdmin in order', () => {
    const columns = callGetColumnsInContext({ source: 'panel', tokenPresent: false });
    const columnIds = columns.map(c => c.columnId);
    expect(columnIds).toEqual(['value', 'isAdmin']);
  });

  it('tab with token returns columns in correct order', () => {
    const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
    const columnIds = columns.map(c => c.columnId);
    expect(columnIds).toEqual(['value', 'consentDescription', 'isAdmin', 'consented', 'consentType']);
  });

  it('tab without token returns columns in correct order', () => {
    const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: false });
    const columnIds = columns.map(c => c.columnId);
    expect(columnIds).toEqual(['value', 'consentDescription', 'isAdmin']);
  });

  describe('renderHeaderCell', () => {
    it('value column renders "Permission" header', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const valueCol = columns.find(c => c.columnId === 'value')!;
      const header = valueCol.renderHeaderCell();
      expect(header).toBe('Permission');
    });

    it('consentDescription column renders "Description" header', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const descCol = columns.find(c => c.columnId === 'consentDescription')!;
      const header = descCol.renderHeaderCell();
      expect(header).toBe('Description');
    });

    it('isAdmin column renders header with tooltip and info button', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const isAdminCol = columns.find(c => c.columnId === 'isAdmin')!;
      const headerElement = isAdminCol.renderHeaderCell() as JSX.Element;
      expect(headerElement).toBeDefined();
      expect(headerElement.props).toBeDefined();

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {headerElement}
        </FluentProvider>
      );
      expect(container.textContent).toContain('Admin consent required');
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('consented column renders "Status" header', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const consentedCol = columns.find(c => c.columnId === 'consented')!;
      const header = consentedCol.renderHeaderCell();
      expect(header).toBe('Status');
    });

    it('consentType column renders header with tooltip and info button', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const consentTypeCol = columns.find(c => c.columnId === 'consentType')!;
      const headerElement = consentTypeCol.renderHeaderCell() as JSX.Element;

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {headerElement}
        </FluentProvider>
      );
      expect(container.textContent).toContain('Consent type');
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
    });
  });

  describe('renderCell', () => {
    const mockPermission = {
      value: 'User.Read',
      consentDescription: 'Read user profile',
      isAdmin: false,
      consented: true,
      consentType: 'Principal'
    };

    it('value column renders PermissionItem with correct props', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const valueCol = columns.find(c => c.columnId === 'value')!;
      const cellElement = valueCol.renderCell({ item: mockPermission as any, index: 0 });

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {cellElement as JSX.Element}
        </FluentProvider>
      );
      expect(container.querySelector('[data-testid="permission-item-value"]')).toBeTruthy();
    });

    it('consentDescription column renders PermissionItem', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const descCol = columns.find(c => c.columnId === 'consentDescription')!;
      const cellElement = descCol.renderCell({ item: mockPermission as any, index: 1 });

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {cellElement as JSX.Element}
        </FluentProvider>
      );
      expect(container.querySelector('[data-testid="permission-item-consentDescription"]')).toBeTruthy();
    });

    it('isAdmin column renders PermissionItem', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const isAdminCol = columns.find(c => c.columnId === 'isAdmin')!;
      const cellElement = isAdminCol.renderCell({ item: mockPermission as any, index: 2 });

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {cellElement as JSX.Element}
        </FluentProvider>
      );
      expect(container.querySelector('[data-testid="permission-item-isAdmin"]')).toBeTruthy();
    });

    it('consented column renders PermissionItem', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const consentedCol = columns.find(c => c.columnId === 'consented')!;
      const cellElement = consentedCol.renderCell({ item: mockPermission as any, index: 3 });

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {cellElement as JSX.Element}
        </FluentProvider>
      );
      expect(container.querySelector('[data-testid="permission-item-consented"]')).toBeTruthy();
    });

    it('consentType column renders PermissionItem', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const consentTypeCol = columns.find(c => c.columnId === 'consentType')!;
      const cellElement = consentTypeCol.renderCell({ item: mockPermission as any, index: 4 });

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {cellElement as JSX.Element}
        </FluentProvider>
      );
      expect(container.querySelector('[data-testid="permission-item-consentType"]')).toBeTruthy();
    });
  });

  describe('openExternalWebsite via header button click', () => {
    let openSpy: jest.SpyInstance;

    beforeEach(() => {
      openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    });

    afterEach(() => {
      openSpy.mockRestore();
    });

    it('clicking Admin consent required button opens admin consent doc link', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const isAdminCol = columns.find(c => c.columnId === 'isAdmin')!;
      const headerElement = isAdminCol.renderHeaderCell() as JSX.Element;

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {headerElement}
        </FluentProvider>
      );
      const button = container.querySelector('button')!;
      button.click();

      expect(openSpy).toHaveBeenCalledWith('https://docs.microsoft.com/admin-consent', '_blank');
      expect(mockTrackLinkClickEvent).toHaveBeenCalledWith(
        'https://docs.microsoft.com/admin-consent',
        'admin-consent'
      );
    });

    it('clicking Consent type button opens consent type doc link', () => {
      const columns = callGetColumnsInContext({ source: 'tab', tokenPresent: true });
      const consentTypeCol = columns.find(c => c.columnId === 'consentType')!;
      const headerElement = consentTypeCol.renderHeaderCell() as JSX.Element;

      const { container } = render(
        <FluentProvider theme={webLightTheme}>
          {headerElement}
        </FluentProvider>
      );
      const button = container.querySelector('button')!;
      button.click();

      expect(openSpy).toHaveBeenCalledWith('https://docs.microsoft.com/consent-type', '_blank');
      expect(mockTrackLinkClickEvent).toHaveBeenCalledWith(
        'https://docs.microsoft.com/consent-type',
        'consent-type'
      );
    });
  });
});
