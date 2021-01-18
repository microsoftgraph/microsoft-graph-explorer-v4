import { Announced, PrimaryButton, TextField } from 'office-ui-fabric-react';
import React, { Component, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ISampleQuery } from '../../../../../types/query-runner';

import { IRequestHeadersProps } from '../../../../../types/request';
import * as queryInputActionCreators from '../../../../services/actions/query-input-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { headerStyles } from './Headers.styles';
import HeadersList from './HeadersList';

const RequestHeaders = (props: any) => {
  const sampleQuery = useSelector((state: any) => state.sampleQuery);
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [announcedMessage, setAnnouncedMessage] = useState('');

  const { intl: { messages } } = props;
  const sampleQueryHeaders = sampleQuery.sampleHeaders;
  const container: any = headerStyles().container;

  const dispatch = useDispatch();

  const handleOnHeaderNameChange = (name?: string) => {
    if (name) {
      setHeaderName(name);
    }
  };

  const handleOnHeaderValueChange = (value?: string) => {
    if (value) {
      setHeaderValue(value);
    }
  };

  const handleOnHeaderDelete = (header: any) => {
    let headers = [...sampleQuery.sampleHeaders];
    headers = headers.filter(head => head.name !== header.name);

    const query = { ...sampleQuery };
    query.sampleHeaders = headers;

    dispatch(queryInputActionCreators.setSampleQuery(query));
    setAnnouncedMessage(translateMessage('Request Header deleted'));
  };

  const handleOnHeaderAdd = () => {
    if (headerName !== '') {
      let { sampleHeaders } = sampleQuery;
      const header = { name: headerName, value: headerValue };

      if (!sampleHeaders) {
        sampleHeaders = [{
          name: '',
          value: ''
        }];
      }

      const newHeaders = [header, ...sampleHeaders];

      setHeaderName('');
      setHeaderValue('');
      setAnnouncedMessage(translateMessage('Request Header added'));

      const query = { ...sampleQuery };
      query.sampleHeaders = newHeaders;
      dispatch(queryInputActionCreators.setSampleQuery(query));
    }
  };

  return (
    <div style={container}>
      <Announced message={announcedMessage} />
      <div className='row'>
        <div className='col-sm-5'>
          <TextField className='header-input'
            placeholder={messages.Key}
            value={headerName}
            onChange={(event, name) => handleOnHeaderNameChange(name)}
          />
        </div>
        <div className='col-sm-5'>
          <TextField
            className='header-input'
            placeholder={messages.Value}
            value={headerValue}
            onChange={(event, value) => handleOnHeaderValueChange(value)}
          />
        </div>
        <div className='col-sm-2 col-md-2'>
          <PrimaryButton
            style={{ width: '100%' }}
            onClick={() => handleOnHeaderAdd()}>
            <FormattedMessage id='Add' />
          </PrimaryButton>
        </div>
      </div>
      <hr />
      <HeadersList
        messages={messages}
        handleOnHeaderDelete={(event: any, header: any) => handleOnHeaderDelete(header)}
        headers={sampleQueryHeaders}
      />
    </div>
  );
};
// @ts-ignore
const WithIntl = injectIntl(RequestHeaders);
export default WithIntl;
