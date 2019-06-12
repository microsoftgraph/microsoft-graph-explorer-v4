import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IRequestComponent } from '../../../../types/request';
import { Monaco } from '../../common/monaco/Monaco';
import './request.scss';
import RequestHeaders from './RequestHeaders';

export class Request extends Component<IRequestComponent, any> {
  constructor(props: IRequestComponent) {
    super(props);
  }

  public render () {

    const {
      handleOnEditorChange,
      sampleBody
    } = this.props;

    return (
      <div className='request-editors'>
        <Pivot>
          <PivotItem headerText='Request Body'>
            <Monaco
              body={sampleBody}
              onChange={(value) => handleOnEditorChange(value)} />
            />
          </PivotItem>
          <PivotItem headerText='Request Headers'>
            <RequestHeaders />
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleBody: state.sampleQuery.sampleBody
  };
}

export default connect(mapStateToProps, null)(Request);
