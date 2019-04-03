import { IDropdownOption } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IQueryRunnerProps, IQueryRunnerState } from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import './query-runner.scss';
import { QueryInputControl } from './QueryInput';
import { Request } from './request/Request';

export class QueryRunner extends Component<IQueryRunnerProps, IQueryRunnerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      httpMethods: [
        { key: 'GET', text: 'GET' },
        { key: 'POST', text: 'POST' },
        { key: 'PUT', text: 'PUT' },
        { key: 'PATCH', text: 'PATCH' },
        { key: 'DELETE', text: 'DELETE' },
      ],
      selectedVerb: 'GET',
      sampleURL: 'https://graph.microsoft.com/v1.0/me/',
    };
  }

  private handleOnMethodChange = (option?: IDropdownOption) => {
    if (option !== undefined) {
      this.setState({ selectedVerb: option.text });
    }
  };

  private handleOnUrlChange = (newQuery?: string) => {
    if (newQuery) {
      this.setState({ sampleURL: newQuery });
    }
  };

  private handleOnRunQuery = () => {
    const { sampleURL } = this.state;
    const { actions } = this.props;

    if (actions) {
      actions.runQuery(sampleURL);
    }
  };

  public render() {
    const {
      httpMethods,
      selectedVerb,
      sampleURL,
    } = this.state;

    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <QueryInputControl
              handleOnRunQuery={this.handleOnRunQuery}
              handleOnMethodChange={this.handleOnMethodChange}
              handleOnUrlChange={this.handleOnUrlChange}
              httpMethods={httpMethods}
              selectedVerb={selectedVerb}
              sampleURL={sampleURL}
            />
          </div>
        </div>
        <div className='row'>
          <Request />
        </div>
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
