import { getAdaptiveCard } from './adaptive-cards.util';
import { IQuery } from '../../../../types/query-runner';

jest.mock('../../../utils/adaptive-cards-lookup', () => ({
  lookupTemplate: jest.fn()
}));

import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';

describe('adaptive-cards.util', () => {
  const sampleQuery: IQuery = {
    selectedVerb: 'GET',
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    sampleHeaders: [],
    selectedVersion: 'v1.0'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw when payload is empty', () => {
    expect(() => getAdaptiveCard('', sampleQuery)).toThrow('No adaptive card payload available');
  });

  it('should throw when payload is null', () => {
    expect(() => getAdaptiveCard(null as any, sampleQuery)).toThrow('No adaptive card payload available');
  });

  it('should return undefined when no template available', () => {
    (lookupTemplate as jest.Mock).mockReturnValue(null);
    const result = getAdaptiveCard('{"name":"test"}', sampleQuery);
    expect(result).toBeUndefined();
  });

  it('should throw for invalid JSON string', () => {
    (lookupTemplate as jest.Mock).mockReturnValue(null);
    expect(() => getAdaptiveCard('not-json', sampleQuery)).toThrow('Invalid or empty payload for card');
  });

  it('should throw for empty object payload', () => {
    (lookupTemplate as jest.Mock).mockReturnValue(null);
    expect(() => getAdaptiveCard({}, sampleQuery)).toThrow('Invalid or empty payload for card');
  });

  it('should handle object payload', () => {
    (lookupTemplate as jest.Mock).mockReturnValue(null);
    const result = getAdaptiveCard({ name: 'test' }, sampleQuery);
    expect(result).toBeUndefined();
  });

  it('should throw for invalid payload type', () => {
    (lookupTemplate as jest.Mock).mockReturnValue(null);
    expect(() => getAdaptiveCard(42 as any, sampleQuery)).toThrow('Invalid payload type for card');
  });

  it('should create card from template when template is available', () => {
    const mockTemplate = { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: '${name}' }] };
    (lookupTemplate as jest.Mock).mockReturnValue(mockTemplate);

    const result = getAdaptiveCard('{"name":"John"}', sampleQuery);

    expect(result).toBeDefined();
    expect(result!.template).toEqual(mockTemplate);
    expect(result!.card).toBeDefined();
  });

  it('should create card from object payload with template', () => {
    const mockTemplate = { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: '${name}' }] };
    (lookupTemplate as jest.Mock).mockReturnValue(mockTemplate);

    const result = getAdaptiveCard({ name: 'John' }, sampleQuery);

    expect(result).toBeDefined();
    expect(result!.template).toEqual(mockTemplate);
    expect(result!.card).toBeDefined();
  });

  it('should throw when template expansion fails', () => {
    // Return a template object that will cause createCardFromTemplate to throw during expansion
    const badTemplate = { get type() { throw new Error('broken template'); } };
    (lookupTemplate as jest.Mock).mockReturnValue(badTemplate);

    expect(() => getAdaptiveCard('{"name":"test"}', sampleQuery)).toThrow();
  });

  it('should return undefined when lookupTemplate returns a non-object falsy value', () => {
    (lookupTemplate as jest.Mock).mockReturnValue(undefined);
    const result = getAdaptiveCard('{"name":"test"}', sampleQuery);
    expect(result).toBeUndefined();
  });

  it('should return undefined when lookupTemplate returns 0', () => {
    (lookupTemplate as jest.Mock).mockReturnValue(0);
    const result = getAdaptiveCard('{"name":"test"}', sampleQuery);
    expect(result).toBeUndefined();
  });

  it('should return undefined when lookupTemplate returns a string', () => {
    (lookupTemplate as jest.Mock).mockReturnValue('some-string');
    const result = getAdaptiveCard('{"name":"test"}', sampleQuery);
    expect(result).toBeUndefined();
  });

  it('should handle valid JSON string payload with matching template', () => {
    const mockTemplate = { type: 'AdaptiveCard', version: '1.0', body: [] };
    (lookupTemplate as jest.Mock).mockReturnValue(mockTemplate);

    const result = getAdaptiveCard('{"displayName":"Test User","mail":"test@example.com"}', sampleQuery);

    expect(result).toBeDefined();
    expect(result!.card).toBeDefined();
    expect(result!.template).toBe(mockTemplate);
  });
});
