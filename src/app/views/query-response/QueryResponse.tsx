import { DefaultButton, FontSizes, IconButton, Modal, Pivot, PrimaryButton } from 'office-ui-fabric-react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

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
    return nextProps.graphResponse !== this.props.graphResponse || nextState !== this.state;
  }

  public handleCopy = () => {
    copy('share-query-text')
      .then(() => this.toggleShareQueryDialogState());
  }

  public handleShareQuery = () => {
    const { sampleQuery } = this.props;
    const query = createShareLink(sampleQuery);
    this.setState({ query });
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
      verb
    }: any = this.props;

    const { showShareQueryDialog, query, showModal } = this.state;
    const { graphResponse, mode } = this.props;

    if (graphResponse) {
      body = graphResponse.body;
      headers = graphResponse.headers;
    }

    const pivotItems = getPivotItems(messages, body, verb, mode, headers);

    return (
      <div>
        <div className='query-response'>
          <IconButton onClick={this.handleShareQuery} className='share-query-btn' iconProps={{
            iconName: 'Share'
          }} />
          <IconButton onClick={this.toggleModal} className='share-query-btn' iconProps={{
            iconName: 'MiniExpandMirrored'
          }} />
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

