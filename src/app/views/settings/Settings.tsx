import {
  ChoiceGroup,
  ContextualMenuItemType,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  getId,
  getTheme,
  IconButton,
  registerIcons,
  TooltipHost
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { GitHubLogoIcon } from '@fluentui/react-icons-mdl2';

import '../../utils/string-operations';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { loadGETheme } from '../../../themes';
import { AppTheme } from '../../../types/enums';
import { IRootState } from '../../../types/root';
import { ISettingsProps } from '../../../types/settings';
import { changeTheme } from '../../services/actions/theme-action-creator';
import { translateMessage } from '../../utils/translate-messages';

function Settings(props: ISettingsProps) {
  const dispatch = useDispatch();
  const {
    authToken,
    theme: appTheme
  } = useSelector((state: IRootState) => state);
  const authenticated = authToken.token;
  const [themeChooserDialogHidden, hideThemeChooserDialog] = useState(true);
  const [items, setItems] = useState([]);

  const {
    intl: { messages }
  }: any = props;

  registerIcons({
    icons: {
      GitHubLogo: <GitHubLogoIcon />
    }
  });

  useEffect(() => {
    const menuItems: any = [
      {
        key: 'change-theme',
        text: translateMessage('Change theme'),
        iconProps: {
          iconName: 'Color'
        },
        onClick: () => toggleThemeChooserDialogState()
      },
      {
        key: 'report-issue',
        text: translateMessage('Report an Issue'),
        href: 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4/issues/new/choose',
        target: '_blank',
        iconProps: {
          iconName: 'ReportWarning'
        },
        onClick: () => trackReportAnIssueLinkClickEvent()
      },
      { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
      {
        key: 'ge-documentation',
        text: translateMessage('Documentation'),
        href: ' https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0',
        target: '_blank',
        iconProps: {
          iconName: 'Documentation'
        },
        onClick: () => trackDocumentationLinkClickEvent()
      },
      {
        key: 'github',
        text: translateMessage('Github'),
        href: 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4',
        target: '_blank',
        iconProps: {
          iconName: 'GitHubLogo'
        },
        onClick: () => trackGithubLinkClickEvent()
      }
    ];
    setItems(menuItems);
  }, [authenticated]);

  const toggleThemeChooserDialogState = () => {
    let hidden = themeChooserDialogHidden;
    hidden = !hidden;
    hideThemeChooserDialog(hidden);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.THEME_CHANGE_BUTTON
    });
  };

  const handleChangeTheme = (selectedTheme: any) => {
    const newTheme: string = selectedTheme.key;
    dispatch(changeTheme(newTheme));
    loadGETheme(newTheme);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: selectedTheme.key.replace('-', ' ').toSentenceCase()
    });
  };

  const trackReportAnIssueLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.REPORT_AN_ISSUE_LINK
    });
  };

  const trackDocumentationLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.GE_DOCUMENTATION_LINK
    });
  };

  const trackGithubLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.GITHUB_LINK
    });
  };

  const menuProperties = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items
  };

  return (
    <div>
      <TooltipHost
        content={translateMessage('Settings')}
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
      >
        <IconButton
          ariaLabel={translateMessage('Settings')}
          role='button'
          styles={{
            label: { marginBottom: -20 },
            menuIcon: { fontSize: 20 }
          }}
          menuIconProps={{ iconName: 'Settings' }}
          menuProps={menuProperties}
        />
      </TooltipHost>
      <div>
        <Dialog
          hidden={themeChooserDialogHidden}
          onDismiss={() => toggleThemeChooserDialogState()}
          dialogContentProps={{
            type: DialogType.normal,
            title: messages['Change theme'],
            isMultiline: false
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
                text: messages['High Contrast']
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
      </div>
    </div>
  );
}

export default injectIntl(Settings);

