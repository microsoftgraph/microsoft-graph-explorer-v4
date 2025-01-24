import { CSSProperties, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { setDimensions } from '../../../services/slices/dimensions.slice';
import { translateMessage } from '../../../utils/translate-messages';
import { convertPxToVh, convertVhToPx } from '../../common/dimensions/dimensions-adjustment';
import { Auth, Permissions, RequestHeaders } from '../../common/lazy-loader/component-registry';
import { RequestBody } from './body';
import './request.scss';
import { IQuery } from '../../../../types/query-runner';
import { makeStyles, Tab, TabList, TabValue, tokens } from '@fluentui/react-components';


  interface IRequestProps {
    handleOnEditorChange: () => void
    sampleQuery: IQuery
  }

const useStyles = makeStyles({
  container: {
    height: '-webkit-fill-available'
  }
});

const Request = (props: IRequestProps) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState<TabValue>('request-body');
  const mode = useAppSelector((state) => state.graphExplorerMode);
  const dimensions = useAppSelector((state) => state.dimensions);
  const sidebarProperties = useAppSelector((state) => state.sidebarProperties);
  const minHeight = 60;
  const maxHeight = 800;

  const { handleOnEditorChange, sampleQuery }: IRequestProps = props;
  const newHeight = convertVhToPx(dimensions.request.height, 55);
  const containerStyle: CSSProperties = {
    height: newHeight,
    overflow: 'hidden',
    borderRadius: '4px',
    border: '1px solid #ddd',
    padding: '8px'
  }

  useEffect(() => {
    if (sidebarProperties && sidebarProperties.mobileScreen) {
      window.addEventListener('resize', resizeHandler);
    } else {
      window.removeEventListener('resize', resizeHandler);
    }
  }, [sidebarProperties.mobileScreen]);

  const handleTabSelect = (tab: TabValue) => {
    setSelectedTab(tab);
    telemetry.trackTabClickEvent(tab as string, sampleQuery);
  };

  const setRequestAndResponseHeights = (requestHeight: string) => {
    const heightInPx = requestHeight.replace('px', '').trim();
    const requestHeightInVh = convertPxToVh(parseFloat(heightInPx)).toString();
    const maxDeviceVerticalHeight = 90;

    const dimensionsToUpdate = {
      ...dimensions,
      request: {
        ...dimensions.request,
        height: requestHeightInVh
      },
      response: {
        ...dimensions.response,
        height: `${maxDeviceVerticalHeight - parseFloat(requestHeightInVh.replace('vh', ''))}vh`
      }
    };

    dispatch(setDimensions(dimensionsToUpdate));
  };

  const resizeHandler = () => {
    const resizable = document.getElementsByClassName('request-resizable');
    if (resizable && resizable.length > 0) {
      const resizableElement = resizable[0] as HTMLElement;
      if (resizableElement && resizableElement.style && resizableElement.style.height) {
        resizableElement.style.height = '';
      }
    }
  };

  return (
    <div className={styles.container}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => handleTabSelect(data.value)}
      >
        <Tab value="request-body" aria-label={translateMessage('request body')}>
          {translateMessage('Request Body')}
        </Tab>
        <Tab value="request-headers" aria-label={translateMessage('request header')}>
          {translateMessage('Request Headers')}
        </Tab>
        <Tab value="modify-permissions" aria-label={translateMessage('modify permissions')}>
          {translateMessage('Modify Permissions')}
        </Tab>
        {mode === Mode.Complete && (
          <Tab value="access-token" aria-label={translateMessage('Access Token')}>
            {translateMessage('Access Token')}
          </Tab>
        )}
      </TabList>

      {selectedTab === 'request-body' && <RequestBody handleOnEditorChange={handleOnEditorChange} />}
      {selectedTab === 'request-headers' && <RequestHeaders />}
      {selectedTab === 'modify-permissions' && <Permissions />}
      {selectedTab === 'access-token' && mode === Mode.Complete && <Auth />}
    </div>
  );
};

export default Request;