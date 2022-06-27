import { isJsonString } from './sample-query-utils';

describe('Tests isJsonString should', () => {
  it('return true for valid JSON strings', () => {
    expect(isJsonString('{"foo": "bar"}')).toBe(true);
  });

  it('return false for invalid JSON strings', () => {
    expect(isJsonString('{"foo": "bar"')).toBe(false);
  })
})