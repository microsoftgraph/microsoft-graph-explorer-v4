import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Profile from '../../app/views/authentication/profile/Profile';
import { Mode } from '../../types/enums';
afterEach(cleanup);
const renderProfile = () => {
  return render(<Profile />);
}

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn( () => {
    return(
      {
        sidebarProperties: {
          mobileScreen: false,
          showSidebar: true
        },
        profile: {
          ageGroup: 0,
          displayName: 'Megan Bowen',
          emailAddress: 'megan. Bowen@microsoft.com',
          profileImageUrl: 'https://www.microsoft.com',
          profileType: 'AAD'
        },
        authToken: {
          token: ''
        },
        graphExplorerMode: Mode.Complete
      }
    )
  })
}))

describe('Tests Profile.tsx', () => {
  it('Renders Profile.tsx', () => {
    const { getByText } = renderProfile();
    getByText('Megan Bowen');
  });
})