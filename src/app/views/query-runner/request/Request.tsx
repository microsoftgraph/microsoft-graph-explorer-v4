import {
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
import { IRootState } from '../../../../types/root';
import { setDimensions } from '../../../services/actions/dimensions-action-creator';
import { PERMISSION_MODE_TYPE } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { convertVhToPx } from '../../common/dimensions-adjustment';
import { Auth } from './auth';
import { RequestBody } from './body';
import { RequestHeaders } from './headers';
import { Permission } from './permissions';
import './request.scss';

export class Request extends Component<IRequestComponent, any> {
  constructor(props: IRequestComponent) {
    super(props);
  }

  private getPivotItems = (height: string) => {
    const {
      handleOnEditorChange,
      mode,
      intl: { messages },
      permissionModeType,
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
        headerText={permissionModeType === PERMISSION_MODE_TYPE.User ? messages['modify permissions'] : messages['required permissions']}
      >
        <div style={containerStyle}>
          <Permission />
        </div>
      </PivotItem>,
    ];

    if ((mode === Mode.Complete) && (permissionModeType === PERMISSION_MODE_TYPE.User)) {
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
        </PivotItem>
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
          onLinkClick={this.onPivotItemClick}
          styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
        >
          {requestPivotItems}
        </Pivot>
      </Resizable>
    );
  }
}

function mapStateToProps({ graphExplorerMode, sampleQuery, theme, sidebarProperties, dimensions, permissionModeType }: IRootState) {
  return {
    mode: graphExplorerMode,
    sampleBody: sampleQuery.sampleBody,
    theme,
    mobileScreen: !!sidebarProperties.mobileScreen,
    dimensions,
    permissionModeType
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
