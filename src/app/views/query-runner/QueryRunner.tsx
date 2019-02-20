import {
  Dropdown, IDropdownOption,
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
  querySample: string;
}

interface IQueryRunnerProps {
  actions?: {
    querySample: Function;
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
    const { querySample } = this.state;
    const { actions  } = this.props;

    if (actions) {
      actions.querySample(querySample);
    }
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

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(queryActionCreators, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(QueryRunner);
