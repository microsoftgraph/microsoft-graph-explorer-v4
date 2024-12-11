import {
  Button, makeStyles, Menu, MenuItem, MenuItemLink, MenuList, MenuPopover, MenuTrigger, Tooltip
} from '@fluentui/react-components'
import { Color20Regular, Settings20Regular, WindowDevTools20Regular } from '@fluentui/react-icons'

import { componentNames, eventTypes, telemetry } from '../../../../telemetry'
import { usePopups } from '../../../services/hooks'
import { translateMessage } from '../../../utils/translate-messages'
import { useHeaderStyles } from '../utils'

const officeLink = 'https://developer.microsoft.com/office/dev-program'

const trackSettingsButtonClickEvent = () => {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    ComponentName: componentNames.SETTINGS_BUTTON
  });
}

const trackOfficeDevProgramLinkClickEvent = () => {
  telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
    ComponentName: componentNames.OFFICE_DEV_PROGRAM_LINK
  });
};

const SettingsV9 = ()=>{
  const styles = useHeaderStyles();
  const {show: showThemeChooser} = usePopups('theme-chooser', 'dialog')
  const toggleThemeChooserDialogState = () => {
    showThemeChooser({
      settings: {
        title: translateMessage('Change theme'),
        width: 'xl'
      }
    });
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.THEME_CHANGE_BUTTON
    });
  };

  return (
    <Menu>
      <Tooltip content={translateMessage('Settings')} relationship="description">
        <MenuTrigger disableButtonEnhancement>
          <Button
            onClick={trackSettingsButtonClickEvent}
            className={styles.iconButton} appearance="subtle" icon={<Settings20Regular />} />
        </MenuTrigger>
      </Tooltip>

      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<Color20Regular />}
            onClick={toggleThemeChooserDialogState}>{translateMessage('Change theme')}</MenuItem>
          <MenuItemLink
            as='a'
            href={officeLink} target="_blank"
            onClick={trackOfficeDevProgramLinkClickEvent}
            icon={<WindowDevTools20Regular />}>{translateMessage('Office Dev Program')}</MenuItemLink>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

export { SettingsV9 }

