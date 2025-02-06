import { ITheme } from '@fluentui/react';
import {
  FluentProvider,
  teamsHighContrastTheme,
  Theme,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { Component } from 'react';
import { connect } from 'react-redux';

import { removeSpinners } from '../..';
import { authenticationWrapper } from '../../modules/authentication';
import { ApplicationState } from '../../store';
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
import { GRAPH_URL } from '../services/graph-constants';
import { signIn, storeScopes } from '../services/slices/auth.slice';
import { setDimensions } from '../services/slices/dimensions.slice';
import { runQuery } from '../services/slices/graph-response.slice';
import { setSampleQuery } from '../services/slices/sample-query.slice';
import { toggleSidebar } from '../services/slices/sidebar-properties.slice';
import { changeTheme } from '../services/slices/theme.slice';
import { parseSampleUrl } from '../utils/sample-url-generation';
import { substituteTokens } from '../utils/token-helpers';
import { parse, ParsedMessageResult } from './query-runner/util/iframe-message-parser';
import { Layout } from './layout/Layout';
import { KeyboardCopyEvent } from './common/copy-button/KeyboardCopyEvent';
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

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      selectedVerb: 'GET',
      mobileScreen: false,
      hideDialog: true,
      sidebarTabSelection: 'sample-queries'
    };
  }

  public componentDidMount = async () => {
    removeSpinners();
    KeyboardCopyEvent();

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sid');

    if (sessionId) {
      const authResp = await authenticationWrapper.logIn(sessionId);
      if (authResp) {
        this.props.actions!.signIn(authResp.accessToken);
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
    loadGETheme(savedTheme); // TODO: Remove when cleaning up
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

  private generateQueryObjectFrom(queryParams: ISharedQueryParams) {
    const { request, method, version, graphUrl, requestBody, headers } = queryParams;

    if (!request) {
      return null;
    }

    return {
      sampleUrl: `${graphUrl}/${version}/${request}`,
      selectedVerb: method,
      selectedVersion: version,
      sampleBody: requestBody ? this.hashDecode(requestBody) : null,
      sampleHeaders: headers ? (JSON.parse(this.hashDecode(headers)) as { name: string; value: string }[]) : []
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
  }

  private handleThemeChangeMsg = (msg: IThemeChangedMessage) => {
    loadGETheme(msg.theme); // TODO: remove when done moving to fluent ui

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
    const { verb, headers, url, body }: ParsedMessageResult = parse(msg.code);
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
        const requestHeaders = headers.map((header: { name: string, value: string }) => {
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

  public render() {
    const fluentV9Themes: Record<string, Theme> = {
      light: webLightTheme,
      dark: webDarkTheme,
      'high-contrast': teamsHighContrastTheme
    };
    return (
      <FluentProvider theme={fluentV9Themes[this.props.appTheme]}>
        <ThemeContext.Provider value={this.props.appTheme}>
          <Layout handleSelectVerb={this.handleSelectVerb} />
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
