import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { IRequestComponent } from '../../../../types/request';
import { Monaco } from '../../common/monaco/Monaco';
import './request.scss';
import RequestHeaders from './RequestHeaders';

export class Request extends Component<IRequestComponent, any> {
  constructor(props: IRequestComponent) {
    super(props);
  }

  public render() {

    const {
      handleOnEditorChange,
      sampleBody
    } = this.props;

    const {
      intl: { messages },
    }: any = this.props;

    return (
      <div className='request-editors'>
        <Pivot>
          <PivotItem headerText={messages['request body']}>
            <Monaco
              body={sampleBody}
              onChange={(value) => handleOnEditorChange(value)} />
          </PivotItem>
          <PivotItem headerText={messages['request header']}>
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

// @ts-ignore
const IntlRequest = injectIntl(Request);
export default connect(mapStateToProps, null)(IntlRequest);
