import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { Monaco } from '../../common/monaco/Monaco';
import './request.scss';
import { RequestHeadersControl } from './RequestHeaders';

interface IRequestComponent {
    handleOnEditorChange: Function;
    handleOnHeaderNameChange: Function;
    handleOnHeaderDelete: Function;
    handleOnHeaderValueChange: Function;
    handleOnHeaderValueBlur: Function;
  }

export const Request = ({
    handleOnEditorChange,
    handleOnHeaderNameChange,
    handleOnHeaderDelete,
    handleOnHeaderValueChange,
    handleOnHeaderValueBlur,
  }: IRequestComponent) => {

    return (
      <div className='request-editors'>
        <Pivot>
          <PivotItem headerText='Request Body'>
            <Monaco
                    body={undefined}
                    onChange={(value, event) => handleOnEditorChange(value)} />
                />
          </PivotItem>
          <PivotItem headerText='Request Headers'>
            <RequestHeadersControl
              handleOnHeaderDelete={(event: any, header: any) => handleOnHeaderDelete(header)}
              handleOnHeaderNameChange={(event: any, name: any) => handleOnHeaderNameChange(name)}
              handleOnHeaderValueChange={(event: any, value: any) => handleOnHeaderValueChange(value)}
              handleOnHeaderValueBlur={(event: any, header: any) => handleOnHeaderValueBlur(header)}
              headers={[{ name: '', value: '' }]}
            />
          </PivotItem>
        </Pivot>
      </div>
    );
  };
