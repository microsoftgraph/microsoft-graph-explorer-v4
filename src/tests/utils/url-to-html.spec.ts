import { extractUrl, replaceLinks, convertArrayToObject, getMatchesAndParts } from '../../app/utils/status-message';

describe('status message should', () => {

  it(`extract urls from string`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const url = extractUrl(message);
    expect(url).toEqual(["https://aka.ms/appTemplateAPISurvey"]);
  });

  it(`replace urls with placeholders`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const replaced = replaceLinks(message);
    expect(replaced).toBe("We’d like to hear from you. Please leave your feedback on this API here: $0");
  });

  it(`convert urls array to object`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const urls = extractUrl(message);
    const objectUrls = convertArrayToObject(urls!);
    const expected = { $0: "https://aka.ms/appTemplateAPISurvey" };
    expect(objectUrls).toEqual(expected);
  });

  it(`get message match through regex`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const { matches } = getMatchesAndParts(replaceLinks(message));
    expect(matches?.length).toBe(1);
  });

  it(`get message parts through regex`, () => {
    const message = 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey';
    const { parts } = getMatchesAndParts(replaceLinks(message));
    expect(parts.length).toEqual(3);
  });

  it(`have extracted matches include $0`, () => {
    const message = "This query requires a team id and a channel id from that team. To find the team id  & channel id, you can run: 1) GET https://graph.microsoft.com/beta/me/joinedTeams 2) GET https://graph.microsoft.com/beta/teams/{team-id}/channels";
    const { matches } = getMatchesAndParts(replaceLinks(message));
    expect(matches?.includes("$0")).toBe(true);
  });
})
