import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IRequestHeadersProps } from '../../../../../types/request';
import * as queryInputActionCreators from '../../../../services/actions/query-input-action-creators';
import { headerStyles } from './Headers.styles';
import HeadersList from './HeadersList';

class RequestHeaders extends Component<IRequestHeadersProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headerName: '',
      headerValue: '',
    };
  }

  private handleOnHeaderNameChange = (name?: string) => {
    if (name) {
      this.setState({
        headerName: name,
      });
    }
  };

  private handleOnHeaderValueChange = (value?: string) => {
    if (value) {
      this.setState({ headerValue: value });
    }
  };

  private handleOnHeaderDelete = (header: any) => {
    const { actions, sampleQuery } = this.props;
    let headers = [...sampleQuery.sampleHeaders];
    headers = headers.filter(head => head.name !== header.name);

    const query = sampleQuery;
    query.sampleHeaders = headers;

    if (actions) {
      actions.setSampleQuery(query);
    }

    this.setState(this.state);
  };

  private handleOnHeaderAdd = () => {
    if (this.state.headerName !== '') {
      const { headerName, headerValue } = this.state;
      const { actions } = this.props;
      let { sampleHeaders } = this.props.sampleQuery;
      const header = { name: headerName, value: headerValue };

      if (!sampleHeaders) {
        sampleHeaders = [{
          name: '',
          value: ''
        }];
      }

      const newHeaders = [header, ...sampleHeaders];

      this.setState({
        headerName: '',
        headerValue: '',
      });

      if (actions) {
        const query = this.props.sampleQuery;
        query.sampleHeaders = newHeaders;
        actions.setSampleQuery(query);
      }
    }
  };

  public render() {
    // @ts-ignore
    const { sampleQuery, intl: { messages } } = this.props;
    const headers = sampleQuery.sampleHeaders;
    const container: any = headerStyles().container;

    return (
      <div style={container}>
        <div className='row'>
          <div className='col-sm-5'>
            <TextField className='header-input'
              placeholder={messages.Key}
              value={this.state.headerName}
              onChange={(event, name) => this.handleOnHeaderNameChange(name)}
            />
          </div>
          <div className='col-sm-5'>
            <TextField
              className='header-input'
              placeholder={messages.Value}
              value={this.state.headerValue}
              onChange={(event, value) => this.handleOnHeaderValueChange(value)}
            />
          </div>
          <div className='col-sm-2 col-md-2'>
            <PrimaryButton
              style={{ width: '100%' }}
              onClick={() => this.handleOnHeaderAdd()}>
              <FormattedMessage id='Add' />
            </PrimaryButton>
          </div>
        </div>
        <br />
        <hr />
        <HeadersList
          messages={messages}
          handleOnHeaderDelete={(event: any, header: any) => this.handleOnHeaderDelete(header)}
          headers={headers}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      { ...queryInputActionCreators },
      dispatch),
  };
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery,
  };
}

// @ts-ignore
const WithIntl = injectIntl(RequestHeaders);
export default connect(mapStateToProps, mapDispatchToProps)(WithIntl);
