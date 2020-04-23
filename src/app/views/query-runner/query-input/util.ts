export function cleanUpSelectedSuggestion(compare: string, userInput: string, selected: string) {
    let finalSelectedSuggestion = `${userInput + selected}`;
    if (compare) {
    /**
     * Removes the characters used to filter the suggestions
     * and replaces them with the provided suggestion
     * together with the sign that was in the query string before
     * autosuggestion
     */
      const availableSignPrefixes = ['?', ',', '=', '&'];
      let entryToRemove = '';
      let activeSign = '?';
      availableSignPrefixes.forEach(sign => {
        const compareStringWithSign = `${sign + compare}`;
        if (userInput.includes(compareStringWithSign)) {
          entryToRemove = compareStringWithSign;
          activeSign = sign;
        }
      });
      finalSelectedSuggestion = userInput.replace(entryToRemove, activeSign);
      return finalSelectedSuggestion + selected;
    }
    return finalSelectedSuggestion;
  }