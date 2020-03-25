import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IRequestHeadersProps } from '../../../../../types/request';
import * as headersActionCreators from '../../../../services/actions/request-headers-action-creators';
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
    const { actions } = this.props;
    if (actions) {
      actions.removeRequestHeader(header);
    }
  };

  private handleOnHeaderAdd = () => {
    if (this.state.headerName !== '') {
      const { headerName, headerValue } = this.state;
      const { actions } = this.props;
      let { headers } = this.props;
      const header = { name: headerName, value: headerValue };

      if (!headers) {
        headers = [{
          name: '',
          value: ''
        }];
      }

      const newHeaders = [header, ...headers];

      this.setState({
        headerName: '',
        headerValue: '',
      });
      if (actions) {
        actions.addRequestHeader(newHeaders);
      }
    }
  };


  public render() {
    // @ts-ignore
    const { headers, intl: { messages } } = this.props;
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
        <HeadersList handleOnHeaderDelete={(event: any, header: any) => this.handleOnHeaderDelete(header)}
          headers={headers}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(headersActionCreators, dispatch),
  };
}

function mapStateToProps(state: any) {
  return {
    headers: state.headersAdded
  };
}

// @ts-ignore
const WithIntl = injectIntl(RequestHeaders);
export default connect(mapStateToProps, mapDispatchToProps)(WithIntl);
