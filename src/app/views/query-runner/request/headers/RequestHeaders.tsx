import { Announced, ITextField, mergeStyles, PrimaryButton, styled, TextField } from '@fluentui/react';
import { createRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { IHeader } from '../../../../../types/request';
import * as queryInputActionCreators from '../../../../services/actions/query-input-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import { headerStyles } from './Headers.styles';
import HeadersList from './HeadersList';

const RequestHeaders = () => {
  const { sampleQuery, dimensions: { request: { height } } } = useAppSelector((state) => state);
  const [announcedMessage, setAnnouncedMessage] = useState('');
  const [isHoverOverHeadersList, setIsHoverOverHeadersList] = useState(false);
  const [isUpdatingHeader, setIsUpdatingHeader] = useState<boolean>(false);

  const emptyHeader = { name: '', value: '' };
  const [header, setHeader] = useState(emptyHeader);

  const sampleQueryHeaders = sampleQuery.sampleHeaders;

  const dispatch: AppDispatch = useDispatch();
  const container = mergeStyles(headerStyles().container);

  const textfieldRef = createRef<ITextField>();
  const onSetFocus = () => textfieldRef.current!.focus();

  const changeHeaderProperties =
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHeader({...header, [event.currentTarget.name]: event.currentTarget.value});
    };

  const handleOnHeaderDelete = (headerToDelete: IHeader) => {
    let headers = [...sampleQuery.sampleHeaders];
    headers = headers.filter(head => head.name !== headerToDelete.name);

    const query = { ...sampleQuery };
    query.sampleHeaders = headers;

    dispatch(queryInputActionCreators.setSampleQuery(query));
    setAnnouncedMessage(translateMessage('Request Header deleted'));
    onSetFocus(); //set focus to textfield after an item is deleted
  };

  const handleOnHeaderAdd = () => {
    if (header.name && header.value) {
      let { sampleHeaders } = sampleQuery;

      if (!sampleHeaders) {
        sampleHeaders = [{
          name: '',
          value: ''
        }];
      }

      const newHeaders = [header, ...sampleHeaders];
      setHeader(emptyHeader);
      setAnnouncedMessage(translateMessage('Request Header added'));
      setIsUpdatingHeader(false);

      const query = { ...sampleQuery };
      query.sampleHeaders = newHeaders;
      dispatch(queryInputActionCreators.setSampleQuery(query));
    }
  };

  const handleOnHeaderEdit = (headerToEdit: IHeader) => {
    if(header.name !== ''){
      return;
    }
    removeHeaderFromSampleQuery(headerToEdit);
    setIsUpdatingHeader(true);
    setHeader({...headerToEdit});
    onSetFocus();
  }

  const removeHeaderFromSampleQuery = (headerToRemove: IHeader) => {
    let headers = [...sampleQuery.sampleHeaders];
    headers = headers.filter(head => head.name !== headerToRemove.name);
    const query = { ...sampleQuery };
    query.sampleHeaders = headers;
    dispatch(queryInputActionCreators.setSampleQuery(query));
  }

  return (
    <div
      onMouseEnter={() => setIsHoverOverHeadersList(true)}
      onMouseLeave={() => setIsHoverOverHeadersList(false)}
      className={container}
      style={isHoverOverHeadersList ? { height: convertVhToPx(height, 60)  } :
        { height: convertVhToPx(height, 60) , overflow: 'hidden' }}>
      <Announced message={announcedMessage} />
      <div className='row'>
        <div className='col-sm-5'>
          <TextField className='header-input'
            placeholder={translateMessage('Key')}
            value={header.name}
            onChange={changeHeaderProperties}
            componentRef={textfieldRef}
            name='name'
          />
        </div>
        <div className='col-sm-5'>
          <TextField
            className='header-input'
            placeholder={translateMessage('Value')}
            value={header.value}
            onChange={changeHeaderProperties}
            name='value'
          />
        </div>
        <div className='col-sm-2 col-md-2'>
          <PrimaryButton
            style={{ width: '100%' }}
            onClick={handleOnHeaderAdd}>
            <FormattedMessage id= {isUpdatingHeader ? 'Update' : 'Add'} />
          </PrimaryButton>
        </div>
      </div>
      <hr />
      <HeadersList
        handleOnHeaderDelete={handleOnHeaderDelete}
        headers={sampleQueryHeaders}
        handleOnHeaderEdit={handleOnHeaderEdit}
      />
    </div>
  );
};
// @ts-ignore
const styledRequestHeaders = styled(RequestHeaders, headerStyles);
export default styledRequestHeaders;
