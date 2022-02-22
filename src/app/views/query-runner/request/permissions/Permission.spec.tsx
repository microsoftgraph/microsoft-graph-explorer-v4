import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { Permission } from '.';
import { geLocale } from '../../../../../appLocale';
import messages from '../../../../../messages';
import { store } from '../../../../../store';
import { IPermissionProps, IPermissionState } from '../../../../../types/permissions';

afterEach(cleanup);

interface IExtendedPermissions extends IPermissionProps {
  intl: object;
}
const renderPermission = (args?: any) => {
  const permissionProps: IExtendedPermissions = {
    dimensions: {
      request: {
        width: '60',
        height: '60'
      },
      response: {
        width: '60',
        height: '60'
      }
    },
    scopes: {
      pending: false,
      data: [
        {
          value: 'profile.read',
          isAdmin: false,
          consentDescription: 'Read your profile',
          consented: true
        },
        {
          value: 'profile.write',
          isAdmin: false,
          consentDescription: 'Write your profile',
          consented: true
        }
      ],
      hasUrl: true,
      error: null
    },
    panel: args?.panel || false,
    sample: [
      {
        selectedVerb: 'GET',
        selectedVersion: 'v1.0',
        sampleUrl: 'https://graph.microsoft.com/v1.0/me',
        sampleHeaders: []
      }
    ],
    tokenPresent: true,
    permissionsPanelOpen: args?.permissionsPanelOpen || false,
    consentedScopes: ['profile.read', 'profile.write', 'mail.read', 'mail.write'],
    setPermissions: jest.fn(),
    ...args,
    intl: { messages },
    actions: {
      fetchScopes: jest.fn(),
      consentToScopes: jest.fn()
    }
  }

  const permissionState: IPermissionState = {
    permissions: [
      {
        value: 'profile.read',
        isAdmin: false,
        consentDescription: 'Read your profile',
        consented: true
      },
      {
        value: 'profile.write',
        isAdmin: false,
        consentDescription: 'Write your profile',
        consented: true
      }
    ]
  }

  const allProps = { ...permissionProps, ...permissionState };
  const appStore: any = store;

  return render(
    <Provider store={appStore}>
      <IntlProvider
        locale={geLocale}
        messages={(messages as { [key: string]: object })[geLocale]}
      >
        <Permission {...allProps} />
      </IntlProvider>
    </Provider>
  )
}
//  <Permission {...allProps}/>
jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}))

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