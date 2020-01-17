import {
  IconButton, IStackTokens, ITheme,
  Label, MessageBar, MessageBarType, Stack, styled
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { loadGETheme } from '../../themes';
import { ThemeContext } from '../../themes/theme-context';
import { Mode } from '../../types/enums';
import { IInitMessage, IQuery, IThemeChangedMessage } from '../../types/query-runner';
import { ISharedQueryParams } from '../../types/share-query';
import { ISidebarProps } from '../../types/sidebar';
import { runQuery } from '../services/actions/query-action-creators';
import { setSampleQuery } from '../services/actions/query-input-action-creators';
import { clearQueryStatus } from '../services/actions/query-status-action-creator';
import { addRequestHeader } from '../services/actions/request-headers-action-creators';
import { clearTermsOfUse } from '../services/actions/terms-of-use-action-creator';
import { changeThemeSuccess } from '../services/actions/theme-action-creator';
import { toggleSidebar } from '../services/actions/toggle-sidebar-action-creator';
import { getLoginType } from '../services/graph-client/msal-service';
import { parseSampleUrl } from '../utils/sample-url-generation';
import { substituteTokens } from '../utils/token-helpers';
import { appStyles } from './App.styles';
import { Authentication } from './authentication';
import { classNames } from './classnames';
import { Banner } from './opt-in-out-banner';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';
import { parse } from './query-runner/util/iframe-message-parser';
import { Sidebar } from './sidebar/Sidebar';


interface IAppProps {
  theme?: ITheme;
  styles?: object;
  profile: object;
  queryState: object | null;
  termsOfUse: boolean;
  graphExplorerMode: Mode;
  sidebarProperties: ISidebarProps;
  actions: {
    addRequestHeader: Function;
    clearQueryStatus: Function;
    clearTermsOfUse: Function;
    setSampleQuery: Function;
    runQuery: Function;
    toggleSidebar: Function;
  };
}

interface IAppState {
  selectedVerb: string;
  mobileScreen: boolean;
}

class App extends Component<IAppProps, IAppState> {

  private mediaQueryList = window.matchMedia('(max-width: 767px)');

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      selectedVerb: 'GET',
      mobileScreen: false,
    };
  }

  public componentDidMount = () => {
    this.displayToggleButton(this.mediaQueryList);
    this.mediaQueryList.addListener(this.displayToggleButton);

    const whiteListedDomains = [
      'https://docs.microsoft.com',
      'https://review.docs.microsoft.com',
      'https://ppe.docs.microsoft.com',
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
    const method = urlParams.get('method');
    const version = urlParams.get('version');
    const graphUrl = urlParams.get('GraphUrl');
    const requestBody = urlParams.get('requestBody');

    return { request, method, version, graphUrl, requestBody };
  }

  private generateQueryObjectFrom(queryParams: any) {
    const { request, method, version, graphUrl, requestBody } = queryParams;
    if (!request) {
      return null;
    }

    return {
      sampleUrl: `${graphUrl}/${version}/${request}`,
      selectedVerb: method,
      selectedVersion: version,
      sampleBody: this.hashDecode(requestBody)
    };
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

        const query: IQuery = {
          sampleUrl: url,
          selectedVerb: verb,
          sampleBody: body,
          selectedVersion: queryVersion,
          sampleHeaders: headers
        };

        substituteTokens(query, profile);

        actions.setSampleQuery(query);
      }
    }, 1000);

    if (actions) {
      const requestHeaders = headers.map((header: any) => {
        return {
          name: Object.keys(header)[0],
          value: Object.values(header)[0]
        };
      });
      actions.addRequestHeader(requestHeaders);
    }
  };

  public handleSelectVerb = (verb: string) => {
    this.setState({
      selectedVerb: verb
    });
  };

  public toggleSidebar = (): void => {
    const { sidebarProperties } = this.props;
    const properties = { ...sidebarProperties };
    properties.showSidebar = !properties.showSidebar;
    this.props.actions!.toggleSidebar(properties);
  }

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

    this.props.actions!.toggleSidebar(properties);
  }

  public optOut = () => {
    const path = location.href;
    const urlObject: URL = new URL(path);
    const { protocol, hostname, pathname, port } = urlObject;
    const url = `${protocol}//${hostname}${(port) ? ':' + port : ''}${pathname}`;
    window.location.href = url.includes('localhost') ? 'http://localhost:3000' : `${url.replace('/preview', '')}`;
  }

  public render() {
    const classes = classNames(this.props);
    const { graphExplorerMode, queryState, minimised, termsOfUse,
      actions, sidebarProperties, intl: { messages } }: any = this.props;
    const sampleHeaderText = messages['Sample Queries'];
    // tslint:disable-next-line:no-string-literal
    const historyHeaderText = messages['History'];
    const { mobileScreen, showSidebar } = sidebarProperties;
    const language = navigator.language || 'en-US';

    let displayContent = true;
    if (graphExplorerMode === Mode.Complete) {
      if (mobileScreen && showSidebar) {
        displayContent = false;
      }
    }

    const stackTokens: IStackTokens = {
      childrenGap: 10,
      padding: 10
    };

    let sidebarWidth = `col-sm-12 col-lg-3 col-md-4 ${classes.sidebar}`;

    let layout =
      graphExplorerMode === Mode.TryIt
        ? 'col-xs-12 col-sm-12'
        : 'col-xs-12 col-sm-12 col-lg-9 col-md-8';

    if (minimised) {
      sidebarWidth = `col-lg-1 col-md-1 ${classes.sidebarMini}`;
      layout = `col-xs-12 col-sm-12 col-lg-11 col-md-11 ${classes.layoutExtra}`;
    }

    return (
      // @ts-ignore
      <ThemeContext.Provider value={this.props.appTheme}>
        <main className={`container-fluid ${classes.app}`}>
          <div className='row'>
            {graphExplorerMode === Mode.Complete && (
              <div className={sidebarWidth}>
                {mobileScreen && <Stack horizontal={true} disableShrink={true} tokens={stackTokens}>
                  <>
                    <IconButton
                      iconProps={{ iconName: 'GlobalNavButton' }}
                      className={classes.sidebarToggle}
                      title='Remove sidebar'
                      ariaLabel='Remove sidebar'
                      onClick={this.toggleSidebar}
                    />
                    <div style={{ padding: 10 }}>
                      <Label className={classes.graphExplorerLabel}>
                        Graph Explorer
                      </Label>
                      <Banner optOut={this.optOut} />
                    </div>
                    <span style={{
                      position: 'absolute',
                      marginLeft: '70%',
                    }}>

                      <Authentication />
                    </span>
                  </>
                </Stack>
                }

                {!mobileScreen &&
                  <div style={{ display: 'flex' }}>
                    <IconButton
                      iconProps={{ iconName: 'GlobalNavButton' }}
                      className={classes.sidebarToggle}
                      title='Minimise sidebar'
                      ariaLabel='Minimise sidebar'
                      onClick={this.toggleSidebar}
                    />
                    <div className={classes.graphExplorerLabelContainer}>

                      {!minimised &&
                        <>
                          <Label className={classes.graphExplorerLabel}>
                            Graph Explorer
                      </Label>
                          <span className={classes.previewButton} >
                            <Banner optOut={this.optOut} />
                          </span>
                        </>
                      }

                    </div>
                  </div>
                }


                <hr className={classes.separator} />
                {!mobileScreen && <><Authentication />
                  <hr className={classes.separator} /></>}

                {showSidebar && <>
                  <Sidebar sampleHeaderText={sampleHeaderText} historyHeaderText={historyHeaderText} />
                </>}
              </div>
            )}
            <div className={layout}>
              {graphExplorerMode === Mode.TryIt && (
                <div style={{ marginBottom: 8 }}>
                  <MessageBar
                    messageBarType={MessageBarType.warning}
                    isMultiline={true}
                  >
                    <p>
                      To try operations other than GET or to access your own data, sign in to
                      <a className={classes.links}
                        tabIndex={0}
                        href='https://developer.microsoft.com/en-us/graph/graph-explorer' target='_blank'>
                        Graph Explorer.
                      </a>
                    </p>
                  </MessageBar>
                </div>
              )}

              {displayContent && <>
                <div style={{ marginBottom: 8 }}>
                  <QueryRunner onSelectVerb={this.handleSelectVerb} />
                </div>
                {queryState && (
                  <MessageBar
                    messageBarType={queryState.messageType}
                    isMultiline={false}
                    onDismiss={actions.clearQueryStatus}
                  >
                    {`${queryState.statusText} - ${queryState.status} `}
                    {queryState.duration && <>
                      {`- ${queryState.duration}`}<FormattedMessage id='milliseconds' />
                    </>}

                  </MessageBar>
                )}
                {graphExplorerMode === Mode.Complete && termsOfUse && (
                  <MessageBar
                    messageBarType={MessageBarType.info}
                    isMultiline={true}
                    onDismiss={actions.clearTermsOfUse}
                  >
                    <FormattedMessage id='use the Microsoft Graph API' />
                    <br /><br />
                    <div>
                      <a className={classes.links}
                        href={'https://docs.microsoft.com/' + language +
                          '/legal/microsoft-apis/terms-of-use?context=graph/context'}
                        target='_blank'>
                        <FormattedMessage id='Terms of use' /></a>
                      &nbsp;,
                        <a className={classes.links}
                        href={'https://privacy.microsoft.com/' + language + '/privacystatement'}
                        target='_blank'>
                        <FormattedMessage id='Microsoft Privacy Statement' /></a>
                    </div>
                  </MessageBar>
                )}
                {
                  // @ts-ignore
                  <QueryResponse verb={this.state.selectedVerb} />
                }
              </>}
            </div>
          </div>
        </main>
      </ThemeContext.Provider>
    );
  }
}

const mapStateToProps = (state: any) => {
  const mobileScreen = !!state.sidebarProperties.mobileScreen;
  const showSidebar = !!state.sidebarProperties.showSidebar;

  return {
    appTheme: state.theme,
    graphExplorerMode: state.graphExplorerMode,
    profile: state.profile,
    queryState: state.queryRunnerStatus,
    receivedSampleQuery: state.sampleQuery,
    sidebarProperties: state.sidebarProperties,
    termsOfUse: state.termsOfUse,
    minimised: !mobileScreen && !showSidebar
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators({
      clearQueryStatus,
      clearTermsOfUse,
      runQuery,
      setSampleQuery,
      addRequestHeader,
      toggleSidebar,
      changeTheme: (newTheme: string) => {
        return (disp: Function) => disp(changeThemeSuccess(newTheme));
      }
    }, dispatch)
  };
};

const StyledApp = styled(App, appStyles as any);
const IntlApp = injectIntl(StyledApp);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntlApp);


