import {
  Announced, Dialog, DialogFooter, DialogType,
  DefaultButton, FontSizes, getId, Icon, IconButton,
  Modal, Pivot, PivotItem, PrimaryButton, TooltipHost, ITheme, getTheme, ChoiceGroup
} from '@fluentui/react';
import { Resizable } from 're-resizable';
import React, { useEffect, useState } from 'react';
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
import { convertVhToPx } from '../common/dimensions-adjustment';
import { createShareLink } from '../common/share';
import { getPivotItems, onPivotItemClick } from './pivot-items/pivot-items';
import './query-response.scss';
import { IRootState } from '../../../types/root';
import { queryResponseStyles } from './queryResponse.styles';
import { availableOptions } from './queryResponseUtils/overFlowUtils'

const QueryResponse = (props: IQueryResponseProps) => {
  const dispatch = useDispatch();

  const [showShareQueryDialog, setShareQuaryDialogStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');
  const [responseHeight, setResponseHeight] = useState('610px');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { dimensions, sampleQuery } = useSelector((state: IRootState) => state);
  const [itemChooserDialogState, hideResponseItemsDialog] = useState(false);




  const setPivotItems = () => {
    const pivotItems_ = getPivotItems();
    const pivotItemsToHide : any = [];

    if(windowWidth < 1320){
      pivotItemsToHide.push(pivotItems_[4]);
      pivotItems_.pop();
    }

    if(windowWidth < 1160 ){
      pivotItemsToHide.push(pivotItems_[3]);
      pivotItems_.pop();
    }

    if(windowWidth < 700){
      pivotItemsToHide.push(pivotItems_[2]);
      pivotItems_.pop();
    }

    if(windowWidth < 580){
      pivotItemsToHide.push(pivotItems_[1]);
      pivotItems_.pop();
    }
    return [ pivotItems_, pivotItemsToHide ];
  }
  const [pivotItems , abstractedPivotItems] = setPivotItems();

  const [ pivotItemsToRender, setPivotItemsToRender ] = useState(pivotItems);
  const [ pivotItemsToAbstract, setpivotItemsToAbstract ] = useState(abstractedPivotItems);





  const currentTheme: ITheme = getTheme();
  const pivotResponseStyle = queryResponseStyles(currentTheme).pivotResponse;
  const pivotResponseTabStyle = queryResponseStyles(currentTheme).pivotResponseTabletSize;
  let isTabletSize : boolean = (windowWidth <= 1320) ? true : false;

  const {
    intl: { messages },
  }: any = props;



  const setOverFlowOptions = () : any => {
    // eslint-disable-next-line no-shadow
    const optionItemsToSet: any = [];

    if(pivotItemsToAbstract.length > 0){

      for(const pivotItem of pivotItemsToAbstract){
        const { key} = pivotItem;

        for(const availableOption of availableOptions ){
          if(availableOption.key_ === key){
            optionItemsToSet.push(availableOption);
            continue;
          }
        }

      }

    }
    return optionItemsToSet;
  }

  const optionItemsToSet = setOverFlowOptions();
  const [options, setOptions] = useState(optionItemsToSet);




  useEffect(() => {
    setResponseHeight(convertVhToPx(dimensions.response.height, 50));
    window.addEventListener("resize", handleWindowResize, false);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [dimensions, windowWidth]);


  const handleWindowResize = () => {
    const currentWindowWidth = window.innerWidth;
    if(currentWindowWidth <= 1320){
      isTabletSize = true;
    }
    else{
      isTabletSize = false;
    }
    setWindowWidth(currentWindowWidth);
    setPivotItemsToRender(pivotItems);
    setpivotItemsToAbstract(abstractedPivotItems);
  }

  const toggleShareQueryDialogState = () => {
    setShareQuaryDialogStatus(!showShareQueryDialog);
  };

  const toggleExpandResponse = () => {
    setShowModal(!showModal);
    dispatch(expandResponseArea(!showModal));
  };

  const handleCopy = () => {
    copy('share-query-text').then(() => toggleShareQueryDialogState());
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

  const modelProps = {
    isBlocking: false,
    styles: {main: { maxWidth: 450}}
  }

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Choose Item To Render',
    ariaLabel:'More items'
  }

  const renderOverflowIcon = () => {
    //show the dialog items
    return(
      <PivotItem
        itemIcon='More'
        itemKey='expand-more'
        onRenderItemLink={renderItemLink}
      >

          <Dialog
            hidden={itemChooserDialogState}
            onDismiss={() => toggleItemChooserDialogState()}
            dialogContentProps={dialogContentProps}
            modalProps={modelProps}
          >
            <ChoiceGroup options={options} onChange={(event, selectedItem) => handleOnChange(selectedItem)} />
            <DialogFooter>
              <DefaultButton
                text={messages.Close}
                onClick={() =>  toggleItemChooserDialogState()}
              />
            </DialogFooter>
          </Dialog>

      </PivotItem>
    )
  }


  const handleOnChange = (selectedItem : any) => {
    const { key_ } = selectedItem;  //selected item key
    const currentRenderedPivots = new Array(); //current rendered pivots
    currentRenderedPivots.push(...pivotItemsToRender);
    const poppedItem = currentRenderedPivots.pop();
    // add the item whose key resembles the selectedItem key to the pivotITemsToRender
    const newPivotToRender = getPivotItemToRender(key_, poppedItem);
    currentRenderedPivots.push(newPivotToRender);
    setPivotItemsToRender(currentRenderedPivots);

    const { key } = poppedItem;  //get key of popped item so we can look for it in options
    const currentOverflowOptions = new Array();
    currentOverflowOptions.push(...options);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const poppedOption = currentOverflowOptions.pop();
    const newOverflowItem = getNewOverflowItem(key);
    currentOverflowOptions.push(newOverflowItem);
    setOptions(currentOverflowOptions);
  }

  const getNewOverflowItem = (key: string) => {

    for(const availableOption of availableOptions) {
      if(availableOption.key === key){
        return availableOption;
      }
    }
  }

  const getPivotItemToRender = (itemKey : string, thePoppedItem: any) => {
    const currentOverflowOptions = [];
    currentOverflowOptions.push(...pivotItemsToAbstract);

    if(currentOverflowOptions.length > 0) {
      for(const abstractedPivotItem of currentOverflowOptions) {
        const { key } = abstractedPivotItem;

        if(key === itemKey) {
          //also remove it from pivotItemsToAbstract,
          const newAbstractedItems = currentOverflowOptions.filter( item =>{ return ( item !== abstractedPivotItem) }  );
          newAbstractedItems.push(thePoppedItem);
          setpivotItemsToAbstract(newAbstractedItems);

          return abstractedPivotItem;
        }
      }
    }

  }

  const toggleItemChooserDialogState = () => {
    let hidden = itemChooserDialogState;
    hidden = !hidden;
    hideResponseItemsDialog(hidden);
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
          <Pivot onLinkClick={handlePivotItemClick} className='pivot-response' styles={{root: isTabletSize ? pivotResponseTabStyle : pivotResponseStyle}} >
            {pivotItemsToRender}
            {isTabletSize && renderOverflowIcon()}
            <PivotItem
              headerText='Share'
              key='share'
              itemIcon='Share'
              itemKey='share-query' // To be used to construct component name for telemetry data
              ariaLabel={translateMessage('Share Query Message')}
              title={translateMessage('Share Query Message')}
              onRenderItemLink={renderItemLink}
            ></PivotItem>
            <PivotItem
              headerText='Expand'
              key='expand'
              itemIcon='MiniExpandMirrored'
              itemKey='expand-response'
              ariaLabel={translateMessage('Expand response')}
              title={translateMessage('Expand response')}
              onRenderItemLink={renderItemLink}
            ></PivotItem>
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
          aria-label={translateMessage('Share Query')}
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
