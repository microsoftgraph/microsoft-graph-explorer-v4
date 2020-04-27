import { getTheme, KeyCodes, Label, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAutoCompleteProps, IAutoCompleteState } from '../../../../types/auto-complete';
import * as autoCompleteActionCreators from '../../../services/actions/autocomplete-action-creators';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { queryInputStyles } from './QueryInput.styles';
import { cleanUpSelectedSuggestion } from './util';

class AutoComplete extends Component<IAutoCompleteProps, IAutoCompleteState> {

  constructor(props: IAutoCompleteProps) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      suggestions: [],
      showSuggestions: false,
      userInput: this.props.sampleQuery.sampleUrl,
      compare: ''
    };
  }

  public onChange = (e: any) => {
    const { suggestions, showSuggestions, userInput: previousUserInput, compare } = this.state;
    const userInput = e.target.value;

    this.props.contentChanged(userInput);

    this.setState({
      userInput
    });

    if (showSuggestions && suggestions.length) {
      this.filterSuggestions(userInput, previousUserInput, compare, suggestions);
    }
    this.initialiseAutoComplete(userInput);
  };

  public onClick = (e: any) => {
    const selected = e.currentTarget.innerText;
    this.appendSuggestionToUrl(selected);
  };

  private initialiseAutoComplete = (url: string) => {
    const lastCharacter = url.substring(url.length - 1);
    switch (lastCharacter) {
      case '?':
        this.requestForAutocompleteOptions(url);
        break;

      case '=':
        if (url.includes('?$')) {
          this.getParameterEnums(url);
        }
        break;

      case ',':
        this.getParameterEnums(url);
        break;

      case '&':
        this.getPathParameters();
        break;

      default:
        break;
    }
  }

  public onKeyDown = (e: any) => {
    const { activeSuggestion, filteredSuggestions, showSuggestions } = this.state;

    switch (e.keyCode) {
      case KeyCodes.tab:
        if (showSuggestions) {
          const selected = filteredSuggestions[activeSuggestion];
          this.appendSuggestionToUrl(selected);
        }
        break;

      case KeyCodes.up:
        if (activeSuggestion === 0) {
          return;
        }
        this.setState({ activeSuggestion: activeSuggestion - 1 });
        break;

      case KeyCodes.down:
        if (activeSuggestion - 1 === filteredSuggestions.length) {
          return;
        }
        this.setState({ activeSuggestion: activeSuggestion + 1 });
        break;

      default:
        break;
    }

  };

  public getPathParameters = () => {
    const { autoCompleteOptions, sampleQuery: { selectedVerb } } = this.props;
    if (autoCompleteOptions) {
      const suggestions: string[] = [];
      const parameters = autoCompleteOptions.parameters;
      if (parameters) {
        const parametersWithVerb = parameters.find(parameter => parameter.verb === selectedVerb.toLowerCase());
        if (parametersWithVerb) {
          parametersWithVerb.values.forEach((value: any) => {
            suggestions.push(value.name);
          });

          this.setState({
            filteredSuggestions: suggestions,
            suggestions,
            showSuggestions: true,
            compare: ''
          });
        }
      }
    }
  }

  public componentDidUpdate = (prevProps: IAutoCompleteProps) => {
    if (prevProps.autoCompleteOptions !== this.props.autoCompleteOptions) {
      this.getPathParameters();
    }
  }

  private getParameterEnums = (url: string) => {
    const { autoCompleteOptions, sampleQuery: { selectedVerb } } = this.props;
    if (!autoCompleteOptions) {
      return;
    }
    const parameters = autoCompleteOptions.parameters;
    const param = url.split('$').pop()!.split('=')[0];
    if (parameters) {
      const parametersWithVerb = parameters.find(parameter => parameter.verb === selectedVerb.toLowerCase());
      if (parametersWithVerb) {
        const section = parametersWithVerb.values.find((k: { name: string; }) => {
          return k.name === `$${param}`;
        });

        const list: string[] = [];
        if (section && section.items && section.items.length > 0) {
          section.items.forEach((element: string) => {
            list.push(element);
          });
          this.setState({
            filteredSuggestions: list,
            suggestions: list,
            showSuggestions: true,
            compare: ''
          });
        }
      }
    }
  }

  private filterSuggestions(userInput: any, previousUserInput: string, compare: string, suggestions: string[]) {
    let compareString = userInput.replace(previousUserInput, '');
    if (compare) {
      compareString = compare + compareString;
    }
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter((suggestion: any) => {
      return suggestion.toLowerCase().indexOf(compareString.toLowerCase()) > -1;
    });
    this.setState({
      filteredSuggestions,
      compare: compareString
    });
  }

  private requestForAutocompleteOptions(url: string) {
    const { requestUrl } = parseSampleUrl(url);
    if (requestUrl) {
      if (!this.props.autoCompleteOptions || `${requestUrl}` !== this.props.autoCompleteOptions.url) {
        this.props.actions!.fetchAutoCompleteOptions(requestUrl);
      }
      else {
        this.getPathParameters();
      }
    }
  }

  private appendSuggestionToUrl(selected: string) {
    const { userInput, compare } = this.state;
    const selectedSuggestion = cleanUpSelectedSuggestion(compare, userInput, selected);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: selectedSuggestion,
      compare: ''
    });
    this.props.contentChanged(selectedSuggestion);
  }

  public render() {
    const {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions,
      userInput
    } = this.state;

    const { fetchingSuggestions, sampleQuery } = this.props;

    const currentTheme = getTheme();
    const suggestionClass: any = queryInputStyles(currentTheme).autoComplete.suggestions;
    const suggestionOption: any = queryInputStyles(currentTheme).autoComplete.suggestionOption;
    const activeSuggestionClass: any = queryInputStyles(currentTheme).autoComplete.suggestionActive;
    const autoInput: any = queryInputStyles(currentTheme).autoComplete.input;
    const suggestionTitle: any = queryInputStyles(currentTheme).autoComplete.suggestionTitle;

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
                  <Label style={suggestionTitle}>
                    {suggestion}
                  </Label>
                </li>
              );
            })}
          </ul>
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
          value={sampleQuery.sampleUrl}
          suffix={(fetchingSuggestions) ? '...' : undefined}
        />
        {suggestionsListComponent}
      </>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery,
    autoCompleteOptions: state.autoComplete.data,
    fetchingSuggestions: state.autoComplete.pending
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