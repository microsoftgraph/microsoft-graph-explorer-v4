import { isValidHttpsUrl } from "../../app/utils/external-link-validation";

describe('External link', () => {
  const links = [
    {
      url: 'data:,%20{%22sampleQueries%22:[{%22id%22:%22%22,%22category%22:%22TEST%20%22,%22method%22:%22GET%22,%22humanName%22:%22CLICK%20HERE%20-%20%3E%22,%22requestUrl%22:%22/v1.0/me/%22,%22docLink%20%22:%22javascript:alert(document.domain)%22,%22headers%22:null,%22tip%22:null,%20%22postBody%22:null,%22skipTest%22:false}]}%23',
      result: false
    },
    {
      url: 'https://aka.ms/appTemplateAPISurvey',
      result: true
    }
  ];

  links.forEach(link => {
    it(`url should return ${link.result}`, () => {
      const isValid = isValidHttpsUrl(link.url);
      expect(isValid).toEqual(link.result);
    });
  });
});
