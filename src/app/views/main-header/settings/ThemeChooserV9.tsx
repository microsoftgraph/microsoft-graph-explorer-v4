import { Menu, MenuTrigger, MenuButton, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { PopupsComponent } from '../../../services/context/popups-context';
import { changeTheme } from '../../../services/slices/theme.slice';
import { loadGETheme } from '../../../../themes';
import { BrightnessHighRegular, WeatherMoonFilled, CircleHalfFillFilled } from '@fluentui/react-icons';

const availableThemes = [
  {
    key: 'light',
    displayName: 'Web Light',
    icon: <BrightnessHighRegular />
  },
  {
    key: 'dark',
    displayName: 'Web Dark',
    icon: <WeatherMoonFilled />
  },
  {
    key: 'high-contrast',
    displayName: 'Teams High Contrast',
    icon: <CircleHalfFillFilled />
  }
];

const ThemeChooserV9: React.FC<PopupsComponent<null>> = () => {
  const dispatch = useAppDispatch();
  const appTheme = useAppSelector(state=> state.theme);


  const handleChangeTheme = (selectedTheme: { key: string; displayName: string; icon: JSX.Element }) => {
    const newTheme: string = selectedTheme.key;
    // Applies the theme to the Fluent UI components
    dispatch(changeTheme(newTheme));
    loadGETheme(newTheme); //Remove when cleaning up
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: newTheme.replace('-', ' ').toSentenceCase()
    });
  };
  return (
    <Menu>
      <MenuTrigger>
        <MenuButton icon={availableThemes.find(theme => theme.key === appTheme)?.icon}>
          {availableThemes.find(theme => theme.key === appTheme)?.displayName}
        </MenuButton>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {availableThemes.map(theme => (
            <MenuItem icon={theme.icon} key={theme.key} onClick={() => handleChangeTheme(theme)}>
              {theme.displayName}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

export default ThemeChooserV9