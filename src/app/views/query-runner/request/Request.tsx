import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';
import { IRequestComponent } from '../../../../types/request';
import { Monaco } from '../../common/monaco/Monaco';
import './request.scss';
import RequestHeaders from './RequestHeaders';

const Request = ({
  sampleBody,
  handleOnEditorChange,
}: IRequestComponent) => {
  console.log(sampleBody);
  return (
    <div className='request-editors'>
      <Pivot>
        <PivotItem headerText='Request Body'>
          <Monaco
            body={sampleBody && JSON.parse(sampleBody)}
            onChange={(value) => handleOnEditorChange(value)} />
        </PivotItem>
        <PivotItem headerText='Request Headers'>
          <RequestHeaders />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default Request;
