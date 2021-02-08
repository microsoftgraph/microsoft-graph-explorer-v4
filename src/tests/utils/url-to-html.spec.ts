import { linkExists, extractUrl, createLinkFromUrl, replaceLinks } from "../../app/utils/status.util";

describe('url should', () => {

  it(`not exist in string`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here';
    const exists = linkExists(message);
    expect(exists).toBe(false);
  });

  it(`exist in string`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const exists = linkExists(message);
    expect(exists).toBe(true);
  });

  it(`should extract urls from string`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const url = extractUrl(message);
    expect(url).toEqual(["https://aka.ms/appTemplateAPISurvey"]);
  });

  it(`should create a link`, () => {
    const url = 'https://aka.ms/appTemplateAPISurvey';
    const link = createLinkFromUrl(url);
    expect(link).toEqual(`<a href="${url}">${url}</a>`);
  });

  it(`should replace urls with links`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const replaced = replaceLinks(message);
    expect(replaced).toBe("We’d like to hear from you. Please leave your feedback on this API here: <a href=\"https://aka.ms/appTemplateAPISurvey\">https://aka.ms/appTemplateAPISurvey</a>");
  });
})
