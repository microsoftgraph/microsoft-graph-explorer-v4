import { translateMessage } from './translate-messages';

describe('translateMessage', () => {
  it('should return the translated message for a known key', () => {
    const result = translateMessage('Downloading the file');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return the messageId if translation is not found', () => {
    const unknownKey = 'some_unknown_key_that_does_not_exist';
    const result = translateMessage(unknownKey);
    expect(result).toBe(unknownKey);
  });

  it('should return a string for any input', () => {
    const result = translateMessage('Tip');
    expect(typeof result).toBe('string');
  });
});
