import { mergeClasses } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider';
import { PopupsProvider } from '../../services/context/popups-context';
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { toggleSidebar } from '../../services/slices/sidebar-properties.slice'; // Import sidebar action
import { translateMessage } from '../../utils/translate-messages';
import { StatusMessages, TermsOfUseMessage } from '../app-sections';
import Notification from '../common/banners/Notification';
import PopupsWrapper from '../common/popups/PopupsWrapper';
import { MainHeader } from '../main-header/MainHeader';
import { QueryResponse } from '../query-response';
import { QueryRunner } from '../query-runner';
import Request from '../query-runner/request/RequestV9';
import { Sidebar } from '../sidebar/Sidebar';
import { LayoutResizeHandler } from './LayoutResizeHandler';
import { useResizeHandle } from '@fluentui-contrib/react-resize-handle';
import { useLayoutResizeStyles, useLayoutStyles, SIDEBAR_SIZE_CSS_VAR } from './LayoutStyles';
import { useDetectMobileScreen } from '../../utils/useDetectMobileScreen';

interface LayoutProps {
  handleSelectVerb: (verb: string) => void;
}

export const Layout = (props: LayoutProps) => {
  useDetectMobileScreen();
  const layoutStyles = useLayoutStyles();
  const resizeStyles = useLayoutResizeStyles();
  const dispatch = useAppDispatch();
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const { mobileScreen, showSidebar } = useAppSelector((state) => state.sidebarProperties);

  const {
    handleRef: sidebarHandleRef,
    wrapperRef: sidebarWrapperRef,
    elementRef: sidebarElementRef,
    setValue: setSidebarColumnSize
  } = useResizeHandle({
    variableName: SIDEBAR_SIZE_CSS_VAR,
    growDirection: 'end'
  });

  const [sampleBody, setSampleBody] = useState('');

  useEffect(() => {
    if (sampleQuery.selectedVerb !== 'GET') {
      const query = { ...sampleQuery };
      query.sampleBody = sampleBody;
      dispatch(setSampleQuery(query));
    }
  }, [sampleBody]);

  useEffect(() => {
    if (mobileScreen) {
      dispatch(toggleSidebar({ showSidebar: false, mobileScreen: true }));
      setSidebarColumnSize(0);
    }
  }, [mobileScreen, dispatch]);

  const handleOnEditorChange = (value?: string) => {
    setSampleBody(value!);
  };

  const handleToggleSelect = (toggled: boolean) => {
    setSidebarColumnSize(toggled ? 456 : 5);
  };

  const resetSidebarArea = () => {
    setSidebarColumnSize(456);
  };

  return (
    <>
      <PopupsProvider>
        <div className={layoutStyles.container}>
          <MainHeader />
          <div id='content-ref' className={mergeClasses(layoutStyles.content, resizeStyles)} ref={sidebarWrapperRef}>
            {showSidebar && (
              <div id='sidebar-ref' className={layoutStyles.sidebar} ref={sidebarElementRef}>
                <Sidebar handleToggleSelect={handleToggleSelect} />
                <LayoutResizeHandler position='end' ref={sidebarHandleRef} onDoubleClick={resetSidebarArea} />
              </div>
            )}
            <div id='main-content' className={layoutStyles.mainContent}>
              <div style={{ margin: '0 10px' }}>
                <Notification
                  header={translateMessage('Banner notification 1 header')}
                  content={translateMessage('Banner notification 1 content')}
                  link={translateMessage('Banner notification 1 link')}
                  linkText={translateMessage('Banner notification 1 link text')}
                />
              </div>

              <ValidationProvider>
                <div style={{ margin: '0 10px' }}>
                  <QueryRunner onSelectVerb={props.handleSelectVerb} />
                </div>
                <div id='request-response-area' className={layoutStyles.requestResponseArea}>
                  <div id='request-area' className={layoutStyles.requestArea}>
                    <Request handleOnEditorChange={handleOnEditorChange} sampleQuery={sampleQuery} />
                  </div>
                  <div style={{ margin: '0 10px' }}>
                    <StatusMessages />
                  </div>
                  <div id='response-area' className={layoutStyles.responseArea}>
                    <QueryResponse />
                  </div>
                </div>
              </ValidationProvider>
            </div>
          </div>
          <TermsOfUseMessage />
        </div>
        <CollectionPermissionsProvider>
          <PopupsWrapper />
        </CollectionPermissionsProvider>
      </PopupsProvider>
    </>
  );
};
