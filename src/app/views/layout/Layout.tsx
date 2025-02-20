import { mergeClasses } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider';
import { PopupsProvider } from '../../services/context/popups-context';
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { toggleSidebar } from '../../services/slices/sidebar-properties.slice';
import { translateMessage } from '../../utils/translate-messages';
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections';
import Notification from '../common/banners/Notification';
import PopupsWrapper from '../common/popups/PopupsWrapper';
import { MainHeader } from '../main-header/MainHeader';
import { QueryResponseV9 } from '../query-response';
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
  const [initialSidebarWidth, setInitialSidebarWidth] = useState(456);
  const [sidebarElement, setSidebarElement] = useState<HTMLElement | null>(null);

  const {
    handleRef: sidebarHandleRef,
    wrapperRef: sidebarWrapperRef,
    elementRef: storeSidebarElement,
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
    if (!mobileScreen) {
      setSidebarColumnSize(456);
      setInitialSidebarWidth(456);
    } else {
      setSidebarColumnSize(0);
    }
  }, [mobileScreen]);


  const handleOnEditorChange = (value?: string) => {
    setSampleBody(value!);
  };

  const handleToggleSelect = (toggled: boolean) => {
    if (mobileScreen) {
      dispatch(toggleSidebar({ showSidebar: toggled, mobileScreen: true }));
      setSidebarColumnSize(toggled ? window.innerWidth : 0);
    } else {
      if (toggled) {
        setSidebarColumnSize(initialSidebarWidth > 456 ? initialSidebarWidth : 456);
      } else {
        setSidebarColumnSize(48);
      }
    }
  };

  const handleResizeStart = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!sidebarElement) {return;}

    const startX = event.clientX;
    const startWidth = parseInt(getComputedStyle(sidebarElement).width, 10);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      updateSidebarSize(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };


  const updateSidebarSize = (newSize: number) => {
    const minSize = 48;
    const maxSize = window.innerWidth * 0.5;

    const finalSize = Math.max(minSize, Math.min(maxSize, newSize));

    setSidebarColumnSize(finalSize);

    if (finalSize > 48) {
      setInitialSidebarWidth(finalSize);
    }
  };

  return (
    <>
      <PopupsProvider>
        <div className={layoutStyles.container}>
          <MainHeader />
          <div id='content-ref' className={mergeClasses(layoutStyles.content, resizeStyles)} ref={sidebarWrapperRef}>
            {showSidebar && (
              <div id='sidebar-ref' className={layoutStyles.sidebar} ref={storeSidebarElement}>
                <Sidebar handleToggleSelect={handleToggleSelect} />
                {!mobileScreen && (
                  <LayoutResizeHandler
                    position="end"
                    ref={sidebarHandleRef}
                    onDoubleClick={() => updateSidebarSize(456)}
                    onMouseDown={handleResizeStart}
                  />
                )}
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
                    <StatusMessagesV9 />
                  </div>
                  <div id='response-area' className={layoutStyles.responseArea}>
                    <QueryResponseV9 />
                  </div>
                </div>
              </ValidationProvider>
            </div>
          </div>
          <TermsOfUseMessageV9 />
        </div>
        <CollectionPermissionsProvider>
          <PopupsWrapper />
        </CollectionPermissionsProvider>
      </PopupsProvider>
    </>
  );
};
