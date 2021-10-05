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
import { RequestHeaders } from './headers';
import { Permission } from './permissions';
import './request.scss';
import LinkItem from '../../tour/utils/LinkItem';
import { contextMenuItems, findTarget, getTargetStepIndex } from '../../tour/utils/contextHelpers';
import { toggleTourState } from '../../../services/actions/tour-action-creator';

class Request extends Component<IRequestComponent, any> {
  constructor(props: IRequestComponent) {
    super(props);
    this.selectContextItem = this.selectContextItem.bind(this);
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
        <div style={containerStyle} className='request-body-area'>
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
        <div style={containerStyle} className='request-headers-body'>
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
        <div style={containerStyle} className="request-permissions-body">
          <Permission />
        </div>
      </PivotItem>
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
          <div style={containerStyle} className="access-token-body">
            <Auth />
          </div>
        </PivotItem>
      );
    }

    return pivotItems;
  }

  private selectContextItem = (link: any) => {
    //
    console.log('Stuf');
  }

  private getTooltipDisplay(link: any) {
    return (
      <LinkItem
        style={{
          flexGrow: 1,
          textAlign: 'left',
          boxSizing: 'border-box'
        }}
        key={link.title}
        items={contextMenuItems}
        onItemClick={() => this.selectContextItem(link)}
      >
        <TooltipHost
          content={link.title}
          id={getId()}
          calloutProps={{ gapSpace: 0 }}
        >
          <Icon iconName={link.itemIcon} style={{ paddingRight: 5 }} />
          {link.headerText}
        </TooltipHost>
      </LinkItem>
    );
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
    const minHeight = 60;
    const maxHeight = 800;
    return (
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
        <Pivot
          overflowBehavior='menu'
          onLinkClick={this.onPivotItemClick}
          className="request-pivot-tab"
        >
          {requestPivotItems}
        </Pivot>
      </Resizable>
    );
  }
}

function mapStateToProps({ graphExplorerMode, sampleQuery, theme, sidebarProperties, dimensions }: IRootState) {
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
      setDimensions, toggleTourState
    }, dispatch)
  };
}

// @ts-ignore
const IntlRequest = injectIntl(Request);
export default connect(mapStateToProps, mapDispatchToProps)(IntlRequest);
