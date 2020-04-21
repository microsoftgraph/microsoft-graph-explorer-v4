import { getTheme, Label, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as autoCompleteActionCreators from '../../../services/actions/autocomplete-action-creators';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { queryInputStyles } from './QueryInput.styles';

export interface IAutoCompleteProps {
  suggestions: string[];
  suggestionSelected: Function;
  contentChanged: Function;
  sampleUrl: string;
  autoCompleteOptions: {
    url: string;
    parameters: any[],
    verb: string;
  };
  actions?: {
    fetchAutoCompleteOptions: Function;
  };
}

class AutoComplete extends Component<IAutoCompleteProps, any> {

  constructor(props: IAutoCompleteProps) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: this.props.sampleUrl
    };
  }

  public onChange = (e: any) => {
    const userInput = e.target.value;

    this.setState({
      activeSuggestion: 0,
      showSuggestions: false,
      userInput
    });
    this.initialiseAutoComplete(userInput);
    this.props.contentChanged(userInput);
  };

  public onClick = (e: any) => {
    const { userInput } = this.state;
    const selected =  e.currentTarget.innerText;
    this.appendSuggestionToUrl(selected);

    this.props.suggestionSelected(userInput);
  };

  private initialiseAutoComplete = (url: string) => {
    const lastCharacter = url.substring(url.length - 1);
    if (lastCharacter === '?') {
      const { requestUrl } = parseSampleUrl(url);
      if (requestUrl) {
        if (requestUrl !== this.props.autoCompleteOptions.url) {
          this.props.actions!.fetchAutoCompleteOptions(requestUrl);
        }
      }
    }

    if (lastCharacter === '=' || lastCharacter === ',') {
      const str = this.state.userInput;
      const param = str.split('$').pop().split('=')[0];
      const { parameters } = this.props.autoCompleteOptions;
      const section = parameters.find(k => k.name === `$${param}`);
      const list: string[] = [];
      section.items.forEach((element: string) => {
        list.push(element);
      });
      this.setState({
        filteredSuggestions: list,
        showSuggestions: true
      });
    }
  }

  public onKeyDown = (e: any) => {
    const { activeSuggestion, filteredSuggestions, userInput } = this.state;

    // selecting the suggestion is done by hitting tab
    if (e.keyCode === 9) {
      const selected = filteredSuggestions[activeSuggestion];
      this.appendSuggestionToUrl(selected);
      this.props.suggestionSelected(userInput);
    }

    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }

    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }

  };

  public generateSuggestions = () => {
    const lastCharacter = this.state.userInput.substring(this.state.userInput.length - 1);
    const { parameters } = this.props.autoCompleteOptions;
    const suggestions: string[] = [];
    if (parameters && lastCharacter === '?') {
      parameters.forEach((element: any) => {
        suggestions.push(element.name);
      });
    }

    this.setState({
      filteredSuggestions: suggestions,
      showSuggestions: true
    });
  }

  public componentDidUpdate = (prevProps: IAutoCompleteProps) => {
    if (prevProps.autoCompleteOptions !== this.props.autoCompleteOptions) {
      this.generateSuggestions();
    }
  }

  private appendSuggestionToUrl(selected: string) {
    const { userInput } = this.state;
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: `${userInput + selected}`
    });
  }

  public render() {
    const {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions,
      userInput
    } = this.state;

    const currentTheme = getTheme();
    const suggestionClass: any = queryInputStyles(currentTheme).autoComplete.suggestions;
    const suggestionOption: any = queryInputStyles(currentTheme).autoComplete.suggestionOption;
    const activeSuggestionClass: any = queryInputStyles(currentTheme).autoComplete.suggestionActive;
    const autoInput: any = queryInputStyles(currentTheme).autoComplete.input;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul style={suggestionClass} aria-haspopup='true'>
            {filteredSuggestions.map((suggestion: {} | null | undefined, index: any) => {
              return (
                <li
                  style={(index === activeSuggestion) ? activeSuggestionClass : suggestionOption}
                  key={index}
                  onClick={this.onClick}
                >
                  <Label>
                    {suggestion}
                  </Label>
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className='no-suggestions'>
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return (
      <>
        <TextField
          className={autoInput}
          type='text'
          autoComplete='off'
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          defaultValue={userInput}
          value={userInput}
        />
        {suggestionsListComponent}
      </>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleUrl: state.sampleQuery.sampleUrl,
    autoCompleteOptions: state.autoComplete.data
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      {
        ...autoCompleteActionCreators,
      },
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoComplete);