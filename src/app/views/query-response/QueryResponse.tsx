import {
  Announced, Dialog, DialogFooter, DialogType,
  DefaultButton, FontSizes, IconButton,
  Modal, Pivot, PivotItem
} from '@fluentui/react';
import { Resizable } from 're-resizable';
import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';

import {
  IQueryResponseProps
} from '../../../types/query-response';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { expandResponseArea } from '../../services/actions/response-expanded-action-creator';
import { translateMessage } from '../../utils/translate-messages';
import { copy } from '../common/copy';
import { getPivotItems, onPivotItemClick } from './pivot-items/pivot-items';
import './query-response.scss';
import { IRootState } from '../../../types/root';
import { CopyButton } from '../common/copy/CopyButton';
import { convertVhToPx } from '../common/dimensions/dimensions-adjustment';


const QueryResponse = (props: IQueryResponseProps) => {
  const dispatch = useDispatch();
  const [showShareQueryDialog, setShareQuaryDialogStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [query] = useState('');
  const [responseHeight, setResponseHeight] = useState('610px');
  const { sampleQuery, dimensions } = useSelector((state: IRootState) => state);
  const [currentTab, setCurrentTab] = useState<string>('response-preview');

  useEffect(() => {
    setResponseHeight(convertVhToPx(dimensions.response.height, 50));
  }, [dimensions]);

  const {
    intl: { messages }
  }: any = props;

  const toggleShareQueryDialogState = () => {
    setShareQuaryDialogStatus(!showShareQueryDialog);
  };

  const toggleExpandResponse = () => {
    setShowModal(!showModal);
    dispatch(expandResponseArea(!showModal));
  };

  const handleCopy = () => {
    copy('share-query-text');
    trackCopyEvent();
  };

  const trackCopyEvent = () => {
    const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
      {
        ComponentName: componentNames.SHARE_QUERY_COPY_BUTTON,
        QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`
      });
  }

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    onPivotItemClick(sampleQuery, pivotItem);
    if(pivotItem.props.itemKey !== 'expand-response') {
      setCurrentTab(pivotItem.props.itemKey!);
    }
    toggleModal(pivotItem);
  };

  const toggleModal = (event: any) => {
    const { key } = event;
    if (key && key.includes('expand')) {
      toggleExpandResponse();
    }
  };

  const onModalPivotItemClicked = (pivotItem? : PivotItem) => {
    if(!pivotItem){ return ;}
    setCurrentTab(pivotItem.props.itemKey!);
    onPivotItemClick(sampleQuery, pivotItem);
  };

  return (
    <>
      <Resizable
        style={{
          marginBottom: 10,
          marginTop: 10
        }}
        bounds={'window'}
        maxHeight={810}
        minHeight={350}
        size={{
          height: responseHeight,
          width: '100%'
        }}
        enable={{
          bottom: false
        }}
      >
        <div className='query-response' style={{
          minHeight: 350,
          height: '100%'
        }}>

          <Pivot overflowBehavior='menu'
            overflowAriaLabel={translateMessage('More items')}
            onLinkClick={handlePivotItemClick}
            className={'pivot-response'}
            selectedKey={currentTab}
          >
            {getPivotItems()}
            <PivotItem
              headerText='Expand'
              key='expand'
              itemIcon='MiniExpandMirrored'
              itemKey='expand-response'
              ariaLabel={translateMessage('Expand response')}
              title={translateMessage('Expand response')}
            />
          </Pivot>
        </div>
      </Resizable>
      <Announced message={showModal ? translateMessage('Response area expanded') : ''} />
      {
        // @ts-ignore
        <Modal
          isOpen={showModal}
          onDismiss={toggleExpandResponse}
          styles={{ main: { width: '80%', height: '90%' } }}
        >
          <IconButton
            styles={{
              root: {
                float: 'right',
                zIndex: 1
              }
            }}
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel={translateMessage('Close expanded response area')}
            onClick={toggleExpandResponse}
          />
          <Pivot className='pivot-response'
            onLinkClick={(pivotItem) => onModalPivotItemClicked(pivotItem)}
            selectedKey={currentTab}>
            {getPivotItems()}
          </Pivot>
        </Modal>
      }
      <Dialog
        hidden={showShareQueryDialog}
        onDismiss={toggleShareQueryDialogState}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Share Query',
          isMultiline: true,
          subText: messages['Share Query Message']
        }}
      >
        <textarea
          style={{
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: FontSizes.xSmall,
            width: '100%',
            height: 63,
            overflowY: 'scroll',
            resize: 'none',
            color: 'black'
          }}
          id='share-query-text'
          className='share-query-params'
          defaultValue={query}
          aria-label={translateMessage('Share Query')}
        />
        <DialogFooter>
          <CopyButton handleOnClick={handleCopy} isIconButton={false} />
          <DefaultButton
            text={messages.Close}
            onClick={toggleShareQueryDialogState}
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default injectIntl(QueryResponse);
