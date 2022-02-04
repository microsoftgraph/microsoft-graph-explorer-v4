import React from 'react';
import { cleanup, render } from '@testing-library/react';
import TabList from '../../../app/views/query-runner/request/permissions/TabList';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';

afterEach(cleanup);
const renderTabList = () => {
  const tabProps  = {
    columns: [
      {
        key: 'value',
        name: 'messages.Permission',
        fieldName: 'value',
        minWidth: 200,
        maxWidth: 250,
        isResizable: true,
        columnActionsMode: 0
      },
      {
        key: 'isAdmin',
        isResizable: true,
        name: 'Admin consent required',
        fieldName: 'isAdmin',
        minWidth:  200,
        maxWidth:  300,
        ariaLabel: 'Administrator permission',
        columnActionsMode: 0
      }
    ],
    classes: '',
    renderItemColumn: jest.fn(),
    renderDetailsHeader: jest.fn(),
    maxHeight: '100'
  }

  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <TabList {...tabProps} />
    </IntlProvider>
  )
}

jest.mock('react-redux', () => {
  return{
    useSelector: jest.fn(() => {
      return({
        consentedScopes: ['profile.read', 'profile.write', 'mail.read', 'mail.write'],
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
          ]
        },
        authToken: {
          pending: false,
          token: true
        }
      })
    }),
    useDispatch: jest.fn()
  }
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Renders permissions tab', () => {
  it('Renders Modify Permissions Tab without crasing', () => {
    const { getByText } = renderTabList();
    getByText(/Permissions for the query are missing on this tab/)
  })
})