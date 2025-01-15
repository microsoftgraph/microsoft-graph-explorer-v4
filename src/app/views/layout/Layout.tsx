import { useResizeHandle } from '@fluentui-contrib/react-resize-handle';
import {
  makeResetStyles,
  makeStyles,
  tokens,
  useMergedRefs
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider';
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { translateMessage } from '../../utils/translate-messages';
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections';
import Notification from '../common/banners/Notification';
import PopupsWrapper from '../common/popups/PopupsWrapper';
import { MainHeaderV9 } from '../main-header/MainHeaderV9';
import QueryResponseV9 from '../query-response/QueryResponseV9';
import { QueryRunner } from '../query-runner';
import RequestV9 from '../query-runner/request/RequestV9';
import { SidebarV9 } from '../sidebar/SidebarV9';
import { LayoutResizeHandler } from './LayoutResizeHandler';

const RESPONSE_AREA_SIZE_CSS_VAR = '--response-area-size';
const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

const usePageStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '20%',
  [RESPONSE_AREA_SIZE_CSS_VAR]: '40%',
  height: '100vh',
  margin: '0',
  display: 'flex',
  flexDirection: 'column',
  flex: '1'
});

const useSidebarStyles = makeResetStyles({
  flex: `0 0 clamp(60px, calc(20% + var(${SIDEBAR_SIZE_CSS_VAR})), 30%)`,
  padding: '0.5rem',
  borderRightStyle: 'solid',
  borderRightColor: tokens.colorNeutralStroke1,
  borderRightWidth: '2px',
  position: 'relative',
  flexShrink: '0',
  backgroundColor: tokens.colorNeutralBackground6
});

const useResponseAreaStyles = makeResetStyles({
  flex: `1 1 clamp(5%, var(${RESPONSE_AREA_SIZE_CSS_VAR}), 60%)`,
  position: 'relative',
  border: '2px solid black',
  borderRadius: '4px',
  height: '500px'
});

const useLayoutStyles = makeStyles({
  header: {
    flexShrink: '0'
  },
  body: {
    display: 'flex',
    flex: '1',
    gap: '0.5rem',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem 0.5rem 0 0',
    flex: '1',
    height: 'calc(100vh - 110px)',
    overflowY: 'auto'
  },
  footer: {
    flexShrink: '0',
    backgroundColor: 'lightgreen'
  },
  queryContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }
});

interface LayoutProps {
  handleSelectVerb: (verb: string) => void;
  maxWidth: number;
  onDragStart: (value: number, eventType: string) => void;
  onDragEnd: (value: number, eventType: string) => void;
  onChange: (value: number, eventType: string) => void;
}

const Layout = (props: LayoutProps) => {
  const {
    handleRef: sidebarHandleRef,
    wrapperRef: sidebarWrapperRef,
    elementRef: sidebarElementRef,
    setValue: setSidebarColumnSize
  } = useResizeHandle({
    variableName: SIDEBAR_SIZE_CSS_VAR,
    growDirection: 'end',
    relative: true,
    onChange: (_, { value, type }) => {
      props.onChange(value, String(type));
    },
    onDragStart: (_, { value, type }) => {
      props.onDragStart(value, String(type));
    },
    onDragEnd: (_, { value, type }) => {
      props.onDragEnd(value, String(type));
    }
  });

  const {
    handleRef: responseAreaHandleRef,
    wrapperRef: responseAreaWrapperRef,
    elementRef: responseAreaElementRef,
    setValue: setResponseAreaRowSize
  } = useResizeHandle({
    variableName: RESPONSE_AREA_SIZE_CSS_VAR,
    growDirection: 'up'
  });

  const resetSidebarArea = () => {
    setSidebarColumnSize(416);
  };

  const resetResponseArea = () => {
    setResponseAreaRowSize(460);
  };

  const pageStyles = usePageStyles();
  const layoutStyles = useLayoutStyles();
  const sidebarStyles = useSidebarStyles();
  const responseAreaStyles = useResponseAreaStyles();

  const wrapperRef = useMergedRefs(sidebarWrapperRef, responseAreaWrapperRef);

  const dispatch = useAppDispatch();
  const sampleQuery = useAppSelector((state) => state.sampleQuery);

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

  return (
    <div id='container' className={pageStyles}>
      <div id='header' className={layoutStyles.header}>
        <MainHeaderV9 />
      </div>
      {/* TODO: Handle the Modes - Modes.Complete and Modes.TryIt */}
      <div id='body' className={layoutStyles.body} ref={wrapperRef}>
        <div id='sidebar' className={sidebarStyles} ref={sidebarElementRef}>
          <SidebarV9 />
          <LayoutResizeHandler
            position='end'
            ref={sidebarHandleRef}
            onDoubleClick={resetSidebarArea}
          />
        </div>
        <div id='main' className={layoutStyles.main}>
          <div id='notification'>
            <Notification
              header={translateMessage('Banner notification 1 header')}
              content={translateMessage('Banner notification 1 content')}
              link={translateMessage('Banner notification 1 link')}
              linkText={translateMessage('Banner notification 1 link text')}
            />
          </div>
          <div className={layoutStyles.queryContainer}>
            <ValidationProvider>
              <QueryRunner onSelectVerb={props.handleSelectVerb} />
              <RequestV9
                handleOnEditorChange={handleOnEditorChange}
                sampleQuery={sampleQuery}
              />
              <StatusMessagesV9 />
              {/* TODO: Implement resizing for the response area */}
              <div className={responseAreaStyles} ref={responseAreaElementRef}>
                <QueryResponseV9 />
                <LayoutResizeHandler
                  position='top'
                  ref={responseAreaHandleRef}
                  onDoubleClick={resetResponseArea}
                />
              </div>
            </ValidationProvider>
            <CollectionPermissionsProvider>
              <PopupsWrapper />
            </CollectionPermissionsProvider>
          </div>
        </div>
      </div>
      <div id='footer' className={layoutStyles.footer}>
        <TermsOfUseMessageV9 />
      </div>
    </div>
  );
};

export { Layout };
