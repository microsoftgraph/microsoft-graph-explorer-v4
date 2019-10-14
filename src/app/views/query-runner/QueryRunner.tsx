import { IDropdownOption } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  IQueryRunnerProps,
  IQueryRunnerState,
} from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../services/actions/query-input-action-creators';
import { addRequestHeader } from '../../services/actions/request-headers-action-creators';
import { GRAPH_URL } from '../../services/graph-constants';
import './query-runner.scss';
import QueryInput from './QueryInput';
import Request from './request/Request';

export class QueryRunner extends Component<
  IQueryRunnerProps,
  IQueryRunnerState
> {
  constructor(props: IQueryRunnerProps) {
    super(props);
    this.state = {
      url: '',
      sampleBody: '',
    };
  }

  private handleOnMethodChange = (option?: IDropdownOption) => {
    const query = { ...this.props.sampleQuery };
    const { actions } = this.props;
    if (option !== undefined) {
      query.selectedVerb = option.text;
      if (actions) {
        actions.setSampleQuery(query);
      }

      // Sets selected verb in App Component
      this.props.onSelectVerb(option.text);
    }
  };

  private handleOnUrlChange = (newQuery = '') => {
    this.setState({ url: newQuery });
  };

  private handleOnBlur = () => {
    const { url } = this.state;
    const query = { ...this.props.sampleQuery };
    const { actions } = this.props;

    if (url) {
      query.sampleUrl = url;
      if (actions) {
        actions.setSampleQuery(query);
      }
    }
  }

  private handleOnEditorChange = (body?: string) => {
    this.setState({ sampleBody: body });
  };

  private handleOnRunQuery = () => {
    const { sampleBody } = this.state;
    const { actions, headers, sampleQuery } = this.props;

    if (headers) {
      sampleQuery.sampleHeaders = headers;
    }

    if (sampleBody) {
      sampleQuery.sampleBody = JSON.parse(sampleBody);
    }

    if (actions) {
      actions.runQuery(sampleQuery);
    }
  };

  private handleOnVersionChange = (option?: IDropdownOption) => {
    const { sampleQuery } = this.props;
    if (option) {
      const urlObject: URL = new URL(sampleQuery.sampleUrl);
      const requestUrl = urlObject.pathname.substr(5).replace(/\/$/, '');
      const sampleUrl = `${GRAPH_URL}/${option.text + requestUrl + decodeURI(urlObject.search)}`;

      this.props.actions!.selectQueryVersion(option.text);
      this.props.actions!.setSampleQuery({
        ...sampleQuery,
        sampleUrl
      });
    }
  };

  public render() {

    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <QueryInput
              handleOnRunQuery={this.handleOnRunQuery}
              handleOnMethodChange={this.handleOnMethodChange}
              handleOnVersionChange={this.handleOnVersionChange}
              handleOnUrlChange={this.handleOnUrlChange}
              handleOnBlur={this.handleOnBlur}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <Request handleOnEditorChange={this.handleOnEditorChange} />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      { ...queryActionCreators, ...queryInputActionCreators, addRequestHeader },
      dispatch
    )
  };
}

function mapStateToProps(state: any) {
  return {
    headers: state.headersAdded,
    sampleQuery: state.sampleQuery,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueryRunner);
