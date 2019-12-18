import { IconButton } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as authActionCreators from '../../../services/actions/auth-action-creators';

export interface IMoreActionsProps {
  actions?: {
    signOut: Function;
  };
  intl?: {
    message: object;
  };
  authenticated: boolean;
}

class MoreActions extends Component<IMoreActionsProps, any> {
  constructor(props: IMoreActionsProps) {
    super(props);
  }

  public handleSignOut = () => {
    const { actions } = this.props;
    if (actions) {
      actions.signOut();
    }
  }

  public render() {

    const {
      intl: { messages },
      authenticated,
    }: any = this.props;

    const items: any = [
      {
        key: 'office-dev-program',
        text: messages['Office Dev Program'],
        href: 'https://developer.microsoft.com/en-us/office/dev-program',
        target: '_blank',
        iconProps: {
          iconName: 'CommandPrompt',
        },
      }
    ];

    if (authenticated) {
      items.push({
        key: 'sign-out',
        text: messages['sign out'],
        iconProps: {
          iconName: 'SignOut',
        },
        onClick: () => this.handleSignOut(),
      });
    }

    const menuProperties = {
      shouldFocusOnMount: true,
      alignTargetEdge: true,
      items
    };

    return (
      <IconButton
        ariaLabel='More actions'
        role='button'
        styles={{
          label: { marginBottom: -20 },
          icon: { marginBottom: -20 }
        }}
        menuIconProps={{ iconName: 'Settings' }}
        title='More actions'
        menuProps={menuProperties} />
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(authActionCreators, dispatch)
  };
}

function mapStateToProps(state: any) {
  return {
    authenticated: !!state.authToken,
  };
}

// @ts-ignore
const IntlMoreActions = injectIntl(MoreActions);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntlMoreActions);
