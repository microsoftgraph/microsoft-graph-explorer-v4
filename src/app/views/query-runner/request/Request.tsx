import {
  getId,
  Icon,
  Pivot,
  PivotItem,
  TooltipHost,
} from 'office-ui-fabric-react';
import { Resizable } from 're-resizable';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { telemetry } from '../../../../telemetry';
import { TAB_CLICK_EVENT } from '../../../../telemetry/event-types';
import { Mode } from '../../../../types/enums';
import { setDimensions } from '../../../services/actions/dimensions-action-creator';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { convertVhToPx } from '../../common/dimensions-adjustment';
import { Monaco } from '../../common/monaco/Monaco';
import { Auth } from './auth';
import { RequestHeaders } from './headers';
import { Permission } from './permissions';
import './request.scss';

const Request = (props: any)  => {
  const {
    handleOnEditorChange,
    intl: { messages },
  }: any = props;

  const { graphExplorerMode: mode, sampleQuery, dimensions } = useSelector((state: any) => state);
  const { sampleBody } = sampleQuery;

  const dispatch = useDispatch();

  useEffect(() => {
    getPivotItems(dimensions.request.height);
  }, [dimensions]);

  const getPivotItems = (height: string) => {

    const pivotItems = [
      <PivotItem
        key='request-body'
        itemIcon='Send'
        onRenderItemLink={getTooltipDisplay}
        title={messages['request body']}
        headerText={messages['request body']}
      >
        <Monaco
          body={sampleBody}
          height={convertVhToPx(height, 140)}
          onChange={(value) => handleOnEditorChange(value)} />
      </PivotItem>,
      <PivotItem
        key='request-header'
        itemIcon='FileComment'
        onRenderItemLink={getTooltipDisplay}
        title={messages['request header']}
        headerText={messages['request header']}
      >
        <RequestHeaders height={height} />
      </PivotItem>,
      <PivotItem
        key='permissions'
        itemIcon='AzureKeyVault'
        onRenderItemLink={getTooltipDisplay}
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
          onRenderItemLink={getTooltipDisplay}
          title={messages['Access Token']}
          headerText={messages['Access Token']}>
          <Auth style={{ height}} />
        </PivotItem>
      );
    }

    return pivotItems;
  };

  const getTooltipDisplay = (link: any) => {
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
  };

  const onPivotItemClick = (item?: PivotItem) => {
    if (!item) {
      return;
    }
    const tabTitle = item.props.title;
    if (tabTitle) {
      trackTabClickEvent(tabTitle);
    }
  };

  const trackTabClickEvent = (tabTitle: string) => {
    const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
    telemetry.trackEvent(TAB_CLICK_EVENT, {
      ComponentName: `${tabTitle} tab`,
      QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`,
    });
  };

  const setRequestAndResponseHeights = (requestHeight: string) => {
    const dimen = { ...dimensions };
    dimen.request.height = requestHeight;
    const response = 90 - parseFloat(requestHeight.replace('vh', ''));
    dimen.response.height = response + 'vh';
    dispatch(setDimensions(dimen));
  };

  const requestPivotItems = getPivotItems(dimensions.request.height);

  return (
    <Resizable
      style={{
        border: 'solid 1px #ddd',
        marginBottom: 10,
      }}
      onResize={(e: any, direction: any, ref: any, d: any) => {
        if (ref && ref.style && ref.style.height) {
          setRequestAndResponseHeights(ref.style.height);
        }
      }}
      maxHeight={800}
      minHeight={250}
      bounds={'window'}
      size={{
      height: dimensions.request.height,
      width: '100%',
      }}
      enable={{
      bottom: true,
      }}
    >
    <Pivot onLinkClick={onPivotItemClick} styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}>
        {requestPivotItems}
    </Pivot>
</Resizable>
  );
};

// @ts-ignore
const IntlRequest = injectIntl(Request);
export default IntlRequest;
