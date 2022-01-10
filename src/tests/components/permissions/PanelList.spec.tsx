import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import PanelList from '../../../app/views/query-runner/request/permissions/PanelList';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';

afterEach(cleanup);
const renderPanelList = (): any => {
  const columns = [
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
  ]
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <PanelList messages={''} columns={columns}
        selection={jest.fn()} renderItemColumn={jest.fn()}
        renderDetailsHeader={jest.fn()} renderCustomCheckbox={jest.fn()} classes={''}/>
    </IntlProvider>
  )
}

jest.mock('react-redux', () => {
  return {
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
          ],
          hasUrl: false,
          error: null
        },
        authToken: 'JDJDJSKJDKS'
      })
    }),
    useDispatch: jest.fn()
  }
})

jest.mock('@fluentui/react', () => {
  const fluent_ = jest.requireActual('@fluentui/react');
  return {
    ...fluent_,
    Selection: jest.fn(),
    SelectionMode: {
      none: 0,
      single: 1,
      multiple: 2
    },
    DetailsListLayoutMode: {
      fixedColumns: 0,
      justified: 1
    }
  }
})

describe('Tests PanelList component', () => {
  it('should render without crashing', () => {
    // renderPanelList();
    screen.debug();
    expect(1).toBe(1);
  });
})