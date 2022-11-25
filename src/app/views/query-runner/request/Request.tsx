import {
  FontSizes,
  Pivot,
  PivotItem,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { useState, CSSProperties, lazy, Suspense } from 'react';
import { Resizable } from 're-resizable';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { setDimensions } from '../../../services/actions/dimensions-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { convertPxToVh, convertVhToPx } from '../../common/dimensions/dimensions-adjustment';
import { RequestBody } from './body';
import './request.scss';

const Permission = lazy(() => import('./permissions'));
const Auth = lazy(() => import('./auth'));
const RequestHeaders = lazy(() => import('./headers'));


const Request = (props: any) => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedPivot, setSelectedPivot] = useState('request-body');
  const { graphExplorerMode: mode, dimensions } = useAppSelector((state) => state);
  const pivot = selectedPivot.replace('.$', '');
  const minHeight = 60;
  const maxHeight = 800;

  const {
    handleOnEditorChange,
    intl: { messages }
  }: any = props;

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
        ariaLabel={messages['request body']}
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
        ariaLabel={messages['request header']}
        headerText={messages['request header']}
        headerButtonProps={{
          'aria-controls': 'request-header-tab'
        }}
      >
        <Suspense fallback={<Spinner size={SpinnerSize.large} />}>
          <div style={containerStyle} id={'request-header-tab'}>
            <RequestHeaders />
          </div>
        </Suspense>
      </PivotItem>,
      <PivotItem
        key='modify-permissions'
        itemIcon='AzureKeyVault'
        itemKey='modify-permissions'
        ariaLabel={translateMessage('modify permissions')}
        headerText={messages['modify permissions']}
        headerButtonProps={{
          'aria-controls': 'permission-tab'
        }}
      >
        <Suspense fallback={<Spinner size={SpinnerSize.large} />}>
          <div style={containerStyle} id={'permission-tab'}>
            <Permission />
          </div>
        </Suspense>
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
          <Suspense fallback={<Spinner size={SpinnerSize.large} />}>
            <div style={containerStyle} id={'access-token-tab'}>
              <Auth />
            </div>
          </Suspense>
        </PivotItem>,
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
    const { sampleQuery }: any = props;
    if (tabKey) {
      telemetry.trackTabClickEvent(tabKey, sampleQuery);
    }
  };

  const setRequestAndResponseHeights = (requestHeight: string) => {
    const heightInPx = requestHeight.replace('px', '').trim();
    const requestHeightInVh = convertPxToVh(parseFloat(heightInPx)).toString();
    const maxDeviceVerticalHeight = 90;
    const dimen = { ...props.dimensions };
    dimen.request.height = requestHeightInVh;
    const response = maxDeviceVerticalHeight - parseFloat(requestHeightInVh.replace('vh', ''));
    dimen.response.height = response + 'vh';
    dispatch(setDimensions(dimen));
  };

  return (
    <>
      <Resizable
        style={{
          border: 'solid 1px #ddd'
        }}
        onResize={(e: any, direction: any, ref: any) => {
          if (ref && ref.style && ref.style.height) {
            setRequestAndResponseHeights(ref.style.height);
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

const IntlRequest = injectIntl(Request);
export default IntlRequest;
