import { Announced} from '@fluentui/react';
import { useAnnounce, FluentProvider, AnnounceProvider } from '@fluentui/react-components';
import { Resizable } from 're-resizable';
import React,  { useEffect} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit';

import { removeSpinners } from '../..';
import { authenticationWrapper } from '../../modules/authentication';
import { componentNames, eventTypes, telemetry } from '../../telemetry';
import { Mode } from '../../types/enums';
import { IInitMessage, IQuery, IThemeChangedMessage } from '../../types/query-runner';
import { ApplicationState } from '../../store';
import { ISharedQueryParams } from '../../types/share-query';
import { signIn, storeScopes } from '../services/slices/auth.slice';
import { setDimensions } from '../services/slices/dimensions.slice';
import { runQuery } from '../services/slices/graph-response.slice';
import { setSampleQuery } from '../services/slices/sample-query.slice';
import { toggleSidebar } from '../services/slices/sidebar-properties.slice';
import { PopupsProvider } from '../services/context/popups-context';
import { GRAPH_URL } from '../services/graph-constants';
import { parseSampleUrl } from '../utils/sample-url-generation';
import { substituteTokens } from '../utils/token-helpers';
import { translateMessage } from '../utils/translate-messages';
import { TermsOfUseMessage } from './app-sections';
import { StatusMessages } from './common/lazy-loader/component-registry';
import { headerMessaging } from './app-sections/HeaderMessaging';
import { useLayoutStyles } from './Layout.styles';
import { KeyboardCopyEvent } from './common/copy-button/KeyboardCopyEvent';
import PopupsWrapper from './common/popups/PopupsWrapper';
import { createShareLink } from './common/share';
import { MainHeader } from './main-header/MainHeader';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';
import { parse } from './query-runner/util/iframe-message-parser';
import { Sidebar } from './sidebar/Sidebar';
import { ValidationProvider } from '../services/context/validation-context/ValidationProvider';
import { useAppContext } from './AppContext';
import { ISidebarProps } from '../../types/sidebar';
import { IUser } from '../../types/profile';

export interface IAppProps {
  profile: IUser | null | undefined;
  graphExplorerMode: Mode;
  sidebarProperties: ISidebarProps;
  sampleQuery: IQuery;
  authenticated: boolean;
  actions: {
    setSampleQuery: Function;
    runQuery: Function;
    toggleSidebar: Function;
    signIn: Function;
    storeScopes: Function;
    setDimensions: Function;
  };
}

