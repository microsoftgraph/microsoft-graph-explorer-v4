import { IDropdownOption, MessageBarType } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { telemetry } from '../../../telemetry';
import { RUN_QUERY_EVENT } from '../../../telemetry/event-types';
import {
  IQueryRunnerProps,
  IQueryRunnerState,
} from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../services/actions/query-input-action-creators';
import * as queryStatusActionCreators from '../../services/actions/query-status-action-creator';
import { parseSampleUrl } from '../../utils/sample-url-generation';
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

  private handleOnMethodChange = (method?: IDropdownOption) => {
    const query = { ...this.props.sampleQuery };
    const { actions } = this.props;
    if (method !== undefined) {
      query.selectedVerb = method.text;
      if (actions) {
        actions.setSampleQuery(query);
      }

      // Sets selected verb in App Component
      this.props.onSelectVerb(method.text);
    }
  };

  private handleOnUrlChange = (newUrl = '') => {
    const { actions, sampleQuery } = this.props;

    const newQuery = Object.assign({}, sampleQuery, { sampleUrl: newUrl })

    if (actions) {
      actions.setSampleQuery(newQuery);
    }

    this.changeUrlVersion(newUrl);
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
  };

  private handleOnEditorChange = (body?: string) => {
    this.setState({ sampleBody: body });
  };

  private handleOnRunQuery = () => {
    const { sampleBody } = this.state;
    const { actions, sampleQuery, } = this.props;
    const { intl: { messages } }: any = this.props;

    if (sampleBody) {
      try {
        sampleQuery.sampleBody = JSON.parse(sampleBody);
      } catch (error) {
        actions!.setQueryResponseStatus({
          ok: false,
          statusText: messages['Malformed JSON body'],
          status: `${messages['Review the request body']} ${error}`,
          messageType: MessageBarType.error
        });
        return;
      }
    }

    if (actions) {
      actions.runQuery(sampleQuery);
    }
    telemetry.trackEvent(RUN_QUERY_EVENT, sampleQuery);
  };

  private handleOnVersionChange = (urlVersion?: IDropdownOption) => {
    const { sampleQuery } = this.props;
    if (urlVersion) {
      const { sampleUrl, queryVersion } = parseSampleUrl(sampleQuery.sampleUrl, urlVersion.text);
      this.props.actions!.setSampleQuery({
        ...sampleQuery,
        sampleUrl,
        selectedVersion: queryVersion
      });
    }
  };

  private changeUrlVersion(newUrl: string) {
    const query = { ...this.props.sampleQuery };
    const { queryVersion: newQueryVersion } = parseSampleUrl(newUrl);
    const { queryVersion: oldQueryVersion } = parseSampleUrl(query.sampleUrl);

    if (newQueryVersion !== oldQueryVersion) {
      if (newQueryVersion === 'v1.0' || newQueryVersion === 'beta') {
        const sampleQuery = { ...this.props.sampleQuery };
        sampleQuery.selectedVersion = newQueryVersion;
        this.props.actions!.setSampleQuery(sampleQuery);
      }
    }
  }

  public render() {
    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            {
              // @ts-ignore
              <QueryInput
                handleOnRunQuery={this.handleOnRunQuery}
                handleOnMethodChange={this.handleOnMethodChange}
                handleOnVersionChange={this.handleOnVersionChange}
                handleOnUrlChange={this.handleOnUrlChange}
                handleOnBlur={this.handleOnBlur}
              />
            }
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            {
              // @ts-ignore
              <Request handleOnEditorChange={this.handleOnEditorChange} />
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      { ...queryActionCreators, ...queryInputActionCreators, ...queryStatusActionCreators },
      dispatch
    )
  };
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery,
  };
}

// @ts-ignore
const IntlQueryRunner = injectIntl(QueryRunner);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntlQueryRunner);
