import {
  DefaultButton, FontSizes,
  getId, IconButton, Modal, Pivot,
  PrimaryButton, TooltipHost
} from 'office-ui-fabric-react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Mode } from '../../../types/enums';
import { IQueryResponseProps, IQueryResponseState } from '../../../types/query-response';
import { copy } from '../common/copy';
import { createShareLink } from '../common/share';
import { getPivotItems } from './pivot-items/pivot-items';
import './query-response.scss';

class QueryResponse extends Component<IQueryResponseProps, IQueryResponseState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showShareQueryDialog: true,
      showModal: false,
      query: '',
    };
  }

  public shouldComponentUpdate(nextProps: IQueryResponseProps, nextState: IQueryResponseState) {
    return nextProps.graphResponse !== this.props.graphResponse
      || nextProps.mobileScreen !== this.props.mobileScreen
      || nextState !== this.state
      || nextProps.theme !== this.props.theme;
  }

  public handleCopy = () => {
    copy('share-query-text')
      .then(() => this.toggleShareQueryDialogState());
  }

  public handleShareQuery = () => {
    const { sampleQuery } = this.props;
    const shareableLink = createShareLink(sampleQuery);
    this.setState({ query: shareableLink });
    this.toggleShareQueryDialogState();
  }

  public toggleShareQueryDialogState = () => {
    this.setState({ showShareQueryDialog: !this.state.showShareQueryDialog });
  };

  public toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  public render() {
    let body: any;
    let headers;
    const {
      intl: { messages },
      verb,
      sampleQuery
    }: any = this.props;

    const { showShareQueryDialog, query, showModal } = this.state;
    const { graphResponse, mode, mobileScreen } = this.props;

    if (graphResponse) {
      body = graphResponse.body;
      headers = graphResponse.headers;
    }

    const pivotProperties = {
      messages, body, verb, mode, headers, mobileScreen, sampleQuery
    };

    const pivotItems = getPivotItems(pivotProperties);

    return (
      <div>
        <div className='query-response'>
          {mode === Mode.Complete && <>
            <div style={{
              float: 'right',
              padding: '0px',
              zIndex: 1,
            }}>

              <TooltipHost
                content={`${messages['Share Query Message']}`}
                id={getId()}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <IconButton onClick={this.handleShareQuery} className='share-query-btn' iconProps={{
                  iconName: 'Share'
                }} />
              </TooltipHost>
            </div>

            <div style={{
              float: 'right',
              padding: '0px',
              zIndex: 1,
            }}>
              <TooltipHost
                content={`${messages['Expand response']}`}
                id={getId()}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <IconButton onClick={this.toggleModal} className='share-query-btn' iconProps={{
                  iconName: 'MiniExpandMirrored'
                }} />
              </TooltipHost>
            </div>
          </>}
          <Pivot className='pivot-response'>
            {pivotItems}
          </Pivot>
        </div>

        {
          // @ts-ignore
          <Modal
            isOpen={showModal}
            onDismiss={this.toggleModal}
            dragOptions={false}
            styles={{ main: { width: '80%', height: '90%' }, }}
          >

            <IconButton
              styles={{
                root: {
                  float: 'right',
                  zIndex: 1
                },
              }}
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel='Close popup modal'
              onClick={this.toggleModal}
            />
            <Pivot className='pivot-response'>
              {pivotItems}
            </Pivot>
          </Modal>
        }
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
      </div >
    );
  }
}

function mapStateToProps(state: any) {
  return {
    graphResponse: state.graphResponse,
    theme: state.theme,
    mode: state.graphExplorerMode,
    scopes: state.scopes.data,
    sampleQuery: state.sampleQuery,
    mobileScreen: !!state.sidebarProperties.mobileScreen
  };
}

// @ts-ignore
const WithIntl = injectIntl(QueryResponse);
export default connect(mapStateToProps)(WithIntl);

