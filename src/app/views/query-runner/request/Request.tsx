import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';
import { IRequestComponent } from '../../../../types/request';
import { Monaco } from '../../common/monaco/Monaco';
import './request.scss';
import { RequestHeadersControl } from './RequestHeaders';

export const Request = ({
    handleOnEditorChange,
    handleOnHeaderNameChange,
    handleOnHeaderDelete,
    handleOnHeaderValueChange,
    handleOnHeaderValueBlur,
    headers,
  }: IRequestComponent) => {

    return (
      <div className='request-editors'>
        <Pivot>
          <PivotItem headerText='Request Body'>
            <Monaco
                    body={undefined}
                    onChange={(value) => handleOnEditorChange(value)} />
                />
          </PivotItem>
          <PivotItem headerText='Request Headers'>
            <RequestHeadersControl
              handleOnHeaderDelete={(event: any, header: any) => handleOnHeaderDelete(header)}
              handleOnHeaderNameChange={(event: any, name: any) => handleOnHeaderNameChange(name)}
              handleOnHeaderValueChange={(event: any, value: any) => handleOnHeaderValueChange(value)}
              handleOnHeaderValueBlur={(event: any, header: any) => handleOnHeaderValueBlur(header)}
              headers={headers}
            />
          </PivotItem>
        </Pivot>
      </div>
    );
  };
