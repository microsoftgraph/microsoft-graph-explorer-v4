jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../../services/hooks', () => ({
  usePopups: jest.fn(() => ({ show: jest.fn() }))
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareButton from './ShareButton';
import { usePopups } from '../../../../services/hooks';

describe('ShareButton', () => {
  const mockShow = jest.fn();

  beforeEach(() => {
    (usePopups as jest.Mock).mockReturnValue({ show: mockShow });
    jest.clearAllMocks();
  });

  it('renders share button', () => {
    render(<ShareButton />);
    expect(screen.getByLabelText('Share Query')).toBeDefined();
  });

  it('calls show on click', () => {
    render(<ShareButton />);
    fireEvent.click(screen.getByLabelText('Share Query'));
    expect(mockShow).toHaveBeenCalled();
  });
});
