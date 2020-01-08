import {
  ChoiceGroup,
  Dialog,
  DialogType,
  IconButton
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { loadGETheme } from '../../../themes';
import { AppTheme } from '../../../types/enums';
import { ISettingsProps, ISettingsState } from '../../../types/settings';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as themeAtionCreators from '../../services/actions/theme-action-creator';


class Settings extends Component<ISettingsProps, ISettingsState> {
  constructor(props: ISettingsProps) {
    super(props);
    this.state = {
      hideThemeChooserDialog: true,
      items: []
    };
  }

  public componentDidMount = () => {
    const {
      authenticated,
      intl: { messages }
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

    this.setState({ items });
  }

  public toggleThemeChooserDialogState = () => {
    this.setState({ hideThemeChooserDialog: !this.state.hideThemeChooserDialog });
  }

  public handleSignOut = () => {
    this.props.actions!.signOut();
  }

  public handleChangeTheme = (selectedTheme: any) => {
    const newTheme: AppTheme = selectedTheme.key;
    this.props.actions!.changeTheme(newTheme);
    loadGETheme(newTheme);
  }

  public render() {

    const {
      intl: { messages },
      appTheme
    }: any = this.props;

    const { hideThemeChooserDialog, items } = this.state;

    const menuProperties = {
      shouldFocusOnMount: true,
      alignTargetEdge: true,
      items
    };

    return (
      <div>
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
        <div>
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
                  key: AppTheme.Light,
                  iconProps: { iconName: 'Light' },
                  text: messages.Light
                },
                {
                  key: AppTheme.Dark,
                  iconProps: { iconName: 'CircleFill' },
                  text: messages.Dark
                },
                {
                  key: AppTheme.HighContrast,
                  iconProps: { iconName: 'Contrast' },
                  text: messages['High Contrast'],
                }
              ]}
              onChange={(event, selectedTheme) => this.handleChangeTheme(selectedTheme)}
            />
          </Dialog>
        </div>
      </div>
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
