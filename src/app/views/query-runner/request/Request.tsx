import { makeFloodgate } from '@ms-ofb/officebrowserfeedbacknpm/Floodgate';
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
      enableShowSurvey: false,
      survey: undefined
    }
    this.initializeFeedback();
  }

  private initializeFeedback() {
    const floodgateObject = makeFloodgate();
    loadAndInitialize(floodgateObject, this.onSurveyActivated).then(() => {
      this.setState({
        officeBrowserFeedback: floodgateObject,
        enableShowSurvey: true,
      })
    });
  }

  private showCustomSurvey() {
    const customSurvey: OfficeBrowserFeedback.ICustomSurvey = {
      campaignId: 'e24778c9-85ae-499b-b424-1f3a194cd6c7',
      commentQuestion: translateMessage('commentQuestion'),
      isZeroBased: false,
      promptQuestion: translateMessage('promptQuestion'),
      promptNoButtonText: translateMessage('promptNoButtonText'),
      promptYesButtonText: translateMessage('promptYesButtonText'),
      ratingQuestion: translateMessage('ratingQuestion'),
      ratingValuesAscending: [
        translateMessage("Extremely difficult"),
        translateMessage("Slightly difficult"),
        translateMessage("Neither easy nor difficult"),
        translateMessage("Slightly easy"),
        translateMessage("Extremely easy")],
      showEmailRequest: true,
      showPrompt: false,
      surveyType: 2,
      title: translateMessage('title'),
    }

    this.state.officeBrowserFeedback.floodgate.showCustomSurvey(customSurvey).catch(
      (error: any) => { throw error; }
    );
  }

  private onSurveyActivated = (launcher: any, survey: any) => {
    this.setState({ survey });
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
        key='permissions'
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
      </PivotItem>,
    ];

    if (mode === Mode.Complete) {
      pivotItems.push(
        <PivotItem
          key='auth'
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
      this.showCustomSurvey();
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
        <div className='query-request'>
          <Pivot
            onLinkClick={this.handlePivotItemClick}
            className='pivot-request'
          >
            {requestPivotItems}
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
          </Pivot>
        </div>

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
      setDimensions,
    }, dispatch)
  };
}

// @ts-ignore
const IntlRequest = injectIntl(Request);
export default connect(mapStateToProps, mapDispatchToProps)(IntlRequest);
