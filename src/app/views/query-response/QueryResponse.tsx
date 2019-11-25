import { DefaultButton, FontSizes, IconButton, Pivot, PivotItem, PrimaryButton, } from 'office-ui-fabric-react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { ThemeContext } from '../../../themes/theme-context';
import { Mode } from '../../../types/action';
import { IQueryResponseProps } from '../../../types/query-response';
import { Image, Monaco } from '../common';
import AdaptiveCard from './adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from './adaptive-cards/AdaptiveHostConfig';
import './query-response.scss';
import { Snippets } from './snippets';

class QueryResponse extends Component<IQueryResponseProps, { showShareQueryDialog: boolean, query: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      showShareQueryDialog: true,
      query: '',
    };
  }

  public handleCopy = () => {
    const shareQueryParams: any = document.getElementById('share-query-text');
    shareQueryParams.focus();
    shareQueryParams.select();

    document.execCommand('copy');
    document.execCommand('unselect');

    shareQueryParams.blur();
    this.toggleShareQueryDialogState();
  }

  public handleShareQuery = () => {
    const query = this.generateShareQueryParams();
    this.setState({ query });
    this.toggleShareQueryDialogState();
  }

  public toggleShareQueryDialogState = () => {
    this.setState({ showShareQueryDialog: !this.state.showShareQueryDialog });
  }

  private generateShareQueryParams = (): string => {
    const { sampleQuery: { sampleBody, sampleUrl, selectedVerb, selectedVersion } } = this.props;
    const { origin, pathname } = window.location;
    const url = new URL(sampleUrl);
    const graphUrl = url.origin;
    /**
     * To ensure backward compatibility the version is removed from the pathname.
     * V3 expects the request query param to not have the version number.
     */
    const graphUrlRequest = url.pathname.substr(6) + url.search;
    const requestBody = this.hashEncode(JSON.stringify(sampleBody));

    return origin + pathname
      + '?request=' + graphUrlRequest
      + '&method=' + selectedVerb
      + '&version=' + selectedVersion
      + '&GraphUrl=' + graphUrl
      + '&requestBody=' + requestBody;
  }

  private hashEncode(requestBody: string): string {
    return btoa(requestBody);
  }

  public render() {
    let body: any;
    let headers;
    let isImageResponse;
    const {
      intl: { messages },
      verb
    }: any = this.props;

    const { showShareQueryDialog, query } = this.state;
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
          key='adaptive-cards'
          ariaLabel='Adaptive Cards'
          headerText={messages['Adaptive Cards']}
        >
          <ThemeContext.Consumer >
            {(theme) => (
              // @ts-ignore
              <AdaptiveCard
                body={body}
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
          <Snippets />
        </PivotItem>
      );
    }

    return (
      <div>
        <div className='query-response'>
          <IconButton onClick={this.handleShareQuery} className='share-query-btn' iconProps={{
            iconName: 'Share'
          }} />
          <Pivot className='pivot-response'>
            {pivotItems}
          </Pivot>
        </div>
        <Dialog
          hidden={showShareQueryDialog}
          onDismiss={this.toggleShareQueryDialogState}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Share Query',
            isMultiline: true,
            subText: messages['Share Query Message']
          }}
        >
          <textarea style={{
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: FontSizes.xSmall,
            width: '100%',
            height: 63,
            overflowY: 'scroll',
            border: 'none',
            resize: 'none'
          }} className='share-query-params' id='share-query-text' defaultValue={query} />
          <DialogFooter>
            <PrimaryButton text={messages.Copy} onClick={this.handleCopy} />
            <DefaultButton text={messages.Close} onClick={this.toggleShareQueryDialogState} />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    graphResponse: state.graphResponse,
    appTheme: state.theme,
    mode: state.graphExplorerMode,
    scopes: state.scopes.data,
    sampleQuery: state.sampleQuery
  };
}

// @ts-ignore
const WithIntl = injectIntl(QueryResponse);
export default connect(mapStateToProps)(WithIntl);

