import {
  ChoiceGroup, Dialog, DialogType, IconButton
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as themeAtionCreators from '../../services/actions/theme-action-creator';

export interface ISettingsProps {
  actions?: {
    signOut: Function;
    changeTheme: Function;
  };
  intl?: {
    message: object;
  };
  authenticated: boolean;
  appTheme: string;
}

class Settings extends Component<ISettingsProps, any> {
  constructor(props: ISettingsProps) {
    super(props);
    this.state = {
      hideThemeChooserDialog: true,
    };
  }

  public toggleThemeChooserDialogState = () => {
    this.setState({ hideThemeChooserDialog: !this.state.hideThemeChooserDialog });
  }

  public handleSignOut = () => {
    this.props.actions!.signOut();
  }

  public handleChangeTheme = (event: any, option: any) => {
    const newTheme = option.key;
    this.props.actions!.changeTheme(newTheme);
    window.location.reload();
  }

  public render() {

    const {
      intl: { messages },
      authenticated,
      appTheme
    }: any = this.props;

    const { hideThemeChooserDialog } = this.state;

    const items: any = [
      {
        key: 'office-dev-program',
        text: messages['Office Dev Program'],
        href: 'https://developer.microsoft.com/en-us/office/dev-program',
        target: '_blank',
        iconProps: {
          iconName: 'CommandPrompt',
        },
      },
      {
        key: 'change-theme',
        text: messages['Change theme'],
        iconProps: {
          iconName: 'Color',
        },
        onClick: () => this.toggleThemeChooserDialogState(),
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
      <>
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

        <Dialog
          hidden={hideThemeChooserDialog}
          onDismiss={this.toggleThemeChooserDialogState}
          dialogContentProps={{
            type: DialogType.normal,
            title: messages['Change theme'],
            isMultiline: false,
          }}
        >

          <ChoiceGroup
            label='Pick one theme'
            defaultSelectedKey={appTheme}
            options={[
              {
                key: 'light',
                iconProps: { iconName: 'Light' },
                text: 'Light'
              },
              {
                key: 'dark',
                iconProps: { iconName: 'CircleFill' },
                text: 'Dark'
              },
              {
                key: 'high-contrast',
                iconProps: { iconName: 'Contrast' },
                text: 'High Contrast',
              }
            ]}
            onChange={(event, option) => this.handleChangeTheme(event, option)}
          />
        </Dialog>
      </>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators({
      ...themeAtionCreators,
      ...authActionCreators
    }, dispatch)
  };
}

function mapStateToProps(state: any) {
  return {
    authenticated: !!state.authToken,
    appTheme: state.theme,
  };
}

// @ts-ignore
const IntlSettings = injectIntl(Settings);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntlSettings);
