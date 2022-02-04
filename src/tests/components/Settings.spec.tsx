import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import Settings from '../../app/views/settings/Settings';
import { ISettingsProps } from '../../types/settings';
import { messages_ } from '../utils/get-messages';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../appLocale';
import userEvent from '@testing-library/user-event'
import { useSelector } from 'react-redux';

afterEach(cleanup);
const renderSettings = (args? : any) => {
  const messages = (messages_ as { [key: string]: object })['en-US'];
  const settingsProps: ISettingsProps = {
    actions: {
      signOut: jest.fn(),
      changeTheme: jest.fn(),
      consentToScopes: jest.fn()
    },
    intl: {
      message: messages
    }
  }

  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <Settings {...settingsProps} {...args} />
    </IntlProvider>
  )
}

jest.mock('react-redux', () => {
  return{
    useDispatch: jest.fn(),
    useSelector: jest.fn( () => {
      return(
        {
          permissionsPanelOpen: false,
          authToken: {
            pending: false,
            token: true
          },
          theme: 'dark'
        }
      )
    })
  }
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

jest.mock('../../app/views/query-runner/request/permissions/Permission.tsx', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: () => {
      return <div>Permissions</div>;
    }
  }
})

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}))

describe('Tests Settings component', () => {
  describe('Tests settings button', () => {
    it('Renders Settings component without crashing', () => {
      renderSettings();
      screen.debug();
      const settingsButton = screen.getByRole('button');
      userEvent.click(settingsButton);
      screen.debug();
    })
  });

  describe('Opens permissions panel', () => {
    it('Opens permissions panel', () => {
      renderSettings();
      screen.debug();
    })
  })

})