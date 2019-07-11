import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { IQueryResponseProps } from '../../../types/query-response';
import { Image, Monaco } from '../common';
import './query-response.scss';

class QueryResponse extends Component<IQueryResponseProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    let body: any;
    let headers;
    let isImageResponse;
    // @ts-ignore
    const { intl: { messages } } = this.props;

    const { graphResponse, isLoginResponse } = this.props;
    if (graphResponse && !isLoginResponse) {
      body = graphResponse.body;
      headers = graphResponse.headers;

      if (body) {
        /**
         * body.body is a getter propety for the Body mixin. It is used to access the ReadableStream property.
         * https://developer.mozilla.org/en-US/docs/Web/API/Body/body
         */
        isImageResponse = body && body.body;
      }
    }

    return (
      <div className='query-response'>
        <Pivot className='pivot-response'>
          <PivotItem
            headerText={messages['Response Preview']}
          >
            {isImageResponse ?
              <Image
                styles={{ padding: '10px' }}
                body={body}
                alt='profile image'
              />
              :
              <Monaco
                body={body}
              />
            }

          </PivotItem>
          <PivotItem
            headerText={messages['Response Headers']}
          >
            <Monaco
              body={headers}
            />
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}

function mapStateToProps(state: IQueryResponseProps) {
  return {
    graphResponse: state.graphResponse,
    isLoginResponse: state.isLoginResponse
  };
}
// @ts-ignore
const WithIntl = injectIntl(QueryResponse);
export default connect(mapStateToProps)(WithIntl);
