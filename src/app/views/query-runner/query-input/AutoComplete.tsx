import { getTheme, ITextField, KeyCodes, Spinner, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAutoCompleteProps, IAutoCompleteState } from '../../../../types/auto-complete';
import * as autoCompleteActionCreators from '../../../services/actions/autocomplete-action-creators';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { queryInputStyles } from './QueryInput.styles';
import SuggestionsList from './SuggestionsList';
import { cleanUpSelectedSuggestion, getLastCharacterOf, getParametersWithVerb } from './util';

class AutoComplete extends Component<IAutoCompleteProps, IAutoCompleteState> {
  private autoCompleteRef: React.RefObject<ITextField>;

  constructor(props: IAutoCompleteProps) {
    super(props);

    this.autoCompleteRef = React.createRef();

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      suggestions: [],
      showSuggestions: false,
      userInput: this.props.sampleQuery.sampleUrl,
      queryUrl: this.props.sampleQuery.sampleUrl,
      compare: ''
    };
  }

  private getRef(): ITextField | null {
    return this.autoCompleteRef.current;
  }

  public setFocus() {
    this.getRef()!.blur();
    // Gives the chance for the focus to take effect
    setTimeout(() => {
      this.getRef()!.focus();
    }, 10);
  }

  public onBlur = (e: any) => {
    const userInput = e.target.value;
    this.props.contentChanged(userInput);
  };

  public onChange = (e: any) => {
    const { suggestions, showSuggestions, userInput: previousUserInput, compare } = this.state;
    const userInput = e.target.value;

    this.setState({
      userInput,
      queryUrl: userInput
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
    switch (getLastCharacterOf(url)) {
      case '/':
        this.requestForAutocompleteOptions(url);
        break;

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
        this.getQueryParameters();
        break;

      default:
        break;
    }
  }

  public onKeyDown = (e: any) => {
    const { activeSuggestion, filteredSuggestions, showSuggestions, queryUrl } = this.state;

    switch (e.keyCode) {
      case KeyCodes.enter:
        if (showSuggestions) {
          const selected = filteredSuggestions[activeSuggestion];
          this.appendSuggestionToUrl(selected);
        } else {
          this.props.contentChanged(queryUrl);
          this.props.runQuery();
        }
        break;

      case KeyCodes.tab:
        if (showSuggestions) {
          e.preventDefault();
          const selected = filteredSuggestions[activeSuggestion];
          this.appendSuggestionToUrl(selected);
        }
        break;

      case KeyCodes.up:
        e.preventDefault();
        if (showSuggestions) {
          let active = activeSuggestion - 1;
          if (activeSuggestion === 0) {
            active = filteredSuggestions.length - 1;
          }
          this.setState({ activeSuggestion: active });
        }
        break;

      case KeyCodes.down:
        e.preventDefault();
        if (showSuggestions) {
          let active = activeSuggestion + 1;
          if (activeSuggestion === filteredSuggestions.length - 1) {
            active = 0;
          }
          this.setState({ activeSuggestion: active });
          break;
        }

      case KeyCodes.escape:
        if (showSuggestions) {
          this.setState({ showSuggestions: false });
        }
        break;

      default:
        break;
    }

  };

  public displayLinkOptions = () => {
    const parametersWithVerb = getParametersWithVerb(this.props);
    if (!parametersWithVerb) {
      return;
    }
    this.setSuggestions(parametersWithVerb.links);
  }

  public getQueryParameters = () => {
    const parametersWithVerb = getParametersWithVerb(this.props);
    if (!parametersWithVerb) {
      return;
    }
    this.setSuggestions(parametersWithVerb.values.map((value: { name: any; }) => value.name));
  }

  private getParameterEnums = (url: string) => {
    const parametersWithVerb = getParametersWithVerb(this.props);
    if (!parametersWithVerb) {
      return;
    }
    const param = url.split('$').pop()!.split('=')[0];
    const section = parametersWithVerb.values.find((k: { name: string; }) => {
      return k.name === `$${param}`;
    });

    if (section && section.items && section.items.length > 0) {
      this.setSuggestions(section.items);
    }
  }

  private setSuggestions(suggestions: string[]) {
    this.setState({
      filteredSuggestions: suggestions,
      suggestions,
      showSuggestions: (suggestions.length > 0),
      compare: ''
    });
  }

  public componentDidUpdate = (prevProps: IAutoCompleteProps) => {
    if (prevProps.autoCompleteOptions !== this.props.autoCompleteOptions) {
      if (this.props.autoCompleteOptions) {
        this.performLocalSearch(this.state.queryUrl);
      }
    }

    const newUrl = this.props.sampleQuery.sampleUrl;
    if ((this.state.queryUrl === prevProps.sampleQuery.sampleUrl) && newUrl !== this.state.queryUrl) {
      if (newUrl !== this.state.queryUrl) {
        this.setState({
          queryUrl: newUrl,
          userInput: newUrl
        });
      }
    }
  }

  private filterSuggestions(userInput: string, previousUserInput: string, compare: string, suggestions: string[]) {
    let compareString = userInput.replace(previousUserInput, '');
    if (compare) {
      compareString = compare + compareString;
    }
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter((suggestion: string) => {
      return suggestion.toLowerCase().indexOf(compareString.toLowerCase()) > -1;
    });
    this.setState({
      filteredSuggestions,
      compare: compareString
    });
  }

  private requestForAutocompleteOptions(url: string) {
    const { requestUrl, queryVersion } = parseSampleUrl(url);
    if (requestUrl || queryVersion) {
      if (!this.props.autoCompleteOptions || `${requestUrl}` !== this.props.autoCompleteOptions.url) {
        this.props.actions!.fetchAutoCompleteOptions(requestUrl);
      }
      else {
        this.performLocalSearch(url);
      }
    }
  }

  private performLocalSearch(url: string) {
    switch (getLastCharacterOf(url)) {
      case '/':
        this.displayLinkOptions();
        break;

      case '?':
        this.getQueryParameters();
        break;

      default:
        break;
    }
  }

  private appendSuggestionToUrl(selected: string) {
    const { userInput, compare } = this.state;
    if (selected.startsWith('$')) {
      selected += '=';
    }
    const selectedSuggestion = cleanUpSelectedSuggestion(compare, userInput, selected);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: selectedSuggestion,
      compare: '',
      queryUrl: selectedSuggestion,
    });
    this.props.contentChanged(selectedSuggestion);
    this.setFocus();
    this.initialiseAutoComplete(selectedSuggestion);
  }

  private renderSuffix = () => {
    return (<Spinner />);
  }

  public render() {
    const {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions,
      userInput,
      queryUrl
    } = this.state;

    const { fetchingSuggestions } = this.props;

    const currentTheme = getTheme();
    const {
      input: autoInput,
    }: any = queryInputStyles(currentTheme).autoComplete;

    return (
      <>
        <TextField
          className={autoInput}
          type='text'
          autoComplete='off'
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          value={queryUrl}
          componentRef={this.autoCompleteRef}
          onRenderSuffix={(fetchingSuggestions) ? this.renderSuffix : undefined}
        />
        {showSuggestions && userInput && filteredSuggestions.length > 0 &&
          <SuggestionsList
            filteredSuggestions={filteredSuggestions}
            activeSuggestion={activeSuggestion}
            onClick={(e: any) => this.onClick(e)} />}
      </>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery,
    appTheme: state.theme,
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
