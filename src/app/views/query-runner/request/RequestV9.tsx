import { useEffect, useState } from 'react';

import { useAppSelector } from '../../../../store';
import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { translateMessage } from '../../../utils/translate-messages';
import { Auth, Permissions, RequestHeaders } from '../../common/lazy-loader/component-registry';
import { RequestBody } from './body';
import './request.scss';
import { IQuery } from '../../../../types/query-runner';
import { makeStyles, Tab, TabList, TabValue, tokens } from '@fluentui/react-components';
import { SendRegular, DocumentTableRegular, ShieldKeyholeRegular, KeyRegular } from '@fluentui/react-icons';

  interface IRequestProps {
    handleOnEditorChange: () => void
    sampleQuery: IQuery
  }

const useStyles = makeStyles({
  container: {
    height: '-webkit-fill-available',
    display: 'flex',
    flexDirection: 'column'
  },
  tabContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius:tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
    marginTop: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '0'
  }
});

const Request = (props: IRequestProps) => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<TabValue>('request-body');
  const mode = useAppSelector((state) => state.graphExplorerMode);
  const sidebarProperties = useAppSelector((state) => state.sidebarProperties);

  const { handleOnEditorChange, sampleQuery }: IRequestProps = props;

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
        <Tab value="request-body" aria-label={translateMessage('request body')} icon={<SendRegular/>}>
          {translateMessage('Request Body')}
        </Tab>
        <Tab value="request-headers" aria-label={translateMessage('request header')} icon={<DocumentTableRegular/>}>
          {translateMessage('Request Headers')}
        </Tab>
        <Tab value="modify-permissions" aria-label={translateMessage('modify permissions')}
          icon={<ShieldKeyholeRegular />}>
          {translateMessage('Modify Permissions')}
        </Tab>
        {mode === Mode.Complete && (
          <Tab value="access-token" aria-label={translateMessage('Access Token')} icon={<KeyRegular />}>
            {translateMessage('Access Token')}
          </Tab>
        )}
      </TabList>
      <div className={styles.tabContent}>
        {selectedTab === 'request-body' && (
          <div style={{ flex: 1, display: 'flex' }}>
            <RequestBody handleOnEditorChange={handleOnEditorChange} isVisible={selectedTab === 'request-body'} />
          </div>)}
        {selectedTab === 'request-headers' && (
          <div style={{ flex: 1, display: 'flex' }}>
            <RequestHeaders />
          </div>)}
        {selectedTab === 'modify-permissions' && <Permissions />}
        {selectedTab === 'access-token' && mode === Mode.Complete && <Auth />}
      </div>
    </div>
  );
};

export default Request;