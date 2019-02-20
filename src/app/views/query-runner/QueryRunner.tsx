import {
  Dropdown, IDropdownOption,
  PrimaryButton,
  TextField,
} from 'office-ui-fabric-react';
import React, { Component, FormEvent } from 'react';

import './query-runner.scss';
import { QueryInputControl } from './QueryInput';

interface IQueryRunnerState {
  options: Array<{ key: string; text: string; }>;
  selectedVerb: string;
  querySample: string;
}

export class QueryRunner extends Component<{}, IQueryRunnerState> {
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
      querySample: '',
    };
  }

  private handleOnOptionsChange = (event: FormEvent, option?: IDropdownOption) => {
    if (option !== undefined) {
      this.setState({ selectedVerb: option.text });
    }
  };

  private handleQuerySampleChange = (event: FormEvent, newQuery?: string) => {
    if (newQuery) {
      this.setState({ querySample: newQuery });
    }
  };

  private handleOnClick = () => {
    console.group('Parameters for making request');
    console.log(this.state.selectedVerb);
    console.log(this.state.querySample);
    console.groupEnd();
  };

  public render() {
    const {
      options,
      selectedVerb,
    } = this.state;

    return (
      <div className='query-input-container'>
        <QueryInputControl
          handleOnClick={this.handleOnClick}
          handleOnOptionsChange={this.handleOnOptionsChange}
          handleQuerySampleChange={this.handleQuerySampleChange}
          options={options}
          selectedVerb={selectedVerb}
        />
      </div>
    );
  }
}
