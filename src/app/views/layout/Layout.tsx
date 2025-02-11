import { makeResetStyles, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider';
import { PopupsProvider } from '../../services/context/popups-context';
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { translateMessage } from '../../utils/translate-messages';
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections';
import Notification from '../common/banners/Notification';
import PopupsWrapper from '../common/popups/PopupsWrapper';
import { MainHeaderV9 } from '../main-header/MainHeaderV9';
import { QueryResponseV9 } from '../query-response';
import { QueryRunner } from '../query-runner';
import Request from '../query-runner/request/RequestV9';
import { SidebarV9 } from '../sidebar/SidebarV9';
import { LayoutResizeHandler } from './LayoutResizeHandler';
import { useResizeHandle } from '@fluentui-contrib/react-resize-handle';
import { Mode } from '../../../types/enums';
interface LayoutProps {
  handleSelectVerb: (verb: string) => void;
}

const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

const useLayoutResizeStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '17%'
})

const useLayoutStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalS,
    height: '100vh'
  },
  content: {
    display: 'flex',
    gap: tokens.spacingVerticalS
  },
  sidebar: {
    flex: '0 0 auto',
    flexBasis: `clamp(min(17%, var(${SIDEBAR_SIZE_CSS_VAR})), var(${SIDEBAR_SIZE_CSS_VAR}), 60%)`,
    position: 'relative',
    height: 'calc(100vh - 98px)'
  },
  mainContent: {
    flex: '3 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    overflowY: 'auto',
    height: 'calc(100vh - 98px)'
  },
  requestResponseArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium
  },
  responseArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    maxHeight: '50%',
    border: `solid ${tokens.colorStrokeFocus2} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalMNudge
  },
  requestArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    maxHeight: '50%',
    border: `solid ${tokens.colorStrokeFocus2} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalMNudge
  }
});

export const Layout = (props: LayoutProps) => {
  const layoutStyles = useLayoutStyles();
  const resizeStyles = useLayoutResizeStyles();
  const dispatch = useAppDispatch();
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  // NOTE: use this to show only the icons of the request and response area tabs
  const mode = useAppSelector((state) => state.graphExplorerMode);
  const mobileScreen = useAppSelector((state) => state.sidebarProperties.mobileScreen);
  const showSidebar = mode === Mode.Complete && !mobileScreen

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

  const handleOnEditorChange = (value?: string) => {
    setSampleBody(value!);
  };

  const handleToggleSelect = (toggled: boolean)=> {
    setSidebarColumnSize(toggled ? 456 : 5);
  }

  const resetSidebarArea = () => {
    setSidebarColumnSize(456)
  }

  return (
    <>
      <PopupsProvider>
        <div className={layoutStyles.container}>
          <MainHeaderV9 />
          <div id='content-ref' className={mergeClasses(layoutStyles.content, resizeStyles)} ref={sidebarWrapperRef}>
            {showSidebar &&
            <div id='sidebar-ref' className={layoutStyles.sidebar} ref={sidebarElementRef}>
              <SidebarV9 handleToggleSelect={handleToggleSelect} />
              <LayoutResizeHandler
                position='end'
                ref={sidebarHandleRef}
                onDoubleClick={resetSidebarArea}
              />
            </div>}
            <div id='main-content' className={layoutStyles.mainContent}>
              <Notification
                header={translateMessage('Banner notification 1 header')}
                content={translateMessage('Banner notification 1 content')}
                link={translateMessage('Banner notification 1 link')}
                linkText={translateMessage('Banner notification 1 link text')}
              />
              <ValidationProvider>
                <QueryRunner onSelectVerb={props.handleSelectVerb} />
                <div
                  id='request-response-area'
                  className={layoutStyles.requestResponseArea}
                >
                  <div id='request-area' className={layoutStyles.requestArea}>
                    <Request
                      handleOnEditorChange={handleOnEditorChange}
                      sampleQuery={sampleQuery}
                    />
                  </div>
                  <div id='response-area' className={layoutStyles.responseArea}>
                    <StatusMessagesV9 />
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
