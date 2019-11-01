import { FontSizes, Icon, Label, PrimaryButton, Stack, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { FormattedMessage } from 'react-intl';
import { IAuthenticationProps } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import { logIn } from '../../services/graph-client/MsalService';
import { classNames } from '../classnames';
import { authenticationStyles } from './Authentication.styles';
import Profile from './profile/Profile';

export class Authentication extends Component<IAuthenticationProps> {
  constructor(props: IAuthenticationProps) {
    super(props);
  }

  public signIn = async (): Promise<void> => {
    const { mscc } = (window as any);

    if (mscc) {
      mscc.setConsent();
    }

    const authResponse = await logIn();
    if (authResponse) {
      this.props.actions!.signIn(authResponse.accessToken);
      this.props.actions!.storeScopes(authResponse.scopes);
    }
  };

  public render() {
    const { tokenPresent, mobileScreen } = this.props;
    const classes = classNames(this.props);

    const authLabel = {
      fontSize: FontSizes.large,
      fontWeight: 400,
    };

    const authIcon = {
      margin: '0 5px'
    };

    const authenticationStack = <Stack>
      <Stack.Item align='start'>
        {!tokenPresent &&
          <PrimaryButton
            ariaLabel='Sign-in button'
            role='button'
            iconProps={{ iconName: 'Contact' }}
            onClick={this.signIn}
          >
            {!mobileScreen && <FormattedMessage id='sign in' />}
          </PrimaryButton>}
        {tokenPresent && <Profile />}
      </Stack.Item>
    </Stack>;


    return (
      <div className={classes.authenticationContainer}>
        {!mobileScreen && <Stack>
          {!tokenPresent &&
            <>
              <Label style={authLabel}>
                <Icon iconName='Permissions' style={authIcon} />
                <FormattedMessage id='Authentication' />
              </Label>
              <br />
              <Label>
                <FormattedMessage id='Using demo tenant' /> <FormattedMessage id='To access your own data:' />
              </Label>
            </>
          }
          <span><br />{authenticationStack}<br /> </span>
        </Stack>}

        {mobileScreen && authenticationStack}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    tokenPresent: !!state.authToken,
    mobileScreen: !!state.sidebarProperties.showToggle,
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(authActionCreators, dispatch)
  };
}

// @ts-ignore
const StyledAuthentication = styled(Authentication, authenticationStyles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledAuthentication);
