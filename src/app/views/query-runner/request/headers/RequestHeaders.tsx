import { Announced, ITextField, PrimaryButton, styled, TextField } from '@fluentui/react';
import { createRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { setSampleQuery } from '../../../../services/slices/sample-query.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import { headerStyles } from './Headers.styles';
import HeadersList from './HeadersList';

interface IHeader {
  name: string;
  value: string;
}

const RequestHeaders = (props: any) => {
  const { sampleQuery, dimensions: { request: { height } } } = useAppSelector((state) => state);
  const [announcedMessage, setAnnouncedMessage] = useState('');
  const [isHoverOverHeadersList, setIsHoverOverHeadersList] = useState(false);
  const [isUpdatingHeader, setIsUpdatingHeader] = useState<boolean>(false);

  const emptyHeader = { name: '', value: '' };
  const [header, setHeader] = useState(emptyHeader);

  const sampleQueryHeaders = sampleQuery.sampleHeaders;

  const dispatch = useAppDispatch();
  const classes = classNames(props);

  const textfieldRef = createRef<ITextField>();
  const onSetFocus = () => textfieldRef.current!.focus();

  const changeHeaderProperties =
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHeader({ ...header, [event.currentTarget.name]: event.currentTarget.value });
    };

  const handleOnHeaderDelete = (headerToDelete: IHeader) => {
    let headers = [...sampleQuery.sampleHeaders];
    headers = headers.filter(head => head.name !== headerToDelete.name);

    const query = { ...sampleQuery };
    query.sampleHeaders = headers;

    dispatch(setSampleQuery(query));
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
      dispatch(setSampleQuery(query));
    }
  };

  const handleOnHeaderEdit = (headerToEdit: IHeader) => {
    if (header.name !== '') {
      return;
    }
    removeHeaderFromSampleQuery(headerToEdit);
    setIsUpdatingHeader(true);
    setHeader({ ...headerToEdit });
    onSetFocus();
  }

  const removeHeaderFromSampleQuery = (headerToRemove: IHeader) => {
    let headers = [...sampleQuery.sampleHeaders];
    headers = headers.filter(head => head.name !== headerToRemove.name);
    const query = { ...sampleQuery };
    query.sampleHeaders = headers;
    dispatch(setSampleQuery(query));
  }

  return (
    <div
      onMouseEnter={() => setIsHoverOverHeadersList(true)}
      onMouseLeave={() => setIsHoverOverHeadersList(false)}
      className={classes.container}
      style={isHoverOverHeadersList ? { height: convertVhToPx(height, 60) } :
        { height: convertVhToPx(height, 60), overflow: 'hidden' }}>
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
            {translateMessage(isUpdatingHeader ? 'Update' : 'Add')}
          </PrimaryButton>
        </div>
      </div>
      <hr />
      <HeadersList
        handleOnHeaderDelete={(headerToDelete: IHeader) => handleOnHeaderDelete(headerToDelete)}
        headers={sampleQueryHeaders}
        handleOnHeaderEdit={(headerToEdit: IHeader) => handleOnHeaderEdit(headerToEdit)}
      />
    </div>
  );
};
// @ts-ignore
const styledRequestHeaders = styled(RequestHeaders, headerStyles);
export default styledRequestHeaders;
