import { extractUrl, replaceLinks, convertArrayToObject } from '../../app/utils/status-message';

describe('status message should', () => {

  it(`extract urls from string`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const url = extractUrl(message);
    expect(url).toEqual(['https://aka.ms/appTemplateAPISurvey']);
  });

  it(`replace urls with placeholders`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const replaced = replaceLinks(message);
    expect(replaced).toBe('We’d like to hear from you. Please leave your feedback on this API here: $0');
  });

  it(`convert urls array to object`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const urls = extractUrl(message);
    const objectUrls = convertArrayToObject(urls!);
    const expected = { $0: 'https://aka.ms/appTemplateAPISurvey' };
    expect(objectUrls).toEqual(expected);
  });

})
