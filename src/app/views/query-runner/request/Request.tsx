import {
  getId,
  Icon,
  Pivot,
  PivotItem,
  TooltipHost,
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { IRequestComponent } from '../../../../types/request';
import { Monaco } from '../../common/monaco/Monaco';
import { Auth } from './auth';
import { RequestHeaders } from './headers';
import { Permission } from './permissions';
import './request.scss';

export class Request extends Component<IRequestComponent, any> {
  constructor(props: IRequestComponent) {
    super(props);
  }

  private getPivotItems = () => {
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
        itemKey='request-body' // To be used to construct component name for telemetry data
        onRenderItemLink={this.getTooltipDisplay}
        title={messages['request body']}
        headerText={messages['request body']}
      >
        <Monaco
          body={sampleQuery.sampleBody}
          onChange={(value) => handleOnEditorChange(value)} />
      </PivotItem>,
      <PivotItem
        key='request-headers'
        itemIcon='FileComment'
        itemKey='request-headers'
        onRenderItemLink={this.getTooltipDisplay}
        title={messages['request header']}
        headerText={messages['request header']}
      >
        <RequestHeaders />
      </PivotItem>,
      <PivotItem
        key='permissions'
        itemIcon='AzureKeyVault'
        itemKey='modify-permissions'
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
          itemKey='access-token'
          onRenderItemLink={this.getTooltipDisplay}
          title={messages['Access Token']}
          headerText={messages['Access Token']}>
          <Auth />
        </PivotItem>
      );
    }

    return pivotItems;
  };

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

  public render() {
    const requestPivotItems = this.getPivotItems();

    return (

      <div className='request-editors'>
        <Pivot
          onLinkClick={this.onPivotItemClick}
          styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
        >
          {requestPivotItems}
        </Pivot>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    mode: state.graphExplorerMode,
    sampleBody: state.sampleQuery.sampleBody,
    theme: state.theme,
    mobileScreen: !!state.sidebarProperties.mobileScreen,
  };
}

// @ts-ignore
const IntlRequest = injectIntl(Request);
export default connect(mapStateToProps, null)(IntlRequest);
