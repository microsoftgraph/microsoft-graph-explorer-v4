import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { ThemeContext } from '../../../themes/theme-context';
import { Mode } from '../../../types/action';
import { IQueryResponseProps } from '../../../types/query-response';
import { getConsent } from '../../services/actions/permissions-action-creator';
import { Image, Monaco } from '../common';
import AdaptiveCard  from './adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from './adaptive-cards/AdaptiveHostConfig';
import './query-response.scss';
import { Snippets } from './snippets';

class QueryResponse extends Component<IQueryResponseProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public componentDidUpdate(nextProps: any) {
    const { scopes } = this.props;
    if (nextProps.scopes !== scopes) {
      this.props.actions!.getConsent();
    }
  }

  public render() {
    let body: any;
    let headers;
    let isImageResponse;
    const {
      intl: { messages },
      verb
    }: any = this.props;

    const { graphResponse, mode } = this.props;
    if (graphResponse) {
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


    const pivotItems = [
      <PivotItem
        key='response-preview'
        ariaLabel='Response Preview'
        headerText={messages['Response Preview']}
      >
        {isImageResponse ? (
          <Image
            styles={{ padding: '10px' }}
            body={body}
            alt='profile image'
          />
        ) : (
          <Monaco body={body} verb={verb} />
        )}
      </PivotItem>,
      <PivotItem
        key='response-headers'
        ariaLabel='Response Headers'
        headerText={messages['Response Headers']}
      >
        <Monaco body={headers} />
      </PivotItem>
    ];

    if (mode === Mode.Complete) {
      pivotItems.push(
        <PivotItem
          key = 'adaptive-cards'
          ariaLabel='Adaptive Cards'
          headerText={messages['Adaptive Cards']}
        >
          <ThemeContext.Consumer >
            {(theme) => (
              // @ts-ignore
              <AdaptiveCard
                body= {body}
                hostConfig={theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig}
              />
            )}
          </ThemeContext.Consumer>
        </PivotItem>
      );
      pivotItems.push(
        <PivotItem
          key='code-snippets'
          ariaLabel='Code Snippets'
          headerText={messages.Snippets}
        >
          <Snippets/>
        </PivotItem>
      );
    }

    return (
      <div className='query-response'>
        <Pivot className='pivot-response'>
          {pivotItems}
        </Pivot>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    graphResponse:  state.graphResponse,
    appTheme: state.theme,
    mode : state.graphExplorerMode,
    scopes: state.scopes.data,
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators({
      getConsent
    }, dispatch),
  };
}

// @ts-ignore
const WithIntl = injectIntl(QueryResponse);
export default connect(mapStateToProps, mapDispatchToProps)(WithIntl);

