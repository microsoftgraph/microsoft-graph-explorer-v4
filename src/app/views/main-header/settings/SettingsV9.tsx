import {
  Button, makeStyles, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip
} from '@fluentui/react-components'
import { Color20Regular, Settings20Regular, WindowDevTools20Regular } from '@fluentui/react-icons'

import { translateMessage } from '../../../utils/translate-messages'
const useStyles = makeStyles({
  button: {
    height: '100%',
    minWidth: '48px',
    maxWidth: '48px'
  }
})
const SettingsV9 = ()=>{
  const styles = useStyles();

  return (
    <Menu>
      <Tooltip content={translateMessage('Settings')} relationship="description">
        <MenuTrigger disableButtonEnhancement>
          <Button className={styles.button} appearance="subtle" icon={<Settings20Regular />} />
        </MenuTrigger>
      </Tooltip>

      <MenuPopover>
        <MenuList>
          <MenuItem icon={<Color20Regular />}>{translateMessage('Change theme')}</MenuItem>
          <MenuItem icon={<WindowDevTools20Regular />}>{translateMessage('Office Dev Program')}</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

export { SettingsV9 }

