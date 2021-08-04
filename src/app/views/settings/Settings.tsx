import {
  ChoiceGroup,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  DropdownMenuItemType,
  getId,
  IconButton,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  TooltipHost,
} from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import '../../utils/string-operations';
import { geLocale } from '../../../appLocale';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { loadGETheme } from '../../../themes';
import { AppTheme } from '../../../types/enums';
import { IRootState } from '../../../types/root';
import { ISettingsProps } from '../../../types/settings';
import { signOut } from '../../services/actions/auth-action-creators';
import { consentToScopes } from '../../services/actions/permissions-action-creator';
import { togglePermissionsPanel } from '../../services/actions/permissions-panel-action-creator';
import { changeMode } from '../../services/actions/permission-mode-action-creator';
import { changeTheme } from '../../services/actions/theme-action-creator';
import { Permission } from '../query-runner/request/permissions';
import { translateMessage } from '../../utils/translate-messages';
import { PERMISSION_MODE_TYPE, TEAMS_APP_INSTALLATION_URL } from '../../services/graph-constants';
import { toggleRSCPopup } from '../../services/actions/query-action-creators'
import { IQuery } from '../../../types/query-runner';
import { setSampleQuery } from '../../services/actions/query-input-action-creators';

function Settings(props: ISettingsProps) {
  const dispatch = useDispatch();
  const {
    permissionsPanelOpen,
    authToken,
    theme: appTheme,
    permissionModeType
  } = useSelector((state: IRootState) => state);
  const authenticated = authToken.token;
  const [themeChooserDialogHidden, hideThemeChooserDialog] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const {
    intl: { messages },
  }: any = props;

  useEffect(() => {
    const menuItems: any = [
      {
        key: 'office-dev-program',
        text: translateMessage('Office Dev Program'),
        href: `https://developer.microsoft.com/${geLocale}/office/dev-program`,
        target: '_blank',
        iconProps: {
          iconName: 'CommandPrompt',
        },
        onClick: () => trackOfficeDevProgramLinkClickEvent(),
      },
      {
        key: 'report-issue',
        text: translateMessage('Report an Issue'),
        href: 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4/issues/new/choose',
        target: '_blank',
        iconProps: {
          iconName: 'ReportWarning',
        },
        onClick: () => trackReportAnIssueLinkClickEvent(),
      },
      {
        key: 'divider',
        text: '-',
        itemType: DropdownMenuItemType.Divider,
      },
      {
        key: 'change-theme',
        text: translateMessage('Change theme'),
        iconProps: {
          iconName: 'Color',
        },
        onClick: () => toggleThemeChooserDialogState(),
      },
    ];

    if (permissionModeType === PERMISSION_MODE_TYPE.User) {
      menuItems.push({
        key: 'view-all-permissions',
        text: translateMessage('view all permissions'),
        iconProps: {
          iconName: 'AzureKeyVault',
        },
        onClick: () => changePanelState(),
      });
    }

    if (authenticated) {
      menuItems.push(
        {
          key: 'switch-user-app-mode',
          text: translateMessage(permissionModeType
            ? "Use Graph Explorer as a sample Teams application"
            : "Use Graph Explorer as a signed in user"),
          iconProps: {
            iconName: permissionModeType ? "TeamsLogo" : "Contact",
          },
          onClick: () => handleChangeMode(permissionModeType),
        },
        {
          key: 'sign-out',
          text: translateMessage('sign out'),
          iconProps: {
            iconName: 'SignOut',
          },
          onClick: () => handleSignOut(),
        }
      );
    }
    setItems(menuItems);
  }, [authenticated, permissionModeType]);

  const toggleThemeChooserDialogState = () => {
    let hidden = themeChooserDialogHidden;
    hidden = !hidden;
    hideThemeChooserDialog(hidden);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.THEME_CHANGE_BUTTON,
    });
  };

  const handleChangeMode = (permissionModeType: PERMISSION_MODE_TYPE) => {
    const query: IQuery = {
      sampleUrl: TEAMS_APP_INSTALLATION_URL,
      selectedVerb: "GET",
      selectedVersion: "v1.0",
      sampleHeaders: []
    }
    const teamsAppQuery: IQuery = {
      sampleUrl: "https://graph.microsoft.com/v1.0/teams/{team-id}/members",
      selectedVerb: "GET",
      selectedVersion: "v1.0",
      sampleHeaders: []
    }
    const userQuery: IQuery = {
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      selectedVerb: 'GET',
      sampleHeaders: [],
      selectedVersion: 'v1.0',
    }
    let newPermissionModeType = PERMISSION_MODE_TYPE.TeamsApp;
    switch (permissionModeType) {
      case PERMISSION_MODE_TYPE.User:
        dispatch(changeMode(newPermissionModeType));
        dispatch(toggleRSCPopup(query));
        dispatch(setSampleQuery(teamsAppQuery));
        break;
      case PERMISSION_MODE_TYPE.TeamsApp:
        newPermissionModeType = PERMISSION_MODE_TYPE.User;
        dispatch(changeMode(newPermissionModeType));
        dispatch(setSampleQuery(userQuery));
        break;
    }
    telemetry.trackEvent(
      eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.CHANGE_PERMISSIONS_MODE_BUTTON,
      PermissionMode: newPermissionModeType
    });
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const handleChangeTheme = (selectedTheme: any) => {
    const newTheme: string = selectedTheme.key;
    dispatch(changeTheme(newTheme));
    loadGETheme(newTheme);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: selectedTheme.key.replace('-', ' ').toSentenceCase(),
    });
  };

  const changePanelState = () => {
    let open = !!permissionsPanelOpen;
    open = !open;
    dispatch(togglePermissionsPanel(open));
    setSelectedPermissions([]);
    trackSelectPermissionsButtonClickEvent();
  };

  const trackSelectPermissionsButtonClickEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.VIEW_ALL_PERMISSIONS_BUTTON,
    });
  };

  const trackReportAnIssueLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.REPORT_AN_ISSUE_LINK,
    });
  };

  const setPermissions = (permissions: []) => {
    setSelectedPermissions(permissions);
  };

  const handleConsent = () => {
    dispatch(consentToScopes(selectedPermissions));
    setSelectedPermissions([]);
  };

  const trackOfficeDevProgramLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.OFFICE_DEV_PROGRAM_LINK,
    });
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
        <PrimaryButton
          disabled={selectedPermissions.length === 0}
          onClick={() => handleConsent()}
          style={{ marginRight: 10 }}
        >
          <FormattedMessage id='Consent' />
        </PrimaryButton>
        <DefaultButton onClick={() => changePanelState()}>
          <FormattedMessage id='Cancel' />
        </DefaultButton>
      </div>
    );
  };

  const menuProperties = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items,
  };

  return (
    <div>
      <TooltipHost
        content={translateMessage('More actions')}
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
      >
        <IconButton
          ariaLabel={translateMessage('More actions')}
          role='button'
          styles={{
            label: { marginBottom: -20 },
            menuIcon: { fontSize: 20 },
          }}
          menuIconProps={{ iconName: 'More' }}
          menuProps={menuProperties}
        />
      </TooltipHost>
      <div>
        <Dialog
          hidden={themeChooserDialogHidden}
          onDismiss={() => toggleThemeChooserDialogState()}
          dialogContentProps={{
            type: DialogType.normal,
            title: translateMessage('Change theme'),
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
                text: messages.Light,
              },
              {
                key: AppTheme.Dark,
                iconProps: { iconName: 'CircleFill' },
                text: messages.Dark,
              },
              {
                key: AppTheme.HighContrast,
                iconProps: { iconName: 'Contrast' },
                text: translateMessage('High Contrast'),
              }
            ]}
            onChange={(event, selectedTheme) =>
              handleChangeTheme(selectedTheme)
            }
          />
          <DialogFooter>
            <DefaultButton
              text={messages.Close}
              onClick={() => toggleThemeChooserDialogState()}
            />
          </DialogFooter>
        </Dialog>

        <Panel
          isOpen={permissionsPanelOpen}
          onDismiss={() => changePanelState()}
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
