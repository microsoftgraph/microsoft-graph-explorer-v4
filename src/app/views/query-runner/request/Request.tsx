import {
  getId,
  Icon,
  Pivot,
  PivotItem,
  TooltipHost
} from '@fluentui/react';
import { Resizable } from 're-resizable';
import React, { Component, CSSProperties } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { IRequestComponent } from '../../../../types/request';
import { IRootState } from '../../../../types/root';
import { setDimensions } from '../../../services/actions/dimensions-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { convertPxToVh, convertVhToPx } from '../../common/dimensions-adjustment';
import { Auth } from './auth';
import { RequestBody } from './body';
import FeedbackForm from './feedback/FeedbackForm';
import { RequestHeaders } from './headers';
import { Permission } from './permissions';
import './request.scss';

export class Request extends Component<IRequestComponent, any> {
  constructor(props: IRequestComponent) {
    super(props);
    this.state = {
      enableShowSurvey: false,
      selectedPivot: 'request-body'
    }
  }

  private toggleCustomSurvey = (show: boolean = false) => {
    this.setState({ enableShowSurvey: show });
  }

  private getPivotItems = (height: string) => {
    const {
      handleOnEditorChange,
      mode,
      intl: { messages }
    }: any = this.props;

    const heightAdjustment = 55;
    const containerStyle: CSSProperties = {
      height: convertVhToPx(height, heightAdjustment),
      overflowY: 'hidden',
      overflowX: 'hidden',
      borderBottom: '1px solid #ddd'
    };

    const pivotItems = [
      <PivotItem
        key='request-body'
        itemIcon='Send'
        itemKey='request-body' // To be used to construct component name for telemetry data
        onRenderItemLink={this.getTooltipDisplay}
        ariaLabel={messages['request body']}
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
        ariaLabel={messages['request header']}
        title={messages['request header']}
        headerText={messages['request header']}
      >
        <div style={containerStyle}>
          <RequestHeaders />
        </div>
      </PivotItem>,
      <PivotItem
        key='modify-permissions'
        itemIcon='AzureKeyVault'
        itemKey='modify-permissions'
        onRenderItemLink={this.getTooltipDisplay}
        ariaLabel={translateMessage('permissions preview')}
        title={translateMessage('permissions preview')}
        headerText={messages['modify permissions']}
      >
        <div style={containerStyle}>
          <Permission />
        </div>
      </PivotItem>
    ];
    if (mode === Mode.Complete) {
      pivotItems.push(
        <PivotItem
          key='access-token'
          itemIcon='AuthenticatorApp'
          itemKey='access-token'
          onRenderItemLink={this.getTooltipDisplay}
          ariaLabel={translateMessage('Access Token')}
          title={translateMessage('Access Token')}
          headerText={translateMessage('Access Token')}>
          <div style={containerStyle}>
            <Auth />
          </div>
        </PivotItem>,
      );
    }
    pivotItems.push(
      <PivotItem
        key='feedback'
        itemIcon='HeartFill'
        itemKey='feedback'
        onRenderItemLink={this.getTooltipDisplay}
        ariaLabel={translateMessage('Feedback')}
        title={translateMessage('Feedback')}
        headerText={translateMessage('Feedback')}
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
      this.toggleCustomSurvey(true);
      this.setState({ selectedPivot: 'request-body' })
    } else {
      this.setState({ selectedPivot: key })
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
    const heightInPx = requestHeight.replace('px', '').trim();
    const requestHeightInVh = convertPxToVh(parseFloat(heightInPx)).toString();
    const maxDeviceVerticalHeight = 90;
    const dimen = { ...this.props.dimensions };
    dimen.request.height = requestHeightInVh;
    const response = maxDeviceVerticalHeight - parseFloat(requestHeightInVh.replace('vh', ''));
    dimen.response.height = response + 'vh';
    this.props.actions!.setDimensions(dimen);
  };


  public render() {
    const { dimensions } = this.props;
    const requestPivotItems = this.getPivotItems(dimensions.request.height);
    const { selectedPivot } = this.state;
    const pivot = selectedPivot.replace('.$', '');
    const minHeight = 60;
    const maxHeight = 800;
    return (
      <>
        <Resizable
          style={{
            border: 'solid 1px #ddd',
            marginBottom: 10
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
            height: 'inherit',
            width: '100%'
          }}
          enable={{
            bottom: true
          }}
        >
          <div className='query-request'>
            <Pivot
              overflowBehavior='menu'
              onLinkClick={this.handlePivotItemClick}
              className='pivot-request'
              selectedKey={pivot}
            >
              {requestPivotItems}
            </Pivot>
          </div>
        </Resizable>
        <FeedbackForm activated={this.state.enableShowSurvey} dismissSurvey={this.toggleCustomSurvey} />
      </>
    );
  }
}

function mapStateToProps(
  { graphExplorerMode, sampleQuery, theme, sidebarProperties, dimensions }: IRootState) {
  return {
    mode: graphExplorerMode,
    sampleBody: sampleQuery.sampleBody,
    theme,
    mobileScreen: !!sidebarProperties.mobileScreen,
    dimensions
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({
      setDimensions
    }, dispatch)
  };
}

// @ts-ignore
const IntlRequest = injectIntl(Request);
export default connect(mapStateToProps, mapDispatchToProps)(IntlRequest);
