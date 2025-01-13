import { useResizeHandle } from '@fluentui-contrib/react-resize-handle';
import {
  makeResetStyles,
  makeStyles,
  mergeClasses,
  tokens,
  useMergedRefs
} from '@fluentui/react-components';
import { translateMessage } from '../utils/translate-messages';
import Notification from './common/banners/Notification';
import { Handle } from './Handle';
import { MainHeaderV9 } from './main-header/MainHeaderV9';
// import { QueryRunner } from './query-runner';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSampleQuery } from '../services/slices/sample-query.slice';
import QueryRunnerV9 from './query-runner/QueryRunnerV9';
import {
  default as Request,
  default as RequestV9
} from './query-runner/request/RequestV9';
import { SidebarV9 } from './sidebar/SidebarV9';

const RESPONSE_AREA_SIZE_CSS_VAR = '--response-area-size';
const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

const usePageStyles = makeResetStyles({
  height: '100vh',
  backgroundColor: tokens.colorNeutralBackground1
});

const useMainWrapperStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '60px',
  [RESPONSE_AREA_SIZE_CSS_VAR]: '40%',
  display: 'grid',
  width: '100%',
  height: '100%',
  gap: '8px',
  gridTemplateAreas: `
  "header header"
  "sidebar notifications"
  "sidebar queryArea"
  "sidebar requestArea"
  "sidebar responseArea"
  "footer footer"
  `,
  gridTemplateRows: `48px minmax(0, auto) minmax(0, auto) 1fr clamp(5%, var(${RESPONSE_AREA_SIZE_CSS_VAR}), 60%) 60px`,
  gridTemplateColumns: `clamp(60px, calc(20% + var(${SIDEBAR_SIZE_CSS_VAR})), 30%) 1fr`
});

const useStyles = makeStyles({
  areaHeader: {
    gridArea: 'header'
  },
  areaSidebar: {
    gridArea: 'sidebar',
    height: '100%',
    padding: '0 6px'
  },
  areaNotifications: {
    gridArea: 'notifications',
    padding: '6px'
  },
  areaQuery: {
    gridArea: 'queryArea',
    backgroundColor: 'green',
    padding: '6px'
  },
  areaRequest: {
    gridArea: 'requestArea',
    backgroundColor: 'blue'
  },
  areaResponse: {
    gridArea: 'responseArea',
    backgroundColor: 'indigo'
  },
  areaFooter: {
    gridArea: 'footer',
    backgroundColor: 'violet'
  }
});

const useMainBoxStyles = makeResetStyles({
  position: 'relative'
});

interface ComponentProps {
  handleSelectVerb: (verb: string) => void;
  maxWidth: number;
  onDragStart: (value: number, eventType: string) => void;
  onDragEnd: (value: number, eventType: string) => void;
  onChange: (value: number, eventType: string) => void;
}

const Layout = (props: ComponentProps) => {
  const pageStyles = usePageStyles();
  const wrapperStyles = useMainWrapperStyles();
  const boxStyles = useMainBoxStyles();
  const styles = useStyles();

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

  const wrapperRef = useMergedRefs(sidebarWrapperRef, responseAreaWrapperRef);

  const resetSidebarArea = () => {
    setSidebarColumnSize(40);
  };

  const resetResponseArea = () => {
    setResponseAreaRowSize(460);
  };

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
    <div className={pageStyles}>
      <div className={wrapperStyles} ref={wrapperRef}>
        <div className={mergeClasses(boxStyles, styles.areaHeader)}>
          <MainHeaderV9 />
        </div>
        <div
          className={mergeClasses(boxStyles, styles.areaSidebar)}
          ref={sidebarElementRef}
        >
          <SidebarV9 />
          <Handle
            position='end'
            ref={sidebarHandleRef}
            onDoubleClick={resetSidebarArea}
          />
        </div>

        <div className={mergeClasses(boxStyles, styles.areaNotifications)}>
          <Notification
            header={translateMessage('Banner notification 1 header')}
            content={translateMessage('Banner notification 1 content')}
            link={translateMessage('Banner notification 1 link')}
            linkText={translateMessage('Banner notification 1 link text')}
          />
        </div>
        <div className={mergeClasses(boxStyles, styles.areaQuery)}>
          <QueryRunnerV9 onSelectVerb={props.handleSelectVerb} />
        </div>
        <div className={mergeClasses(boxStyles, styles.areaRequest)}>
          <RequestV9
            handleOnEditorChange={handleOnEditorChange}
            sampleQuery={sampleQuery}
          ></RequestV9>
        </div>

        <div
          className={mergeClasses(boxStyles, styles.areaResponse)}
          ref={responseAreaElementRef}
        >
          <Handle
            position='top'
            ref={responseAreaHandleRef}
            onDoubleClick={resetResponseArea}
          />
        </div>
        <div className={mergeClasses(boxStyles, styles.areaFooter)}></div>
      </div>
    </div>
  );
};

export default Layout;
