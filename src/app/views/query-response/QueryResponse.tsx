import {
  Announced,
  DefaultButton, FontSizes, getId, Icon, IconButton,
  Modal, Pivot, PivotItem, PrimaryButton, TooltipHost
} from 'office-ui-fabric-react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Resizable } from 're-resizable';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  IQueryResponseProps
} from '../../../types/query-response';
import { translateMessage } from '../../utils/translate-messages';
import { copy } from '../common/copy';
import { convertVhToPx } from '../common/dimensions-adjustment';
import { createShareLink } from '../common/share';
import { getPivotItems, onPivotItemClick } from './pivot-items/pivot-items';
import './query-response.scss';

const QueryResponse = (props: IQueryResponseProps) => {
  const [showShareQueryDialog, setShareQuaryDialogStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');
  const [responseHeight, setResponseHeight] = useState('610px');

  const { dimensions, sampleQuery } = useSelector((state: any) => state);

  const {
    intl: { messages },
  }: any = props;


  useEffect(() => {
    setResponseHeight(convertVhToPx(dimensions.response.height, 50));
  }, [dimensions]);

  const toggleShareQueryDialogState = () => {
    setShareQuaryDialogStatus(!showShareQueryDialog);
  };

  const toggleExpandResponse = () => {
    setShowModal(!showModal);
  };

  const handleCopy = () => {
    copy('share-query-text').then(() => toggleShareQueryDialogState());
  };

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    onPivotItemClick(sampleQuery, pivotItem);
    toggleModal(pivotItem);
  };

  const handleShareQuery = () => {
    const shareableLink = createShareLink(sampleQuery);
    setQuery(shareableLink);
    toggleShareQueryDialogState();
  };

  const toggleModal = (event: any) => {
    const { key } = event;
    if (key && key.includes('expand')) {
      toggleExpandResponse();
    }
    if (key && key.includes('share')) {
      handleShareQuery();
    }
  };

  const renderItemLink = (link: any) => {
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

  return (
    <>
      <Resizable
        style={{
          marginBottom: 10,
          marginTop: 10
        }}
        maxHeight={800}
        minHeight={350}
        bounds={'window'}
        size={{
          height: responseHeight,
          width: '100%',
        }}
        enable={{
          bottom: false,
        }}
      >
        <div className='query-response' style={{
          minHeight: responseHeight,
          height: responseHeight
        }}>
          <Pivot onLinkClick={handlePivotItemClick} className='pivot-response'>
            {getPivotItems()}
            <PivotItem
              headerText='Share'
              key='share'
              itemIcon='Share'
              ariaLabel={translateMessage('Share Query Message')}
              title={translateMessage('Share Query Message')}
              onRenderItemLink={renderItemLink}
            />
            <PivotItem
              headerText='Expand'
              key='expand'
              itemIcon='MiniExpandMirrored'
              ariaLabel={translateMessage('Expand response')}
              title={translateMessage('Expand response')}
              onRenderItemLink={renderItemLink}
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
                zIndex: 1,
              },
            }}
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel={translateMessage('Close expanded response area')}
            onClick={toggleExpandResponse}
          />
          <Pivot className='pivot-response' onLinkClick={(pivotItem) => onPivotItemClick(sampleQuery, pivotItem)}>
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
          subText: messages['Share Query Message'],
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
            border: 'none',
            resize: 'none'
          }}
          id='share-query-text'
          className='share-query-params'
          defaultValue={query}
        />
        <DialogFooter>
          <PrimaryButton text={messages.Copy} onClick={handleCopy} />
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
