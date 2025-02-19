import {
  Announced,
  FontSizes,
  getTheme,
  IconButton,
  ITheme,
  Modal,
  Pivot,
  PivotItem
} from '@fluentui/react';
import { Resizable } from 're-resizable';
import { CSSProperties, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { telemetry } from '../../../telemetry';
import { IQuery } from '../../../types/query-runner';
import { expandResponseArea } from '../../services/slices/response-area-expanded.slice';
import { translateMessage } from '../../utils/translate-messages';
import { convertVhToPx } from '../common/dimensions/dimensions-adjustment';
import { GetPivotItems } from './pivot-items/pivot-items';
import './query-response.scss';
import { queryResponseStyles } from './queryResponse.styles';

const QueryResponse = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [responseHeight, setResponseHeight] = useState('610px');
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const dimensions = useAppSelector((state) => state.dimensions);
  const snippets = useAppSelector((state) => state.snippets);
  const [currentTab, setCurrentTab] = useState<string>('response-preview');
  const currentTheme: ITheme = getTheme();
  const { modalStyles, modalPivotStyles } = queryResponseStyles(currentTheme);

  useEffect(() => {
    setResponseHeight(convertVhToPx(dimensions.response.height, 220));
  }, [dimensions]);

  const flexQueryElement: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
    marginTop: -13
  };

  const toggleExpandResponse = () => {
    setShowModal(!showModal);
    dispatch(expandResponseArea(!showModal));
  };

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    onPivotItemClick(sampleQuery, pivotItem);
    if (pivotItem.props.itemKey !== 'expand-response') {
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

  const onModalPivotItemClicked = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    setCurrentTab(pivotItem.props.itemKey!);
    onPivotItemClick(sampleQuery, pivotItem);
  };

  const onScroll = () => {
    const queryResponseElements =
      document.getElementsByClassName('query-response');
    if (queryResponseElements && queryResponseElements.length > 0) {
      queryResponseElements[0].scrollTop = 0;
    }
  };

  const onPivotItemClick = (query: IQuery, item?: PivotItem) => {
    if (!item) {
      return;
    }
    const tabKey = item.props.itemKey;
    if (tabKey) {
      telemetry.trackTabClickEvent(tabKey, query);
      if (snippets.snippetTab) {
        telemetry.trackTabClickEvent(snippets.snippetTab, query);
      }
    }
  };

  return (
    <div style={flexQueryElement}>
      <Resizable
        style={{
          marginBottom: 20,
          marginTop: 10,
          flex: 1
        }}
        bounds={'window'}
        minHeight={350}
        size={{
          height: responseHeight,
          width: '100%'
        }}
        enable={{
          bottom: false
        }}
      >
        <div
          className='query-response'
          style={{
            minHeight: 350,
            height: '100%',
            flex: 1
          }}
          onScroll={onScroll}
        >
          <Pivot
            overflowBehavior='menu'
            overflowAriaLabel={translateMessage('More response items')}
            onLinkClick={handlePivotItemClick}
            className={'pivot-response'}
            selectedKey={currentTab}
            styles={{ text: { fontSize: FontSizes.size14 } }}
          >
            {GetPivotItems()}
            <PivotItem
              headerText={translateMessage('Expand')}
              key='expand'
              itemIcon='MiniExpandMirrored'
              itemKey='expand-response'
              ariaLabel={translateMessage('Expand response')}
              title={translateMessage('Expand response')}
            />
          </Pivot>
        </div>
      </Resizable>
      <Announced
        message={showModal ? translateMessage('Response area expanded') : ''}
      />
      {
        // @ts-ignore
        <Modal
          isOpen={showModal}
          onDismiss={toggleExpandResponse}
          styles={modalStyles}
          layerProps={{ eventBubblingEnabled: true }}
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
          <Pivot
            className='pivot-response'
            onLinkClick={(pivotItem) => onModalPivotItemClicked(pivotItem)}
            overflowBehavior='menu'
            overflowAriaLabel={translateMessage('More items')}
            selectedKey={currentTab}
            styles={modalPivotStyles}
          >
            {GetPivotItems()}
          </Pivot>
        </Modal>
      }
    </div>
  );
};

export default QueryResponse;
