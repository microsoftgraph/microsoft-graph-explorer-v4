import { useResizeHandle } from '@fluentui-contrib/react-resize-handle';
import {
  makeResetStyles,
  makeStyles,
  mergeClasses,
  useMergedRefs
} from '@fluentui/react-components';
import { Handle } from './Handle';
import { MainHeaderV9 } from './main-header/MainHeaderV9';

const RESPONSE_AREA_SIZE_CSS_VAR = '--response-area-size';
const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

const usePageStyles = makeResetStyles({
  height: '100vh',
  backgroundColor: 'red'
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
  gridTemplateRows: `48px 10% 5% 1fr clamp(5%, var(${RESPONSE_AREA_SIZE_CSS_VAR}), 60%) 60px`,
  gridTemplateColumns: `clamp(60px, calc(20% + var(${SIDEBAR_SIZE_CSS_VAR})), 30%) 1fr`
});

const useStyles = makeStyles({
  areaHeader: {
    gridArea: 'header'
  },
  areaSidebar: {
    gridArea: 'sidebar',
    height: '100%',
    backgroundColor: 'orange'
  },
  areaNotifications: {
    gridArea: 'notifications',
    backgroundColor: 'yellow'
  },
  areaQuery: {
    gridArea: 'queryArea',
    backgroundColor: 'green'
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
          <Handle
            position='end'
            ref={sidebarHandleRef}
            onDoubleClick={resetSidebarArea}
          />
        </div>

        <div
          className={mergeClasses(boxStyles, styles.areaNotifications)}
        ></div>
        <div className={mergeClasses(boxStyles, styles.areaQuery)}></div>
        <div className={mergeClasses(boxStyles, styles.areaRequest)}></div>

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
