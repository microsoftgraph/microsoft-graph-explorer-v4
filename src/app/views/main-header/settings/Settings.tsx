import {
  DirectionalHint, getId,
  getTheme, IconButton, IContextualMenuProps, TooltipHost
} from '@fluentui/react';
import { useEffect, useState } from 'react';

import { geLocale } from '../../../../appLocale';
import { useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { ISettingsProps } from '../../../../types/settings';
import { usePopups } from '../../../services/hooks';
import '../../../utils/string-operations';
import { translateMessage } from '../../../utils/translate-messages';
import { mainHeaderStyles } from '../MainHeader.styles';

export const Settings: React.FunctionComponent<ISettingsProps> = () => {
  const auth = useAppSelector((state)=> state.auth)
  const authToken = auth.authToken;
  const authenticated = authToken.token;
  const [items, setItems] = useState([]);
  const currentTheme = getTheme();
  const { show: showThemeChooser } = usePopups('theme-chooser', 'dialog');

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
    showThemeChooser({
      settings: {
        title: translateMessage('Change theme')
      }
    });
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.THEME_CHANGE_BUTTON
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
    </div>
  );
}


