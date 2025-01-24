import { Resizable } from 're-resizable';
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider';
import { PopupsProvider } from '../../services/context/popups-context';
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider';
import { translateMessage } from '../../utils/translate-messages';
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections';
import PopupsWrapper from '../common/popups/PopupsWrapper';
import { MainHeaderV9 } from '../main-header/MainHeaderV9';
import { QueryResponseV9 } from '../query-response';
import { QueryRunner } from '../query-runner';
import { SidebarV9 } from '../sidebar/SidebarV9';
import Notification from '../common/banners/Notification';
import { makeStyles, tokens } from '@fluentui/react-components';
import Request from '../query-runner/request/RequestV9';
import { IDropdownOption } from '@fluentui/react';
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { MonacoV9 } from '../common';
import e from 'express';
interface LayoutProps {
    handleSelectVerb: (verb: string) => void;
}

const useLayoutStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalS
  },
  content: {
    display: 'flex',
    gap: tokens.spacingVerticalS
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100vh',
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground6,
    borderRightStyle: 'solid',
    borderRightColor: tokens.colorStrokeFocus2,
    borderRightWidth: tokens.strokeWidthThin
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS
  },
  requestResponseArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    backgroundColor: 'green',
    borderRadius: tokens.borderRadiusMedium
  },
  responseArea: {
    flex:'1',
    backgroundColor: 'blue',
    border: `solid ${tokens.colorStrokeFocus2} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalMNudge
  },
  requestArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    backgroundColor: 'red',
    border: `solid ${tokens.colorStrokeFocus2} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalMNudge
  }
})

export const Layout = (props: LayoutProps)=>{
  const layoutStyles = useLayoutStyles()
  const dispatch = useAppDispatch();
  const sampleQuery = useAppSelector((state) => state.sampleQuery);

  const [sampleBody, setSampleBody] = useState('');

  useEffect(() => {
    if (sampleQuery.selectedVerb !== 'GET') {
      const query = { ...sampleQuery };
      query.sampleBody = sampleBody;
      dispatch(setSampleQuery(query));
    }
  }, [sampleBody])

  const handleOnEditorChange = (value?: string) => {
    setSampleBody(value!);
  };

  return <>
    <PopupsProvider>
      <div className={layoutStyles.container}>
        <MainHeaderV9 />
        {/* TODO: handle the graphExplorerMode */}
        <div  id="content" className={layoutStyles.content}>
          {/* TODO: find better minimum and maximu values.  */}
          <Resizable defaultSize={{ width: '25%', height: '100vh' }} minWidth={'15%'} maxWidth={'60%'}>
            <div id="sidebar" className={layoutStyles.sidebar}>
              <SidebarV9 />
            </div>
          </Resizable>
          <div id="main-content" className={layoutStyles.mainContent}>
            <Notification
              header={translateMessage(
                'Banner notification 1 header'
              )}
              content={translateMessage(
                'Banner notification 1 content'
              )}
              link={translateMessage('Banner notification 1 link')}
              linkText={translateMessage(
                'Banner notification 1 link text'
              )}
            />
            {/* TODO: handle try-it mode. Make the sidebar hidden and the main content spans all width */}
            <ValidationProvider>
              <QueryRunner onSelectVerb={props.handleSelectVerb} />
              <div id="request-response-area"className={layoutStyles.requestResponseArea}>
                <div id="request-area" className={layoutStyles.requestArea}>
                  <Request
                    handleOnEditorChange={handleOnEditorChange}
                    sampleQuery={sampleQuery}
                  />
                  <StatusMessagesV9 />
                </div>
                <div id="response-area" className={layoutStyles.responseArea}>
                  <QueryResponseV9 />
                </div>
              </div>
            </ValidationProvider>
          </div>
        </div>

        {/* TODO: handle mobile screen view */}
        <TermsOfUseMessageV9 />
      </div>
      <CollectionPermissionsProvider>
        <PopupsWrapper />
      </CollectionPermissionsProvider>
    </PopupsProvider>
  </>
}
