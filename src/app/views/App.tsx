import { getTheme, ITheme, styled } from '@fluentui/react';
import {
  FluentProvider,
  teamsHighContrastTheme,
  Theme,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { Resizable } from 're-resizable';
import { Component } from 'react';
import { connect } from 'react-redux';

import { removeSpinners } from '../..';
import { authenticationWrapper } from '../../modules/authentication';
import { ApplicationState } from '../../store';
import { componentNames, eventTypes, telemetry } from '../../telemetry';
import { loadGETheme } from '../../themes';
import { ThemeContext } from '../../themes/theme-context';
import { Mode } from '../../types/enums';
import {
  IInitMessage,
  IQuery,
  IThemeChangedMessage
} from '../../types/query-runner';
import { ISharedQueryParams } from '../../types/share-query';
import { ISidebarProps } from '../../types/sidebar';
import CollectionPermissionsProvider from '../services/context/collection-permissions/CollectionPermissionsProvider';
import { PopupsProvider } from '../services/context/popups-context';
import { ValidationProvider } from '../services/context/validation-context/ValidationProvider';
import { GRAPH_URL } from '../services/graph-constants';
import { signIn, storeScopes } from '../services/slices/auth.slice';
import { setDimensions } from '../services/slices/dimensions.slice';
import { runQuery } from '../services/slices/graph-response.slice';
import { setSampleQuery } from '../services/slices/sample-query.slice';
import { toggleSidebar } from '../services/slices/sidebar-properties.slice';
import { changeTheme } from '../services/slices/theme.slice';
import { parseSampleUrl } from '../utils/sample-url-generation';
import { substituteTokens } from '../utils/token-helpers';
import { translateMessage } from '../utils/translate-messages';
import { StatusMessagesV9, TermsOfUseMessageV9 } from './app-sections';
import { headerMessagingV9 } from './app-sections/HeaderMessagingV9';
import { appStyles } from './App.styles';
import { classNames } from './classnames';
import Notification from './common/banners/Notification';
import { KeyboardCopyEvent } from './common/copy-button/KeyboardCopyEvent';
import PopupsWrapper from './common/popups/PopupsWrapper';
import { createShareLink } from './common/share';
// import { MainHeader } from './main-header/MainHeader';
import { MainHeaderV9 } from './main-header/MainHeaderV9';
// import { QueryResponse } from './query-response';
import { QueryResponseV9 } from './query-response';
import { QueryRunner } from './query-runner';
import { parse } from './query-runner/util/iframe-message-parser';
// import { Sidebar } from './sidebar/Sidebar';
// import { QueryResponse } from './query-response';
import { SidebarV9 } from './sidebar/SidebarV9';
import { Layout } from './layout/Layout';
export interface IAppProps {
  theme?: ITheme;
  styles?: object;
  profile: object;
  appTheme: string;
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
    changeTheme: Function;
    setDimensions: Function;
  };
}

interface IAppState {
  selectedVerb: string;
  mobileScreen: boolean;
  hideDialog: boolean;
  sidebarTabSelection: string;
}

const getSystemTheme = (): string => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
};

