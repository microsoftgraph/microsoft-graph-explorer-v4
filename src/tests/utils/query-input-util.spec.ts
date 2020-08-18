import { cleanUpSelectedSuggestion } from '../../app/views/query-runner/query-input/util';


describe('Query input util should', () => {

  it('cleanup selected suggestion', async () => {
    const compareString = 'sel';
    const userInput = 'https://graph.microsoft.com/v1.0/me/messages?sel';
    const selected = '$select';
    const selectedSuggestion = cleanUpSelectedSuggestion(compareString, userInput, selected);

    expect(selectedSuggestion).toEqual('https://graph.microsoft.com/v1.0/me/messages?$select');
  });

  it('replace only last occurrence of compare string', async () => {
    const compareString = 'su';
    const userInput = 'https://graph.microsoft.com/v1.0/me/messages?$select=id,subject&orderby=su';
    const selected = 'subject desc';
    const selectedSuggestion = cleanUpSelectedSuggestion(compareString, userInput, selected);

    expect(selectedSuggestion)
      .toEqual('https://graph.microsoft.com/v1.0/me/messages?$select=id,subject&orderby=subject desc');
  });

});


