import { makeFloodgateFeedback } from '@ms-ofb/officebrowserfeedbacknpm';
import {
  DefaultButton,
  getId,
  Icon,
  Pivot,
  PivotItem,
  TooltipHost,
} from 'office-ui-fabric-react';
import { Resizable } from 're-resizable';
import React, { Component, CSSProperties } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { IRequestComponent } from '../../../../types/request';
import { setDimensions } from '../../../services/actions/dimensions-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { convertVhToPx } from '../../common/dimensions-adjustment';
import { Auth } from './auth';
import { RequestBody } from './body';
import { loadAndInitialize } from './feedback/feedbackWrapper';
import { RequestHeaders } from './headers';
import { Permission } from './permissions';
import './request.scss';

export class Request extends Component<IRequestComponent, any> {
  constructor(props: IRequestComponent) {
    super(props)
    this.state = {
      officeBrowserFeedback: undefined,
      enableFeedback: false,
    }
    this.setOfficeBrowserFeedbackUtility = this.setOfficeBrowserFeedbackUtility.bind(this);
    this.initializeFeedback();
  }
  initializeFeedback() {
    const floodgateObject = makeFloodgateFeedback();
    loadAndInitialize(floodgateObject).then(() => {
      this.setState({
        officeBrowserFeedback: floodgateObject,
        enableFeedback: true,
      })
    });
  }

  private setOfficeBrowserFeedbackUtility() {
    this.state.officeBrowserFeedback.multiFeedback()
      .catch((error: any) => { console.log("Multi feedback failed: " + error); })
  }

  private getPivotItems = (height: string) => {
    const {
      handleOnEditorChange,
      mode,
      intl: { messages },
    }: any = this.props;

    const heightAdjustment = 55;
    const containerStyle: CSSProperties = {
      height: convertVhToPx(height, heightAdjustment),
      overflowY: 'hidden',
      borderBottom: '1px solid #ddd'
    };

    const pivotItems = [
      <PivotItem
        key='request-body'
        itemIcon='Send'
        itemKey='request-body' // To be used to construct component name for telemetry data
        onRenderItemLink={this.getTooltipDisplay}
        title={messages['request body']}
        headerText={messages['request body']}
      >
        <div style={containerStyle}>
          <RequestBody handleOnEditorChange={handleOnEditorChange} />
        </div>
      </PivotItem>,
      <PivotItem
        key='request-headers'
        itemIcon='FileComment'
        itemKey='request-headers'
        onRenderItemLink={this.getTooltipDisplay}
        title={messages['request header']}
        headerText={messages['request header']}
      >
        <div style={containerStyle}>
          <RequestHeaders />
        </div>
      </PivotItem>,
      <PivotItem
        key='permissions'
        itemIcon='AzureKeyVault'
        itemKey='modify-permissions'
        onRenderItemLink={this.getTooltipDisplay}
        title={translateMessage('permissions preview')}
        headerText={messages['modify permissions']}
      >
        <div style={containerStyle}>
          <Permission />
        </div>
      </PivotItem>,
    ];

    if (mode === Mode.Complete) {
      pivotItems.push(
        <PivotItem
          key='auth'
          itemIcon='AuthenticatorApp'
          itemKey='access-token'
          onRenderItemLink={this.getTooltipDisplay}
          title={messages['Access Token']}
          headerText={messages['Access Token']}>
          <div style={containerStyle}>
            <Auth />
          </div>
        </PivotItem>,

      );
    }

    pivotItems.push(
      <PivotItem
        key='feedback'
        itemIcon='Heart'
        itemKey='feedback'
        onRenderItemLink={this.getTooltipDisplay}
        title={messages.Feedback}
        headerText={messages.Feedback}
      >
      </PivotItem>
    )
    return pivotItems;
  }

  private getTooltipDisplay(link: any) {
    return (
      <TooltipHost
        content={link.title}
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
      >
        <Icon iconName={link.itemIcon} style={{ paddingRight: 5 }} />
        {link.headerText}
      </TooltipHost>
    );
  }

  private handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    this.onPivotItemClick(pivotItem);
    this.toggleFeedback(pivotItem);
  }

  private toggleFeedback = (event: any) => {
    const { key } = event;
    if (key && key.includes('feedback')) {
      this.setOfficeBrowserFeedbackUtility();
    }
  }

  private onPivotItemClick = (item?: PivotItem) => {
    if (!item) { return; }
    const tabKey = item.props.itemKey;
    const { sampleQuery }: any = this.props;
    if (tabKey) {
      telemetry.trackTabClickEvent(tabKey, sampleQuery);
    }
  };

  private setRequestAndResponseHeights = (requestHeight: string) => {
    const maxDeviceVerticalHeight = 90;
    const dimen = { ...this.props.dimensions };
    dimen.request.height = requestHeight;
    const response = maxDeviceVerticalHeight - parseFloat(requestHeight.replace('vh', ''));
    dimen.response.height = response + 'vh';
    this.props.actions!.setDimensions(dimen);
  };

  public render() {
    const { dimensions } = this.props;
    const requestPivotItems = this.getPivotItems(dimensions.request.height);
    const minHeight = 60;
    const maxHeight = 800;

    return (
      <Resizable
        style={{
          border: 'solid 1px #ddd',
          marginBottom: 10,
        }}
        onResize={(e: any, direction: any, ref: any) => {
          if (ref && ref.style && ref.style.height) {
            this.setRequestAndResponseHeights(ref.style.height);
          }
        }}
        maxHeight={maxHeight}
        minHeight={minHeight}
        bounds={'window'}
        size={{
          height: this.props.dimensions.request.height,
          width: '100%',
        }}
        enable={{
          bottom: true,
        }}
      >
        <Pivot
          onLinkClick={this.handlePivotItemClick}
          styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
        >
          {requestPivotItems}
        </Pivot>
        {/* <DefaultButton text="Got Feedback"
          onClick={this.setOfficeBrowserFeedbackUtility} /> */}

      </Resizable>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    mode: state.graphExplorerMode,
    sampleBody: state.sampleQuery.sampleBody,
    theme: state.theme,
    mobileScreen: !!state.sidebarProperties.mobileScreen,
    dimensions: state.dimensions
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({
      setDimensions,
    }, dispatch)
  };
}

// @ts-ignore
const IntlRequest = injectIntl(Request);
export default connect(mapStateToProps, mapDispatchToProps)(IntlRequest);
