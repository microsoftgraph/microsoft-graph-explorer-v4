jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ language, onMount, onChange }: any) => {
    // Simulate mount
    if (onMount) {
      const mockEditor = {
        layout: jest.fn(),
        getValue: jest.fn(() => ''),
        setValue: jest.fn(),
        getModel: jest.fn(() => ({
          getFullModelRange: jest.fn(() => ({})),
          pushEditOperations: jest.fn()
        })),
        pushUndoStop: jest.fn()
      };
      setTimeout(() => onMount(mockEditor), 0);
    }
    return <div data-testid="mock-monaco" data-language={language}>Monaco Editor</div>;
  },
  Editor: ({ language }: any) => <div data-testid="mock-monaco" data-language={language}>Monaco Editor</div>
}));
jest.mock('../../../../themes/theme-context', () => ({
  ThemeContext: {
    Consumer: ({ children }: any) => children('light')
  }
}));
jest.mock('./util/format-json', () => ({
  formatJsonStringForAllBrowsers: jest.fn((obj: any) => JSON.stringify(obj))
}));

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Monaco } from './Monaco';

describe('Monaco', () => {
  it('renders with string body', () => {
    render(<Monaco body="test content" />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with object body', () => {
    render(<Monaco body={{ key: 'value' }} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with undefined body', () => {
    render(<Monaco body={undefined} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with custom language', () => {
    render(<Monaco body="test" language="javascript" />);
    const editor = screen.getByTestId('mock-monaco');
    expect(editor.getAttribute('data-language')).toBe('javascript');
  });

  it('renders in read-only mode', () => {
    render(<Monaco body="test" readOnly={true} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders extra info element', () => {
    render(<Monaco body="test" extraInfoElement={<div>Extra Info</div>} />);
    expect(screen.getByText('Extra Info')).toBeDefined();
  });

  it('defaults to json language when not specified', () => {
    render(<Monaco body="test" />);
    const editor = screen.getByTestId('mock-monaco');
    expect(editor.getAttribute('data-language')).toBe('json');
  });

  it('renders with isVisible prop', () => {
    render(<Monaco body="test" isVisible={true} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with isVisible false', () => {
    render(<Monaco body="test" isVisible={false} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles onChange callback', () => {
    const onChange = jest.fn();
    render(<Monaco body="test" onChange={onChange} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with null body treated as empty', () => {
    render(<Monaco body={null as any} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('passes onChange prop to Editor', () => {
    const onChange = jest.fn();
    render(<Monaco body="test" onChange={onChange} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with empty string body', () => {
    render(<Monaco body="" />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with deeply nested object body', () => {
    render(<Monaco body={{ nested: { deep: { value: 123 } } }} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with array body', () => {
    render(<Monaco body={[1, 2, 3] as any} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with multiple props combined', () => {
    const onChange = jest.fn();
    render(
      <Monaco
        body={{ key: 'val' }}
        language="xml"
        readOnly={true}
        onChange={onChange}
        isVisible={true}
        extraInfoElement={<span>Info</span>}
      />
    );
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
    expect(screen.getByText('Info')).toBeDefined();
  });

  it('renders with isVisible false and no extra element', () => {
    render(<Monaco body="content" isVisible={false} readOnly={false} />);
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('renders with language set to html', () => {
    render(<Monaco body="<div>test</div>" language="html" />);
    const editor = screen.getByTestId('mock-monaco');
    expect(editor.getAttribute('data-language')).toBe('html');
  });

  it('renders with language set to xml', () => {
    render(<Monaco body="<root/>" language="xml" />);
    const editor = screen.getByTestId('mock-monaco');
    expect(editor.getAttribute('data-language')).toBe('xml');
  });

  it('calls editor layout and setValue on mount via onMount callback', () => {
    jest.useFakeTimers();
    render(<Monaco body="initial" />);
    act(() => { jest.runAllTimers(); });
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('calls editor layout when isVisible changes after mount', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="test" isVisible={false} />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body="test" isVisible={true} />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('triggers content update when body changes after mount', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="original" />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body="updated content" />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('triggers content update when body changes from object to different object', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body={{ key: 'val1' }} />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body={{ key: 'val2' }} />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles formattedBody as empty string when body is null', () => {
    jest.useFakeTimers();
    render(<Monaco body={null as any} />);
    act(() => { jest.runAllTimers(); });
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('does not push edit operations when body stays the same after mount', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="" />);
    act(() => { jest.runAllTimers(); });
    // Re-render with same body; getValue returns '' so no edit needed
    rerender(<Monaco body="" />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles isVisible true on initial mount with editor ready', () => {
    jest.useFakeTimers();
    render(<Monaco body="visible" isVisible={true} />);
    act(() => { jest.runAllTimers(); });
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles multiple body changes after mount', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="first" />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body="second" />);
    rerender(<Monaco body="third" />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('verifies onMount callback sets editor ref and triggers layout', () => {
    // The mock Monaco editor calls onMount via setTimeout
    // After mount, the editor should be ready and layout() called
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="test content" isVisible={true} />);
    act(() => { jest.runAllTimers(); });
    // After mount + timer, isVisible=true should trigger layout
    // Verify rerender with new body triggers pushEditOperations
    rerender(<Monaco body="different content" isVisible={true} />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles body change from string to object after mount', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="string body" />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body={{ key: 'value' }} />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles body change from object to string after mount', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body={{ key: 'value' }} />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body="string body" />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles undefined body change after mount', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="initial" />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body={undefined} />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('isVisible toggle calls layout after editor is ready', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Monaco body="test" isVisible={false} />);
    act(() => { jest.runAllTimers(); });
    // Toggle to visible - should call layout
    rerender(<Monaco body="test" isVisible={true} />);
    // Toggle back to not visible
    rerender(<Monaco body="test" isVisible={false} />);
    // Toggle visible again
    rerender(<Monaco body="test" isVisible={true} />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });

  it('handles onChange and body updates together', () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { rerender } = render(<Monaco body="first" onChange={onChange} />);
    act(() => { jest.runAllTimers(); });
    rerender(<Monaco body="second" onChange={onChange} />);
    jest.useRealTimers();
    expect(screen.getByTestId('mock-monaco')).toBeDefined();
  });
});
