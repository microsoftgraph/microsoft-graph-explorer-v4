import { makeResetStyles, makeStyles, mergeClasses, useMergedRefs } from '@fluentui/react-components'
import { translateMessage } from '../../utils/translate-messages'
import Notification from '../common/banners/Notification'
import { MainHeaderV9 } from '../main-header/MainHeaderV9'
import { SidebarV9 } from '../sidebar/SidebarV9'
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider'
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections'
import { QueryResponse } from '../query-response'
import { QueryRunner } from '../query-runner'
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider'
import PopupsWrapper from '../common/popups/PopupsWrapper'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setSampleQuery } from '../../services/slices/sample-query.slice'
import RequestV9 from '../query-runner/request/RequestV9'
import { useResizeHandle } from '@fluentui-contrib/react-resize-handle'
import { LayoutResizeHandler } from './LayoutResizeHandler'


const RESPONSE_AREA_SIZE_CSS_VAR = '--response-area-size';
const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

const usePageStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '20%',
  [RESPONSE_AREA_SIZE_CSS_VAR]: '40%',
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
})

const useSidebarStyles = makeResetStyles({
  flex: `0 0 clamp(60px, calc(20% + var(${SIDEBAR_SIZE_CSS_VAR})), 30%)`,
  padding: '0.5rem',
  borderRight: '1px solid #e5e5e5',
  position: 'relative'
});

const useResponseAreaStyles = makeResetStyles({
  flex: `1 1 clamp(5%, var(${RESPONSE_AREA_SIZE_CSS_VAR}), 60%)`,
  position: 'relative'
});

const useLayoutStyles = makeStyles({
  header: {
    flex: '0 0 auto'
  },
  body: {
    display: 'flex',
    flex: '1 1 auto',
    gap: '0.5rem'
  },
  content: {
    flex: '1 1 auto',
    padding: '0.5rem'
  }
})

interface LayoutProps {
  handleSelectVerb: (verb: string) => void
  maxWidth: number;
  onDragStart: (value: number, eventType: string) => void;
  onDragEnd: (value: number, eventType: string) => void;
  onChange: (value: number, eventType: string) => void;
}

const Layout = (props: LayoutProps) =>{
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
  }, [sampleBody])

  const handleOnEditorChange = (value?: string) => {
    setSampleBody(value!);
  };

  return <div className={pageStyles}>
    <div className={layoutStyles.header}><MainHeaderV9/></div>
    {/* TODO: Handle the Modes - Modes.Complete and Modes.TryIt */}
    <div className={layoutStyles.body} ref={wrapperRef}>
      <div className={sidebarStyles} ref={sidebarElementRef}>
        <SidebarV9/>
        <LayoutResizeHandler
          position='end'
          ref={sidebarHandleRef}
          onDoubleClick={resetSidebarArea}
        />
      </div>
      <div className={layoutStyles.content}>
        <Notification
          header={translateMessage('Banner notification 1 header')}
          content={translateMessage('Banner notification 1 content')}
          link={translateMessage('Banner notification 1 link')}
          linkText={translateMessage('Banner notification 1 link text')}/>
        <ValidationProvider>
          <QueryRunner onSelectVerb={props.handleSelectVerb} />
          <RequestV9
            handleOnEditorChange={handleOnEditorChange}
            sampleQuery={sampleQuery}
          />
          <StatusMessagesV9 />
          {/* TODO: Implement resizing for the response area */}
          <div className={responseAreaStyles}
            ref={responseAreaElementRef}>
            <QueryResponse />
            <LayoutResizeHandler
              position='top'
              ref={responseAreaHandleRef}
              onDoubleClick={resetResponseArea}
            />
          </div>
        </ValidationProvider>
        <TermsOfUseMessageV9 />
        <CollectionPermissionsProvider>
          <PopupsWrapper />
        </CollectionPermissionsProvider>
      </div>
    </div>
  </div>
}

export {Layout}