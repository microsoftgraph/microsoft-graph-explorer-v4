import {
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  TextField,
} from 'office-ui-fabric-react';
import React, { Component, FormEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import * as queryActionCreators from '../../services/actions/query-action-creators';
import './query-runner.scss';
import { QueryInputControl } from './QueryInput';

interface IQueryRunnerState {
  options: Array<{ key: string; text: string; }>;
  selectedVerb: string;
  sampleURL: string;
}

interface IQueryRunnerProps {
  actions?: {
    runQuery: Function;
  };
}

export class QueryRunner extends Component<IQueryRunnerProps, IQueryRunnerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      options: [
        { key: 'GET', text: 'GET' },
        { key: 'POST', text: 'POST' },
        { key: 'PUT', text: 'PUT' },
        { key: 'PATCH', text: 'PATCH'},
        { key: 'DELETE', text: 'DELETE' },
      ],
      selectedVerb: 'GET',
      sampleURL: 'https://graph.microsoft.com/v1.0/me/',
    };
  }

  private handleOnOptionsChange = (event: FormEvent, option?: IDropdownOption) => {
    if (option !== undefined) {
      this.setState({ selectedVerb: option.text });
    }
  };

  private handleQuerySampleChange = (event: FormEvent, newQuery?: string) => {
    if (newQuery) {
      this.setState({ sampleURL: newQuery });
    }
  };

  private handleOnClick = () => {
    const { sampleURL } = this.state;
    const { actions } = this.props;

    if (actions) {
      actions.runQuery(sampleURL);
    }
  };

  public render() {
    const {
      options,
      selectedVerb,
      sampleURL,
    } = this.state;

    return (
      <div className='query-input-container'>
        <QueryInputControl
          handleOnClick={this.handleOnClick}
          handleOnOptionsChange={this.handleOnOptionsChange}
          handleQuerySampleChange={this.handleQuerySampleChange}
          options={options}
          selectedVerb={selectedVerb}
          sampleURL={sampleURL}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(queryActionCreators, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(QueryRunner);