class App extends Component<IAppProps, IAppState> {
  private mediaQueryList = window.matchMedia('(max-width: 992px)');
  private currentTheme: ITheme = getTheme();
  private statusAreaMobileStyle = appStyles(this.currentTheme)
    .statusAreaMobileScreen;
  private statusAreaFullScreenStyle = appStyles(this.currentTheme)
    .statusAreaFullScreen;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      selectedVerb: 'GET',
      mobileScreen: false,
      hideDialog: true,
      sidebarTabSelection: 'sample-queries'
    };
  }

  private setSidebarTabSelection = (selectedTab: string) => {
    this.setState({
      sidebarTabSelection: selectedTab
    });
  };

  public componentDidMount = async () => {
    removeSpinners();
    KeyboardCopyEvent();
    this.displayToggleButton(this.mediaQueryList);
    this.mediaQueryList.addListener(this.displayToggleButton);

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sid');

    if (sessionId) {
      const authResp = await authenticationWrapper.logIn(sessionId);
      if (authResp) {
        // @ts-ignore
        this.props.actions!.signIn(authResp.accessToken);
        // @ts-ignore
        this.props.actions!.storeScopes(authResp.scopes);
      }
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
    window.addEventListener('message', this.receiveMessage, false);
    this.handleSharedQueries();

    // Load the theme from local storage or use the system theme as the default
    const savedTheme = localStorage.getItem('appTheme') ?? getSystemTheme();
    // @ts-ignore
    this.props.actions.changeTheme(savedTheme);
    loadGETheme(savedTheme); // Remove when cleaning up
  };

  public handleSharedQueries() {
    const { actions } = this.props;
    const queryStringParams = this.getQueryStringParams();
    const query = this.generateQueryObjectFrom(queryStringParams);

    if (query) {
      // This timeout waits for monaco to initialize it's formatter.
      setTimeout(() => {
        actions!.setSampleQuery(query);
      }, 700);
    }
  }

  private getQueryStringParams(): ISharedQueryParams {
    const urlParams = new URLSearchParams(window.location.search);

    const request = urlParams.get('request');
    const method = this.validateHttpMethod(urlParams.get('method') || '');
    const version = urlParams.get('version');
    const graphUrl = urlParams.get('GraphUrl') || GRAPH_URL;
    const requestBody = urlParams.get('requestBody');
    const headers = urlParams.get('headers');

    return { request, method, version, graphUrl, requestBody, headers };
  }

  private generateQueryObjectFrom(queryParams: any) {
    const { request, method, version, graphUrl, requestBody, headers } =
      queryParams;

    if (!request) {
      return null;
    }

    return {
      sampleUrl: `${graphUrl}/${version}/${request}`,
      selectedVerb: method,
      selectedVersion: version,
      sampleBody: requestBody ? this.hashDecode(requestBody) : null,
      sampleHeaders: headers ? JSON.parse(this.hashDecode(headers)) : []
    };
  }

  private validateHttpMethod(method: string): string {
    method = method.toUpperCase();
    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if (!validMethods.includes(method)) {
      method = 'GET';
    }
    return method;
  }

  private hashDecode(requestBody: string): string {
    const decodedBody = atob(requestBody);

    if (decodedBody === 'undefined') {
      return '';
    }

    return decodedBody;
  }

  public componentWillUnmount(): void {
    window.removeEventListener('message', this.receiveMessage);
    this.mediaQueryList.removeListener(this.displayToggleButton);
  }

  private handleThemeChangeMsg = (msg: IThemeChangedMessage) => {
    loadGETheme(msg.theme);

    // @ts-ignore
    this.props.actions!.changeTheme(msg.theme);
  };

  private receiveMessage = (event: MessageEvent): void => {
    const msgEvent: IThemeChangedMessage | IInitMessage = event.data;

    switch (msgEvent.type) {
    case 'init':
      this.handleInitMsg(msgEvent);
      break;
    case 'theme-changed':
      this.handleThemeChangeMsg(msgEvent);
      break;
    default:
      return;
    }
  };

  private handleInitMsg = (msg: IInitMessage) => {
    const { actions, profile } = this.props;
    const { verb, headers, url, body }: any = parse(msg.code);
    if (actions) {
      actions.setSampleQuery({
        sampleUrl: url,
        selectedVerb: verb
      });
    }

    // Sets selected verb in App Component
    this.handleSelectVerb(verb);

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

        substituteTokens(query, profile);

        actions.setSampleQuery(query);
      }
    }, 1000);
  };

  public handleSelectVerb = (verb: string) => {
    this.setState({
      selectedVerb: verb
    });
  };

  public toggleSidebar = (): void => {
    const shouldShowSidebar = this.setSidebarProperties();
    this.changeDimensions(shouldShowSidebar ? '28%' : '4%');
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SIDEBAR_HAMBURGER_BUTTON
    });
  };

  public displayToggleButton = (mediaQueryList: any) => {
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
      this.changeDimensions('28%');
    }

    // @ts-ignore
    this.props.actions!.toggleSidebar(properties);
  };

  private setSidebarProperties() {
    const { sidebarProperties } = this.props;
    const properties = { ...sidebarProperties };
    const shouldShowSidebar = !properties.showSidebar;
    properties.showSidebar = shouldShowSidebar;
    this.props.actions!.toggleSidebar(properties);
    return shouldShowSidebar;
  }

  private resizeSideBar(sidebarWidth: string) {
    const breakPoint = 15;
    const width = this.changeDimensions(sidebarWidth);
    const { sidebarProperties } = this.props;
    const minimised = !sidebarProperties.showSidebar;
    if (
      (width <= breakPoint && !minimised) ||
      (width > breakPoint && minimised)
    ) {
      this.setSidebarProperties();
    }
  }

  private changeDimensions(sidebarWidth: string): number {
    const maxWidth = 98;
    const width = parseFloat(sidebarWidth.replace('%', ''));

    const { dimensions, actions }: any = this.props;
    const dimensionsToUpdate = {
      ...dimensions,
      content: {
        ...dimensions.content,
        width: `${maxWidth - width}%`
      },
      sidebar: {
        ...dimensions.sidebar,
        width: `${width}%`
      }
    };
    if (actions) {
      actions.setDimensions(dimensionsToUpdate);
    }
    return width;
  }

  private shouldDisplayContent(parameters: any) {
    const { graphExplorerMode, mobileScreen, showSidebar } = parameters;
    return !(
      graphExplorerMode === Mode.Complete &&
      mobileScreen &&
      showSidebar
    );
  }

  private removeFlexBasisProperty() {
    /*
    flex-basis style property is added automatically when the window resizes
    and is set to 100% leading to a distortion of the page when these exact steps are followed.
    https://github.com/microsoftgraph/microsoft-graph-explorer-v4/pull/1433#issuecomment-1036135231
    Removing the property altogether helps maintain the layout of the page.
    */

    const collection = document.getElementsByClassName('layout');
    if (collection?.length === 0) {
      return;
    }
    const element: any = collection[0];
    element.style.removeProperty('flex-basis');
  }

  private removeSidebarHeightProperty() {
    /*
    height style property is added automatically on the sidebar when the window resizes
    and is set to 100% leading to a distortion of the page when these exact steps are followed.
    https://github.com/microsoftgraph/microsoft-graph-explorer-v4/pull/1602#:~:text=Zoom
    Removing the property altogether helps maintain the layout of the page.
    */
    const collection = document.getElementsByClassName('resizable-sidebar');
    if (collection?.length === 0) {
      return;
    }
    const element: any = collection[0];
    element.style.removeProperty('height');
  }

  public render() {
    const classes = classNames(this.props);
    const {
      authenticated,
      graphExplorerMode,
      minimised,
      sampleQuery,
      sidebarProperties,
      dimensions
    }: any = this.props;
    const { sidebar, content } = dimensions;

    let sidebarWidth = classes.sidebar;
    let layout = '';
    let sideWidth = sidebar.width;
    let maxWidth = '50%';
    let contentWidth = content.width;

    const query = createShareLink(sampleQuery, authenticated);
    const { mobileScreen, showSidebar } = sidebarProperties;

    const displayContent = this.shouldDisplayContent({
      graphExplorerMode,
      mobileScreen,
      showSidebar
    });

    if (mobileScreen) {
      layout = sidebarWidth = 'ms-Grid-col ms-sm12';
      sideWidth = '100%';
      maxWidth = '100%';
      contentWidth = '100%';
      layout += ' layout';
    } else if (minimised) {
      sidebarWidth = classes.sidebarMini;
    }

    this.removeFlexBasisProperty();
    this.removeSidebarHeightProperty();

    const fluentV9Themes: Record<string, Theme> = {
      light: webLightTheme,
      dark: webDarkTheme,
      'high-contrast': teamsHighContrastTheme
    };
    return (
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      <FluentProvider theme={fluentV9Themes[this.props.appTheme]}>
        <ThemeContext.Provider value={this.props.appTheme}>
          <Layout handleSelectVerb={this.handleSelectVerb}/>
        </ThemeContext.Provider>
      </FluentProvider>
    );
  }
}

const mapStateToProps = ({
  sidebarProperties,
  theme,
  dimensions,
  profile,
  sampleQuery,
  auth: { authToken },
  graphExplorerMode
}: ApplicationState) => {
  const mobileScreen = !!sidebarProperties.mobileScreen;
  const showSidebar = !!sidebarProperties.showSidebar;

  return {
    appTheme: theme,
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
        changeTheme,
        setDimensions
      },
      dispatch
    )
  };
};

const StyledApp = styled(App, appStyles as any);

//@ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(StyledApp);
