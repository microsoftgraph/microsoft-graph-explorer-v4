import { cleanUpSelectedSuggestion } from '../../app/views/query-runner/query-input/util';


describe('Query input util should', () => {

  it('cleanup selected suggestion', async () => {
    const compareString = 'sel';
    const userInput = 'https://graph.microsoft.com/v1.0/me/messages?sel';
    const selected = '$select';
    const selectedSuggestion = cleanUpSelectedSuggestion(compareString, userInput, selected);

    expect(selectedSuggestion).toEqual('https://graph.microsoft.com/v1.0/me/messages?$select');
  });

});


