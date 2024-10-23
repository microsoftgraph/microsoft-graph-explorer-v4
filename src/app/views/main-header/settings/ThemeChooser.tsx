import { useState } from 'react';
import { ChoiceGroup, DefaultButton, DialogFooter, IChoiceGroupOption } from '@fluentui/react';
import { Button, DialogActions, DialogTrigger, RadioGroup, Radio, webDarkTheme,
  webLightTheme,
  teamsLightTheme,
  teamsDarkTheme, Menu, MenuTrigger, MenuButton, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components';

import { BrightnessHighRegular, WeatherMoonFilled, PeopleTeamRegular, PeopleTeamFilled } from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { PopupsComponent } from '../../../services/context/popups-context';
import { changeTheme } from '../../../services/slices/theme.slice';
import { JSX } from 'react/jsx-runtime';

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
    key: 'teamsLight',
    displayName: 'Teams Light',
    icon: <PeopleTeamRegular />
  },
  {
    key: 'teamsDark',
    displayName: 'Teams Dark',
    icon: <PeopleTeamFilled />
  }
];

const ThemeChooser: React.FC<PopupsComponent<null>> = () => {
  const [selectedTheme, setSelectedTheme] = useState(availableThemes[0]);
  const dispatch = useAppDispatch();

  interface Theme {
    key: string;
    displayName: string;
    icon: JSX.Element;
  }

  const handleChangeTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    const newTheme: string = theme.key;
    dispatch(changeTheme(newTheme));
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: newTheme.replace('-', ' ').toSentenceCase()
    });
  };

  return (
    <Menu>
      <MenuTrigger>
        <MenuButton icon={selectedTheme ? selectedTheme.icon : ''}>{selectedTheme.displayName}</MenuButton>
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

export default ThemeChooser;