jest.mock('../../../store', () => ({
  useAppSelector: jest.fn()
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LayoutResizeHandler } from './LayoutResizeHandler';
import { useAppSelector } from '../../../store';

// Mock FluentUI
jest.mock('@fluentui/react-components', () => ({
  makeResetStyles: () => () => 'hover-class',
  tokens: { colorBrandBackgroundHover: '#blue' },
  useFluent: () => ({ dir: 'ltr' })
}));

describe('LayoutResizeHandler', () => {
  beforeEach(() => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((fn: any) =>
      fn({ sidebarProperties: { mobileScreen: false } })
    );
  });

  it('renders handle for start position in ltr', () => {
    const { container } = render(
      <LayoutResizeHandler position="start" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toBeDefined();
    expect(div.style.cursor).toBe('col-resize');
  });

  it('renders handle for end position', () => {
    const { container } = render(
      <LayoutResizeHandler position="end" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.cursor).toBe('col-resize');
  });

  it('renders handle for top position', () => {
    const { container } = render(
      <LayoutResizeHandler position="top" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.cursor).toBe('row-resize');
  });

  it('renders handle for bottom position', () => {
    const { container } = render(
      <LayoutResizeHandler position="bottom" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.cursor).toBe('row-resize');
  });

  it('returns null on mobile screen', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((fn: any) =>
      fn({ sidebarProperties: { mobileScreen: true } })
    );
    const { container } = render(
      <LayoutResizeHandler position="start" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls onDoubleClick on double click', () => {
    const mockDoubleClick = jest.fn();
    const { container } = render(
      <LayoutResizeHandler position="start" onDoubleClick={mockDoubleClick} />
    );
    const div = container.firstChild as HTMLElement;
    fireEvent.click(div, { detail: 2 });
    expect(mockDoubleClick).toHaveBeenCalled();
  });

  it('does not call onDoubleClick on single click', () => {
    const mockDoubleClick = jest.fn();
    const { container } = render(
      <LayoutResizeHandler position="start" onDoubleClick={mockDoubleClick} />
    );
    const div = container.firstChild as HTMLElement;
    fireEvent.click(div, { detail: 1 });
    expect(mockDoubleClick).not.toHaveBeenCalled();
  });

  it('renders in rtl mode with start position', () => {
    jest.spyOn(require('@fluentui/react-components'), 'useFluent').mockReturnValue({ dir: 'rtl' });
    const { container } = render(
      <LayoutResizeHandler position="start" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toBeDefined();
  });

  it('calls onMouseDown when provided', () => {
    const mockMouseDown = jest.fn();
    const { container } = render(
      <LayoutResizeHandler position="start" onMouseDown={mockMouseDown} />
    );
    const div = container.firstChild as HTMLElement;
    fireEvent.mouseDown(div);
    expect(mockMouseDown).toHaveBeenCalled();
  });
});
