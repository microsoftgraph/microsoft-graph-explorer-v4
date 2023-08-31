import {
  FontSizes,
  Pivot,
  PivotItem
} from '@fluentui/react';
import { Resizable } from 're-resizable';
import { CSSProperties, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Direction } from 're-resizable/lib/resizer';

import { AppDispatch, useAppSelector } from '../../../../store';
import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { setDimensions } from '../../../services/actions/dimensions-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { convertPxToVh, convertVhToPx } from '../../common/dimensions/dimensions-adjustment';
import { Auth, Permissions, RequestHeaders } from '../../common/lazy-loader/component-registry';
import { RequestBody } from './body';
import './request.scss';

interface RequestProps {
  handleOnEditorChange: (value?: string) => void;
  sampleQuery: IQuery
}

const Request = ({ handleOnEditorChange, sampleQuery }: RequestProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedPivot, setSelectedPivot] = useState('request-body');
  const { graphExplorerMode: mode, dimensions, sidebarProperties } = useAppSelector((state) => state);
  const pivot = selectedPivot.replace('.$', '');
  const minHeight = 60;
  const maxHeight = 800;

  useEffect(() => {
    if (sidebarProperties && sidebarProperties.mobileScreen) {
      window.addEventListener('resize', resizeHandler);
    }
    else {
      window.removeEventListener('resize', resizeHandler);
    }
  }, [sidebarProperties.mobileScreen])

  const getPivotItems = (height: string) => {

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
        ariaLabel={translateMessage('request body')}
        headerText={translateMessage('request body')}
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
        ariaLabel={translateMessage('request header')}
        headerText={translateMessage('request header')}
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
        ariaLabel={translateMessage('modify permissions')}
        headerText={translateMessage('modify permissions')}
        headerButtonProps={{
          'aria-controls': 'permission-tab'
        }}
      >
        <div style={containerStyle} id={'permission-tab'}>
          <Permissions />
        </div>
      </PivotItem>
    ];
    if (mode === Mode.Complete) {
      pivotItems.push(
        <PivotItem
          key='access-token'
          itemIcon='AuthenticatorApp'
          itemKey='access-token'
          ariaLabel={translateMessage('Access Token')}
          headerText={translateMessage('Access Token')}
          headerButtonProps={{
            'aria-controls': 'access-token-tab'
          }}>
          <div style={containerStyle} id={'access-token-tab'}>
            <Auth />
          </div>
        </PivotItem>
      );
    }

    return pivotItems;
  }

  const requestPivotItems = getPivotItems(dimensions.request.height);

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    onPivotItemClick(pivotItem);
    setSelectedPivot(pivotItem.props.itemKey!);
  }

  const onPivotItemClick = (item?: PivotItem) => {
    if (!item) { return; }
    const tabKey = item.props.itemKey;
    if (tabKey) {
      telemetry.trackTabClickEvent(tabKey, sampleQuery);
    }
  };

  const setRequestAndResponseHeights = (requestHeight: string) => {
    const heightInPx = requestHeight.replace('px', '').trim();
    const requestHeightInVh = convertPxToVh(parseFloat(heightInPx)).toString();
    const maxDeviceVerticalHeight = 90;
    const dimen = { ...dimensions };
    dimen.request.height = requestHeightInVh;
    const response = maxDeviceVerticalHeight - parseFloat(requestHeightInVh.replace('vh', ''));
    dimen.response.height = response + 'vh';
    dispatch(setDimensions(dimen));
  };

  // Resizable element does not update it's size when the browser window is resized.
  // This is a workaround to reset the height
  const resizeHandler = () => {
    const resizable = document.getElementsByClassName('request-resizable');
    if (resizable && resizable.length > 0) {
      const resizableElement = resizable[0] as HTMLElement;
      if (resizableElement && resizableElement.style && resizableElement.style.height) {
        resizableElement.style.height = '';
      }
    }
  }

  const handleResize = (event_: MouseEvent | TouchEvent, direction_: Direction,
    elementRef: HTMLElement): void => {
    if (elementRef && elementRef.style && elementRef.style.height) {
      setRequestAndResponseHeights(elementRef.style.height);
    }
  };

  return (
    <>
      <Resizable
        style={{
          border: 'solid 1px #ddd'
        }}
        onResize={handleResize}
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
        className='request-resizable'
      >
        <div className='query-request'>
          <Pivot
            overflowBehavior='menu'
            overflowAriaLabel={translateMessage('More items')}
            onLinkClick={handlePivotItemClick}
            className='pivot-request'
            selectedKey={pivot}
            styles={{ text: { fontSize: FontSizes.size14 } }}
          >
            {requestPivotItems}
          </Pivot>
        </div>
      </Resizable>
    </>
  );
}

export default Request;
