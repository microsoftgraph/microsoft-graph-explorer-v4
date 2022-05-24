import {
  ChoiceGroup,
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
import { useDispatch, useSelector } from 'react-redux';
import { GitHubLogoIcon } from '@fluentui/react-icons-mdl2';

import '../../../utils/string-operations';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IRootState } from '../../../../types/root';
import { ISettingsProps } from '../../../../types/settings';
import { translateMessage } from '../../../utils/translate-messages';
import { geLocale } from '../../../../appLocale';
import { changeTheme } from '../../../services/actions/theme-action-creator';
import { loadGETheme } from '../../../../themes';
import { AppTheme } from '../../../../types/enums';
import { mainHeaderStyles } from '../MainHeader.styles';

export const Settings: React.FunctionComponent<ISettingsProps> = () => {
  const dispatch = useDispatch();
  const { authToken, theme: appTheme } = useSelector((state: IRootState) => state);
  const authenticated = authToken.token;
  const [themeChooserDialogHidden, hideThemeChooserDialog] = useState(true);
  const [items, setItems] = useState([]);
  const currentTheme = getTheme();

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
        key: 'office-dev-program',
        text: translateMessage('Office Dev Program'),
        href: `https://developer.microsoft.com/${geLocale}/office/dev-program`,
        target: '_blank',
        iconProps: {
          iconName: 'CommandPrompt'
        },
        onClick: () => trackOfficeDevProgramLinkClickEvent()
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

  const trackOfficeDevProgramLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.OFFICE_DEV_PROGRAM_LINK
    });
  };

  const calloutStyles: React.CSSProperties = {
    overflowY: 'hidden'
  }

  const settingsButtonStyles = mainHeaderStyles(currentTheme).iconButton;

  const menuProperties = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items,
    calloutProps: {
      style: calloutStyles
    }
  };

  return (
    <div style={{display: 'flex', alignItems: 'stretch'}}>
      <TooltipHost
        content={translateMessage('Settings')}
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
        styles={{ root: {flexGrow: '1', display: 'flex', alignItems: 'stretch' }}}
      >
        <IconButton
          ariaLabel={translateMessage('Settings')}
          role='button'
          styles={settingsButtonStyles}
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
            title: translateMessage('Change theme'),
            isMultiline: false
          }}
        >
          <ChoiceGroup
            defaultSelectedKey={appTheme}
            styles={{ flexContainer: { flexWrap: 'nowrap'  }} }
            options={[
              {
                key: AppTheme.Light,
                iconProps: { iconName: 'Light' },
                text:translateMessage('Light')
              },
              {
                key: AppTheme.Dark,
                iconProps: { iconName: 'CircleFill' },
                text: translateMessage('Dark')
              },
              {
                key: AppTheme.HighContrast,
                iconProps: { iconName: 'Contrast' },
                text: translateMessage('High Contrast')
              }
            ]}
            onChange={(event, selectedTheme) =>
              handleChangeTheme(selectedTheme)
            }
          />
          <DialogFooter>
            <DefaultButton
              text={translateMessage('Close')}
              onClick={() => toggleThemeChooserDialogState()}
            />
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
}


