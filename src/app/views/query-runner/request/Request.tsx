import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';
import { IRequestComponent } from '../../../../types/request';
import { Monaco } from '../../common/monaco/Monaco';
import './request.scss';
import RequestHeaders from './RequestHeaders';

const Request = ({
    handleOnEditorChange,
}: IRequestComponent) => {

    return (
      <div className='request-editors'>
        <Pivot>
          <PivotItem headerText='Request Body'>
            <Monaco
              body={undefined}
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
