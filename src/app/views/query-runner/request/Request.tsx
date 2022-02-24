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
        headerButtonProps={{
          'aria-controls': 'request-body-tab'
        }}
      >
        <div style={containerStyle} id={'request-body-tab'}>
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
        headerButtonProps={{
          'aria-controls': 'request-header-tab'
        }}
      >
        <div style={containerStyle} id={'request-header-tab'}>
          <RequestHeaders />
        </div>
      </PivotItem>,
      <PivotItem
        key='modify-permissions'
        itemIcon='AzureKeyVault'
        itemKey='modify-permissions'
        onRenderItemLink={this.getTooltipDisplay}
        ariaLabel={translateMessage('modify permissions')}
        title={translateMessage('permissions preview')}
        headerText={messages['modify permissions']}
        headerButtonProps={{
          'aria-controls': 'permission-tab'
        }}
      >
        <div style={containerStyle} id={'permission-tab'}>
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
          headerText={translateMessage('Access Token')}
          headerButtonProps={{
            'aria-controls': 'access-token-tab'
          }}>
          <div style={containerStyle} id={'access-token-tab'}>
            <Auth />
          </div>
        </PivotItem>,
      );
    }

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
    this.setState({ selectedPivot: pivotItem.props.itemKey });
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
          onResizeStop={(e: any, direction: any, ref: any) => {
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
      </>
    );
  }
}

function mapStateToProps(
  { graphExplorerMode, sampleQuery, theme, sidebarProperties, dimensions, profile }: IRootState) {
  return {
    mode: graphExplorerMode,
    sampleBody: sampleQuery.sampleBody,
    theme,
    mobileScreen: !!sidebarProperties.mobileScreen,
    dimensions,
    profile: profile?.profileType
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