const Layout: React.FC<IAppProps> = (props) => {
  const styles = useLayoutStyles();
  const appContext = useAppContext();
  const { announce } = useAnnounce();

  const mediaQueryList = window.matchMedia('(max-width: 992px)');

  useEffect(() => {
    removeSpinners();
    KeyboardCopyEvent();
    displayToggleButton(mediaQueryList);
    mediaQueryList.addListener(displayToggleButton);

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sid');

    if (sessionId) {
      authenticationWrapper.logIn(sessionId).then((authResp) => {
        if (authResp) {
          props.actions.signIn(authResp.accessToken);
          props.actions.storeScopes(authResp.scopes);
        }
      });
    }

    const whiteListedDomains = [
      'https://learn.microsoft.com',
      'https://review.learn.microsoft.com',
      'https://dev.learn.microsoft.com',
      'https://docs.azure.cn'
    ];

    // Notify host document that GE is ready to receive messages
    const hostOrigin = new URLSearchParams(location.search).get('host-origin');
    const originIsWhitelisted =
      hostOrigin && whiteListedDomains.indexOf(hostOrigin) !== -1;

    if (hostOrigin && originIsWhitelisted) {
      window.parent.postMessage({ type: 'ready' }, hostOrigin);
    }

    // Listens for messages from host document
    window.addEventListener('message', receiveMessage, false);
    handleSharedQueries();

    return () => {
      window.removeEventListener('message', receiveMessage);
      mediaQueryList.removeListener(displayToggleButton);
    };
  }, []);

  const setSidebarTabSelection = (selectedTab: string) => {
    setSidebarTabSelection(selectedTab);
  };

  const handleSharedQueries = () => {
    const { actions } = props;
    const queryStringParams = getQueryStringParams();
    const query = generateQueryObjectFrom(queryStringParams);

    if (query) {
      // This timeout waits for monaco to initialize it's formatter.
      setTimeout(() => {
        actions.setSampleQuery(query);
      }, 700);
    }
  };

  const getQueryStringParams = (): ISharedQueryParams => {
    const urlParams = new URLSearchParams(window.location.search);

    const request = urlParams.get('request');
    const method = validateHttpMethod(urlParams.get('method') || '');
    const version = urlParams.get('version');
    const graphUrl = urlParams.get('GraphUrl') || GRAPH_URL;
    const requestBody = urlParams.get('requestBody');
    const headers = urlParams.get('headers');

    return { request, method, version, graphUrl, requestBody, headers };
  };

  const generateQueryObjectFrom = (queryParams: any) => {
    const { request, method, version, graphUrl, requestBody, headers } =
      queryParams;

    if (!request) {
      return null;
    }

    return {
      sampleUrl: `${graphUrl}/${version}/${request}`,
      selectedVerb: method,
      selectedVersion: version,
      sampleBody: requestBody ? hashDecode(requestBody) : null,
      sampleHeaders: headers ? JSON.parse(hashDecode(headers)) : []
    };
  };

  const validateHttpMethod = (method: string): string => {
    method = method.toUpperCase();
    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if (!validMethods.includes(method)) {
      method = 'GET';
    }
    return method;
  };

  const hashDecode = (requestBody: string): string => {
    const decodedBody = atob(requestBody);

    if (decodedBody === 'undefined') {
      return '';
    }

    return decodedBody;
  };

  const receiveMessage = (event: MessageEvent): void => {
    const msgEvent: IThemeChangedMessage | IInitMessage = event.data;

    switch (msgEvent.type) {
      case 'init':
        handleInitMsg(msgEvent);
        break;
      // case 'theme-changed':
      //   handleThemeChangeMsg(msgEvent);
      //   break;
      default:
        return;
    }
  };

  const handleInitMsg = (msg: IInitMessage) => {
    const { actions, profile } = props;
    const { verb, headers, url, body }: any = parse(msg.code);
    if (actions) {
      actions.setSampleQuery({
        sampleUrl: url,
        selectedVerb: verb
      });
    }

    // Sets selected verb in App Component
    handleSelectVerb(verb);

    /**
     * We are delaying this by 1 second here so that we give Monaco's formatter time to initialize.
     * If we don't put this delay, the body won't be formatted.
     */
    setTimeout(() => {
      if (actions) {
        const { queryVersion } = parseSampleUrl(url);
        const requestHeaders = headers.map((header: any) => {
          return {
            name: Object.keys(header)[0],
            value: Object.values(header)[0]
          };
        });

        const query: IQuery = {
          sampleUrl: url,
          selectedVerb: verb,
          sampleBody: body,
          selectedVersion: queryVersion,
          sampleHeaders: requestHeaders
        };

        // Type guard to ensure profile is an object
        if (profile && typeof profile === 'object') {
          substituteTokens(query, profile);
        }

        actions.setSampleQuery(query);
      }
    }, 1000);
  };

  const handleSelectVerb = (verb: string) => {
    appContext.state.selectedVerb = verb;
  };

  const toggleSidebar = (): void => {
    const shouldShowSidebar = setSidebarProperties();
    changeDimensions(shouldShowSidebar ? '28%' : '4%');
    telemetry.trackEvent(
      eventTypes.BUTTON_CLICK_EVENT,
      {
        ComponentName: componentNames.SIDEBAR_HAMBURGER_BUTTON
      });
  };

  const displayToggleButton = (mediaQueryList: any) => {
    const mobileScreen = mediaQueryList.matches;
    let showSidebar = true;
    if (mobileScreen) {
      showSidebar = false;
    }

    const properties = {
      mobileScreen,
      showSidebar
    };
    if (showSidebar) {
      changeDimensions('28%');
    }

    props.actions.toggleSidebar(properties);
  };

  const setSidebarProperties = () => {
    const { sidebarProperties } = props;
    const properties = { ...sidebarProperties };
    const shouldShowSidebar = !properties.showSidebar;
    properties.showSidebar = shouldShowSidebar;
    props.actions.toggleSidebar(properties);
    return shouldShowSidebar;
  };

  const resizeSideBar = (sidebarWidth: string) => {
    const breakPoint = 15;
    const width = changeDimensions(sidebarWidth);
    const { sidebarProperties } = props;
    const minimised = !sidebarProperties.showSidebar;
    if ((width <= breakPoint && !minimised) || (width > breakPoint && minimised)) {
      setSidebarProperties();
    }
  };

  const changeDimensions = (sidebarWidth: string): number => {
    const maxWidth = 98;
    const width = parseFloat(sidebarWidth.replace('%', ''));

    const { dimensions, actions }: any = props;
    const dimensionsToUpdate = { ...dimensions };
    dimensionsToUpdate.content.width = `${maxWidth - width}%`;
    dimensionsToUpdate.sidebar.width = `${width}%`;
    if (actions) {
      actions.setDimensions(dimensionsToUpdate);
    }
    return width;
  };

  const shouldDisplayContent = (parameters: any) => {
    const { graphExplorerMode, mobileScreen, showSidebar } = parameters;
    return !(graphExplorerMode === Mode.Complete && mobileScreen && showSidebar);
  };

  const removeFlexBasisProperty = () => {
    const collection = document.getElementsByClassName('layout');
    if (collection?.length === 0) {
      return;
    }
    const element: any = collection[0];
    element.style.removeProperty('flex-basis');
  };

  const removeSidebarHeightProperty = () => {
    const collection = document.getElementsByClassName('resizable-sidebar');
    if (collection?.length === 0) {
      return;
    }
    const element: any = collection[0];
    element.style.removeProperty('height');
  };

  const {
    authenticated,
    graphExplorerMode,
    minimised,
    sampleQuery,
    sidebarProperties,
    dimensions
  }: any = props;
  const { sidebar, content } = dimensions;

  let sidebarWidth = styles.sidebar;
  let layout = '';
  let sideWidth: string = sidebar.width;
  let maxWidth = '50%';
  let contentWidth = content.width;

  const query = createShareLink(sampleQuery, authenticated);
  const { showSidebar } = sidebarProperties;
  const mobileScreen = appContext.state.mobileScreen;

  const displayContent = shouldDisplayContent({
    graphExplorerMode,
    mobileScreen,
    showSidebar
  });

  if (appContext.state.mobileScreen) {
    layout = sidebarWidth = 'ms-Grid-col ms-sm12';
    sideWidth = '100%';
    maxWidth = '100%';
    contentWidth = '100%';
    layout += ' layout';
  } else if (minimised) {
    sidebarWidth = styles.sidebarMini;
  }

  removeFlexBasisProperty();
  removeSidebarHeightProperty();

  return (
    <FluentProvider theme={appContext.state.theme.fluentTheme}>
      <PopupsProvider>
        <div className={`ms-Grid ${styles.app}`} style={{ paddingLeft: mobileScreen ? '15px' : undefined }}>
          <MainHeader toggleSidebar={toggleSidebar} />
          <Announced
            message={
              !showSidebar
                ? translateMessage('Sidebar minimized')
                : translateMessage('Sidebar maximized')
            }
          />
          <div
            className={`ms-Grid-row ${styles.appRow}`}
            style={{
              flexWrap: appContext.state.mobileScreen ? 'wrap' : undefined,
              marginRight: showSidebar ? '-20px' : undefined,
              flexDirection: graphExplorerMode === Mode.TryIt ? 'column' : 'row'
            }}
          >
            {graphExplorerMode === Mode.Complete && (
              <Resizable
                onResize={(e: any, direction: any, ref: any) => {
                  if (ref?.style?.width) {
                    resizeSideBar(ref.style.width);
                  }
                }}
                className={`ms-Grid-col ms-sm12 ms-md4 ms-lg4 ${sidebarWidth} resizable-sidebar`}
                minWidth={'71'}
                maxWidth={maxWidth}
                enable={{
                  right: true
                }}
                handleClasses={{
                  right: styles.vResizeHandle
                }}
                bounds={'parent'}
                size={{
                  width: sideWidth,
                  height: ''
                }}
              >
                <Sidebar
                  currentTab={appContext.state.sidebarTabSelection}
                  setSidebarTabSelection={setSidebarTabSelection}
                  showSidebar={showSidebar}
                  toggleSidebar={toggleSidebar}
                  mobileScreen={appContext.state.mobileScreen}
                />
              </Resizable>
            )}
            {graphExplorerMode === Mode.TryIt && headerMessaging(query)}

            {displayContent && (
              <Resizable
                bounds={'window'}
                className={`ms-Grid-col ms-sm12 ms-md4 ms-lg4 ${layout}`}
                enable={{
                  right: false
                }}
                size={{
                  width: graphExplorerMode === Mode.TryIt ? '100%' : contentWidth,
                  height: ''
                }}
                style={!sidebarProperties.showSidebar && !appContext.state.mobileScreen ? {
                  marginLeft: '8px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', flex: 1
                } : {
                  display: 'flex', flexDirection: 'column', alignItems: 'stretch', flex: 1
                }}
              >
                <ValidationProvider>
                  <div style={{ marginBottom: 2 }} >
                    <QueryRunner onSelectVerb={handleSelectVerb} />
                  </div>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'stretch', flex: 1
                  }}>
                    <div>
                      <StatusMessages />
                    </div>
                    <QueryResponse />
                  </div>
                </ValidationProvider>
              </Resizable>
            )}
          </div>
          <div>
            <TermsOfUseMessage />
          </div>
        </div>
        <PopupsWrapper />
      </PopupsProvider>
    </FluentProvider>
  );
};

const mapStateToProps = ({
  sidebarProperties,
  dimensions,
  profile,
  sampleQuery,
  auth: { authToken },
  graphExplorerMode
}: ApplicationState) => {
  const mobileScreen = !!sidebarProperties.mobileScreen;
  const showSidebar = !!sidebarProperties.showSidebar;

  return {
    graphExplorerMode,
    profile,
    receivedSampleQuery: sampleQuery,
    sidebarProperties,
    minimised: !mobileScreen && !showSidebar,
    sampleQuery,
    dimensions,
    authenticated: !!authToken.token
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(
      {
        runQuery,
        setSampleQuery,
        toggleSidebar,
        signIn,
        storeScopes,
        setDimensions
      },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
