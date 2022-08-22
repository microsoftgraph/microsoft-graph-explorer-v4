import { ValidatedUrl } from './abnf';

const validator = new ValidatedUrl();

describe('Abnf parser should', () => {
  const urls = [
    { url: 'https://graph.microsoft.com/v1.0/me', isValid: true },
    {
      url:
        // eslint-disable-next-line max-len
        'https://graph.microsoft.com/v1.0/me/contacts?$filter=emailAddresses/any(a:a/address eq \'Alex@FineArtSchool.net\')',
      isValid: true
    }
  ];
  urls.forEach((url, key) => {
    const rules = [
      'odataUri',
      'keyPathLiteral',
      'namespacePart',
      'firstMemberExpr'
    ];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    it(`validate the url: ${url.url} to be ${url.isValid} `, () => {
      const validation = validator.validate(url.url, rules);
      expect(validation[key].success).toBe(url.isValid);
    });
  });

});