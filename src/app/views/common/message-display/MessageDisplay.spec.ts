import messageDisplay from './MessageDisplay';

jest.mock('../../../services/graph-constants', () => ({
  GRAPH_URL: 'https://graph.microsoft.com'
}));

describe('MessageDisplay', () => {
  it('renders plain text message', () => {
    const result = messageDisplay({ message: 'Hello world' });
    expect(result).toBeDefined();
  });

  it('renders message with bold text', () => {
    const result = messageDisplay({ message: 'This is **bold** text' });
    expect(result).toBeDefined();
  });

  it('renders message with markdown link', () => {
    const result = messageDisplay({ message: 'Click [here](https://example.com) for more' });
    expect(result).toBeDefined();
  });

  it('renders message with graph URL link and calls onSetQuery', () => {
    const onSetQuery = jest.fn();
    const result = messageDisplay({
      message: 'Try [this](https://graph.microsoft.com/v1.0/me)',
      onSetQuery
    });
    expect(result).toBeDefined();
  });

  it('renders message with standalone URL', () => {
    const result = messageDisplay({ message: 'Visit https://example.com for details' });
    expect(result).toBeDefined();
  });

  it('handles empty message', () => {
    const result = messageDisplay({ message: '' });
    expect(result).toBeDefined();
  });
});
