import {
  ChoiceGroup, DefaultButton, Dialog, DialogFooter, DialogType, DirectionalHint, getId,
  getTheme, IconButton, IContextualMenuProps, TooltipHost
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { geLocale } from '../../../../appLocale';
import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { loadGETheme } from '../../../../themes';
import { AppTheme } from '../../../../types/enums';
import { ISettingsProps } from '../../../../types/settings';
import { changeTheme } from '../../../services/actions/theme-action-creator';
import '../../../utils/string-operations';
import { translateMessage } from '../../../utils/translate-messages';
import { mainHeaderStyles } from '../MainHeader.styles';

export const Settings: React.FunctionComponent<ISettingsProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const { authToken, theme: appTheme } = useAppSelector((state) => state);
  const authenticated = authToken.token;
  const [themeChooserDialogHidden, hideThemeChooserDialog] = useState(true);
  const [items, setItems] = useState([]);
  const currentTheme = getTheme();

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

  const trackSettingsButtonClickEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SETTINGS_BUTTON
    });
  }

  const calloutStyles: React.CSSProperties = {
    overflowY: 'hidden'
  }

  const { iconButton: settingsButtonStyles, settingsContainerStyles,
    tooltipStyles } = mainHeaderStyles(currentTheme);

  const menuProperties: IContextualMenuProps = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items,
    directionalHint: DirectionalHint.bottomLeftEdge,
    directionalHintFixed: true,
    calloutProps: {
      style: calloutStyles
    },
    styles: { container: { border: '1px solid' + currentTheme.palette.neutralTertiary } }
  };

  return (
    <div style={settingsContainerStyles}>
      <TooltipHost
        content={
          <div style={{ padding: '3px' }}>
            {translateMessage('Settings')}
          </div>
        }
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
        styles={tooltipStyles}
      >
        <IconButton
          ariaLabel={translateMessage('Settings')}
          role='button'
          styles={settingsButtonStyles}
          menuIconProps={{ iconName: 'Settings' }}
          menuProps={menuProperties}
          onMenuClick={trackSettingsButtonClickEvent}
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
            styles={{ flexContainer: { flexWrap: 'nowrap' } }}
            options={[
              {
                key: AppTheme.Light,
                iconProps: { iconName: 'Light' },
                text: translateMessage('Light')
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
            onChange={(_event, selectedTheme) =>
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


