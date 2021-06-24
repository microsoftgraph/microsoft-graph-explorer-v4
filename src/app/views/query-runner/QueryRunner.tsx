import { IDropdownOption, MessageBarType } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { ContentType } from '../../../types/enums';
import {
  IQueryRunnerProps,
  IQueryRunnerState,
} from '../../../types/query-runner';
import { IRootState } from '../../../types/root';

import * as queryActionCreators from '../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../services/actions/query-input-action-creators';
import * as queryStatusActionCreators from '../../services/actions/query-status-action-creator';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { translateMessage } from '../../utils/translate-messages';
import { QueryInput } from './query-input';
import './query-runner.scss';
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
    const query = { ...this.props.sampleQuery };
    query.sampleBody = body;
    this.props.actions!.setSampleQuery(query);
  };

  private handleOnRunQuery = () => {
    const { sampleBody } = this.state;
    const { actions, sampleQuery } = this.props;

    if (sampleBody) {
      const headers = sampleQuery.sampleHeaders;
      const contentType = headers.find(k => k.name.toLowerCase() === 'content-type');
      if (!contentType || (contentType.value === ContentType.Json)) {
        try {
          sampleQuery.sampleBody = JSON.parse(sampleBody);
        } catch (error) {
          actions!.setQueryResponseStatus({
            ok: false,
            statusText: translateMessage('Malformed JSON body'),
            status: `${translateMessage('Review the request body')} ${error}`,
            messageType: MessageBarType.error,
          });
          return;
        }
      } else {
        sampleQuery.sampleBody = sampleBody;
      }
    }

    if (actions) {
      actions.runQuery(sampleQuery);
      const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
      telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
        {
          ComponentName: componentNames.RUN_QUERY_BUTTON,
          SelectedVersion: sampleQuery.selectedVersion,
          QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`
        });
    }
  };

  private handleOnVersionChange = (urlVersion?: IDropdownOption) => {
    const { sampleQuery } = this.props;
    if (urlVersion) {
      const { queryVersion: oldQueryVersion } = parseSampleUrl(
        sampleQuery.sampleUrl
      );
      const { sampleUrl, queryVersion: newQueryVersion } = parseSampleUrl(
        sampleQuery.sampleUrl,
        urlVersion.text
      );
      this.props.actions!.setSampleQuery({
        ...sampleQuery,
        sampleUrl,
        selectedVersion: newQueryVersion,
      });
      if (oldQueryVersion !== newQueryVersion) {
        telemetry.trackEvent(eventTypes.DROPDOWN_CHANGE_EVENT, {
          ComponentName: componentNames.VERSION_CHANGE_DROPDOWN,
          NewVersion: newQueryVersion,
          OldVersion: oldQueryVersion,
        });
      }
    }
  };

  public render() {
    return (
      <>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            {
              // @ts-ignore
              <QueryInput
                handleOnRunQuery={this.handleOnRunQuery}
                handleOnMethodChange={this.handleOnMethodChange}
                handleOnVersionChange={this.handleOnVersionChange}
                handleOnBlur={this.handleOnBlur}
              />
            }
          </div>
        </div>
        <div className='row' style={{ marginTop: 10 }}>
          <div className='col-sm-12 col-lg-12'>
            {
              // @ts-ignore
              <Request
                handleOnEditorChange={this.handleOnEditorChange}
                sampleQuery={this.props.sampleQuery}
                permissionModeType={this.props.permissionModeType}
              />
            }
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      {
        ...queryActionCreators,
        ...queryInputActionCreators,
        ...queryStatusActionCreators,
      },
      dispatch
    ),
  };
}

function mapStateToProps({ sampleQuery }: IRootState) {
  return {
    sampleQuery,
  };
}

// @ts-ignore
const IntlQueryRunner = injectIntl(QueryRunner);
export default connect(mapStateToProps, mapDispatchToProps)(IntlQueryRunner);
