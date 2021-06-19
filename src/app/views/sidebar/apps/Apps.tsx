import { driver } from 'localforage';
import {
  Announced,
  ContextualMenuItemType, DefaultButton, DetailsList, DetailsRow, Dialog,
  DialogFooter, DialogType, getId, getTheme, IColumn, IconButton,
  Label, MessageBar, MessageBarType, PrimaryButton, SearchBox, SelectionMode, styled, TooltipHost, ActionButton, Icon
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { consoleTestResultHandler } from 'tslint/lib/test';

import { IRootState } from '../../../../types/root';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../../services/actions/query-input-action-creators';
import * as queryStatusActionCreators from '../../../services/actions/query-status-action-creator';
import * as requestHistoryActionCreators from '../../../services/actions/request-history-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';

export class Apps extends Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      appItems: [],
    };
  }

  public renderRow = (props: any): any => {
    const classes = classNames(this.props);
    return (
      <ActionButton style={{ display: 'block', margin: 'auto', backgroundColor: "#0078d4", color: "white", marginBottom: 10 }} >Test App</ActionButton>
    );
  };

  public render() {

    const classes = classNames(this.props);
    const a = <ActionButton style={{ display: 'block', margin: 'auto', backgroundColor: "#0078d4", color: "white", marginBottom: 10 }} >Test App 2</ActionButton>
    const appItems = [a, a]
    return (
      <>
        <div>
          <hr />
          <SearchBox
            className={classes.searchBox}
            styles={{ field: { paddingLeft: 10 } }}
          />
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={true}
            dismissButtonAriaLabel='Close'
          >
            <FormattedMessage id='These are the apps you can login as' />
            .
          </MessageBar>
          <DetailsList
            className={classes.queryList}
            items={appItems}
            selectionMode={SelectionMode.none}
            onRenderRow={this.renderRow}
            isHeaderVisible={false}
          />

        </div>
      </>
    );
  }
}

function mapStateToProps({ apps }: any) {
  return {
    a: apps
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    submitNewApp: (app: any) => {
      dispatch(app);
    }
  };
}


// @ts-ignore
const styledSampleQueries = styled(Apps, sidebarStyles);
// @ts-ignore
const IntlSampleQueries = injectIntl(styledSampleQueries);
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(IntlSampleQueries);

