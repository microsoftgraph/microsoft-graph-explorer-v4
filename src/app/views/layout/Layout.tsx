import { useResizeHandle } from '@fluentui-contrib/react-resize-handle';
import {
  makeResetStyles,
  makeStyles,
  mergeClasses,
  tokens
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import CollectionPermissionsProvider from '../../services/context/collection-permissions/CollectionPermissionsProvider';
import { ValidationProvider } from '../../services/context/validation-context/ValidationProvider';
import { BANNER_IS_VISIBLE } from '../../services/graph-constants';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { translateMessage } from '../../utils/translate-messages';
import { StatusMessagesV9, TermsOfUseMessageV9 } from '../app-sections';
import Notification from '../common/banners/Notification';
import PopupsWrapper from '../common/popups/PopupsWrapper';
import { MainHeaderV9 } from '../main-header/MainHeaderV9';
import { QueryResponse } from '../query-response';
import { QueryRunner } from '../query-runner';
import RequestV9 from '../query-runner/request/RequestV9';
import { SidebarV9 } from '../sidebar/SidebarV9';
import { LayoutResizeHandler } from './LayoutResizeHandler';

const RESPONSE_AREA_SIZE_CSS_VAR = '--response-area-size';
const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

interface LayoutProps {
  handleSelectVerb: (verb: string) => void;
  maxWidth: number;
  onDragStart: (value: number, eventType: string) => void;
  onDragEnd: (value: number, eventType: string) => void;
  onChange: (value: number, eventType: string) => void;
}

const storageBanner = localStorage.getItem(BANNER_IS_VISIBLE);
const bannerIsVisible = storageBanner === null || storageBanner === 'true';

const usePageStyles = makeResetStyles({
  height: '100vh',
  backgroundColor: tokens.colorNeutralBackground1,
  padding: tokens.spacingHorizontalXS
});

const useMainWrapperStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '460px',
  [RESPONSE_AREA_SIZE_CSS_VAR]: '70%',
  display: 'grid',
  width: '100%',
  height: '100%',
  gap: tokens.spacingVerticalS,
  gridTemplateAreas: `
  "header header"
  "sidebar mainArea"
  "footer footer"
  `,
  gridTemplateRows: '48px 1fr 48px',
  gridTemplateColumns: `clamp(60px, var(${SIDEBAR_SIZE_CSS_VAR}), 40%) 1fr`
});
const bannerRow = `${bannerIsVisible ? 'auto' : ''}`;
const useMainAreaWrapperStyles = makeResetStyles({
  display: 'grid',
  gridArea: 'mainArea',
  gridTemplate: `
  ${bannerIsVisible ? '"notificationArea"' : ''}
  "queryArea"
  "requestArea"
  "responseArea"
  `,
  gridTemplateRows: `${bannerRow} 36px minmax(20%, 80%) clamp(16%, var(${RESPONSE_AREA_SIZE_CSS_VAR}), 80%)`,
  gridTemplateColumns: '1fr',
  position: 'relative',
  gap: tokens.spacingHorizontalS
});

const useStyles = makeStyles({
  areaHeader: {
    gridArea: 'header'
  },
  areaSidebar: {
    gridArea: 'sidebar',
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground6,
    borderRightStyle: 'solid',
    borderRightColor: tokens.colorNeutralStroke1,
    borderRightWidth: tokens.strokeWidthThin
  },
  notificationArea: {
    gridArea: 'notificationArea',
    alignContent: 'center'
  },
  queryArea: {
    gridArea: 'queryArea'
  },
  requestArea: {
    gridArea: 'requestArea',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalXS,
    border: `solid ${tokens.colorNeutralStroke1} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium
  },
  responseArea: {
    gridArea: 'responseArea',
    padding: tokens.spacingHorizontalXS,
    border: `solid ${tokens.colorNeutralStroke1} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium
  },

  areaFooter: {
    gridArea: 'footer',
    backgroundColor: 'yellow'
  }
});

const useMainBoxStyles = makeResetStyles({
  position: 'relative'
});

const Layout = (props: LayoutProps) => {
  const pageStyles = usePageStyles();
  const boxStyles = useMainBoxStyles();
  const styles = useStyles();
  const mainAreaStyles = useMainAreaWrapperStyles();
  const wrapperStyles = useMainWrapperStyles();

  const {
    handleRef: sidebarHandleRef,
    wrapperRef: sidebarWrapperRef,
    elementRef: sidebarElementRef,
    setValue: setSidebarColumnSize
  } = useResizeHandle({
    variableName: SIDEBAR_SIZE_CSS_VAR,
    growDirection: 'end',
    // relative: true,
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
    setSidebarColumnSize(460);
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
      <div className={wrapperStyles} ref={sidebarWrapperRef}>
        <div className={mergeClasses(boxStyles, styles.areaHeader)}>
          <MainHeaderV9 />
        </div>
        <div
          className={mergeClasses(boxStyles, styles.areaSidebar)}
          ref={sidebarElementRef}
        >
          <SidebarV9 />
          <LayoutResizeHandler
            position='end'
            ref={sidebarHandleRef}
            onDoubleClick={resetSidebarArea}
          />
        </div>
        <div className={mainAreaStyles} ref={responseAreaWrapperRef}>
          {bannerIsVisible && (
            <div
              id='notification'
              className={mergeClasses(boxStyles, styles.notificationArea)}
            >
              <Notification
                header={translateMessage('Banner notification 1 header')}
                content={translateMessage('Banner notification 1 content')}
                link={translateMessage('Banner notification 1 link')}
                linkText={translateMessage('Banner notification 1 link text')}
              />
            </div>
          )}
          <ValidationProvider>
            <div className={mergeClasses(boxStyles, styles.queryArea)}>
              <QueryRunner onSelectVerb={props.handleSelectVerb} />
            </div>
            <div className={mergeClasses(boxStyles, styles.requestArea)}>
              <RequestV9
                handleOnEditorChange={handleOnEditorChange}
                sampleQuery={sampleQuery}
              />
              <StatusMessagesV9 />
            </div>
            <div
              className={mergeClasses(boxStyles, styles.responseArea)}
              ref={responseAreaElementRef}
            >
              <QueryResponse />
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
        <div className={mergeClasses(boxStyles, styles.areaFooter)}>
          <TermsOfUseMessageV9 />
        </div>
      </div>
    </div>
  );
};

export { Layout };
