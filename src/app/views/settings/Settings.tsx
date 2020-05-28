import {
  ChoiceGroup,
  DefaultButton,
  Dialog,
  DialogType,
  IconButton,
  Label,
  Panel,
  PanelType,
  PrimaryButton
} from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../appLocale';
import { loadGETheme } from '../../../themes';
import { AppTheme } from '../../../types/enums';
import { ISettingsProps } from '../../../types/settings';
import { signOut } from '../../services/actions/auth-action-creators';
import { consentToScopes } from '../../services/actions/permissions-action-creator';
import { changeTheme } from '../../services/actions/theme-action-creator';
import { Permission } from '../query-runner/request/permissions';

function Settings(props: ISettingsProps) {
  const dispatch = useDispatch();

  const [ themeChooserDialogHidden, hideThemeChooserDialog] = useState(true);
  const [ items, setItems] = useState([]);
  const [ selectedPermissions, setSelectedPermissions] = useState([]);
  const [ panelIsOpen, setPanelState] = useState(false);

  const {
    intl: { messages }
  }: any = props;

  const authenticated = useSelector((state: any) => (!!state.authToken));
  const appTheme = useSelector((state: any) => (state.theme));

  useEffect(() => {
    const menuItems: any = [
      {
        key: 'office-dev-program',
        text: messages['Office Dev Program'],
        href: `https://developer.microsoft.com/${geLocale}/office/dev-program`,
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
        onClick: () => toggleThemeChooserDialogState(),
      }
    ];

    if (authenticated) {
      menuItems.push(
        {
          key: 'change-theme',
          text: messages['view all permissions'],
          iconProps: {
            iconName: 'AzureKeyVault',
          },
          onClick: () => togglePermissionsPanel(),
        },
        {
          key: 'sign-out',
          text: messages['sign out'],
          iconProps: {
            iconName: 'SignOut',
          },
          onClick: () => handleSignOut(),
        }
      );
    }
    setItems(menuItems);
  }, [authenticated]);

  const toggleThemeChooserDialogState = () => {
    let hidden = themeChooserDialogHidden;
    hidden = !hidden;
    hideThemeChooserDialog(hidden);
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const handleChangeTheme = (selectedTheme: any) => {
    const newTheme: AppTheme = selectedTheme.key;
    dispatch(changeTheme(newTheme));
    loadGETheme(newTheme);
  };

  const togglePermissionsPanel = () => {
    let open = !!panelIsOpen;
    open = !open;
    setPanelState(open);
    setSelectedPermissions([]);
  };

  const setPermissions = (permissions: []) => {
    setSelectedPermissions(permissions);
  };

  const handleConsent = () => {
    dispatch(consentToScopes(selectedPermissions));
  };

  const getSelectionDetails = () => {
    const selectionCount = selectedPermissions.length;

    switch (selectionCount) {
      case 0:
        return '';
      case 1:
        return `1 ${messages.selected}: ` + selectedPermissions[0];
      default:
        return `${selectionCount} ${messages.selected}`;
    }
  };

  const onRenderFooterContent = () => {
    return (
      <div>
        <Label>{getSelectionDetails()}</Label>
        <PrimaryButton disabled={selectedPermissions.length === 0} onClick={() => handleConsent()}>
          <FormattedMessage id='Consent' />
        </PrimaryButton>
        <DefaultButton onClick={() => togglePermissionsPanel()}>
          <FormattedMessage id='Cancel' />
        </DefaultButton>
      </div>
    );
  };

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
          hidden={themeChooserDialogHidden}
          onDismiss={() => toggleThemeChooserDialogState()}
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
            onChange={(event, selectedTheme) => handleChangeTheme(selectedTheme)}
          />
        </Dialog>

        <Panel
          isOpen={panelIsOpen}
          onDismiss={() => togglePermissionsPanel}
          type={PanelType.medium}
          hasCloseButton={true}
          headerText={messages.Permissions}
          onRenderFooterContent={onRenderFooterContent}
          isFooterAtBottom={true}
          closeButtonAriaLabel='Close'
        >
          <Permission panel={true} setPermissions={setPermissions} />
        </Panel>
      </div>
    </div>
  );
}

export default injectIntl(Settings);
