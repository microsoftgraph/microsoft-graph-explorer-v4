import { ValidatedUrl } from './abnf';

const validator = new ValidatedUrl();

describe('Abnf parser should', () => {
  it('pass', () => {
    const graphUrl = 'https://graph.microsoft.com/beta/groups';
    const result = validator.validate(graphUrl);
    expect(result.success).toBe(true);
  });

  it('fail', () => {
    const graphUrl = 'https://graph.microsoft.com/v1.0/me/drive /root:/Test%20Folder';
    const result = validator.validate(graphUrl);
    expect(result.success).toBe(false);
  });
});