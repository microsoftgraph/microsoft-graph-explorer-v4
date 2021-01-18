import {
  getId,
  Icon,
  Pivot,
  PivotItem,
  TooltipHost,
} from 'office-ui-fabric-react';
import { Resizable } from 're-resizable';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { telemetry } from '../../../../telemetry';
import { TAB_CLICK_EVENT } from '../../../../telemetry/event-types';
import { Mode } from '../../../../types/enums';
import { IRequestComponent } from '../../../../types/request';
import { setDimensions } from '../../../services/actions/dimensions-action-creator';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { convertVhToPx } from '../../common/dimensions-adjustment';
import { Monaco } from '../../common/monaco/Monaco';
import { Auth } from './auth';
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
      sampleQuery,
      mode,
      intl: { messages },
    }: any = this.props;

    const pivotItems = [
      <PivotItem
        key='request-body'
        itemIcon='Send'
        onRenderItemLink={this.getTooltipDisplay}
        title={messages['request body']}
        headerText={messages['request body']}
      >
        <Monaco
          body={sampleQuery.sampleBody}
          height={convertVhToPx(height, 100)}
          onChange={(value) => handleOnEditorChange(value)} />
      </PivotItem>,
      <PivotItem
        key='request-header'
        itemIcon='FileComment'
        onRenderItemLink={this.getTooltipDisplay}
        title={messages['request header']}
        headerText={messages['request header']}
      >
        <RequestHeaders height={convertVhToPx(height, 60)} />
      </PivotItem>,
      <PivotItem
        key='permissions'
        itemIcon='AzureKeyVault'
        onRenderItemLink={this.getTooltipDisplay}
        title={messages['modify permissions']}
        headerText={messages['modify permissions']}
      >
        <Permission />
      </PivotItem>,
    ];

    if (mode === Mode.Complete) {
      pivotItems.push(
        <PivotItem
          key='auth'
          itemIcon='AuthenticatorApp'
          onRenderItemLink={this.getTooltipDisplay}
          title={messages['Access Token']}
          headerText={messages['Access Token']}>
          <Auth style={{ height }} />
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
    if (!item) {
      return;
    }
    const tabTitle = item.props.title;
    if (tabTitle) {
      this.trackTabClickEvent(tabTitle);
    }
  };

  private trackTabClickEvent(tabTitle: string) {
    const { sampleQuery }: any = this.props;
    const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
    telemetry.trackEvent(TAB_CLICK_EVENT, {
      ComponentName: `${tabTitle} tab`,
      QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`,
    });
  }

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

    return (
      <Resizable
        style={{
          border: 'solid 1px #ddd',
          marginBottom: 10,
        }}
        onResize={(e: any, direction: any, ref: any, d: any) => {
          if (ref && ref.style && ref.style.height) {
            this.setRequestAndResponseHeights(ref.style.height);
          }
        }}
        maxHeight={800}
        minHeight={250}
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
