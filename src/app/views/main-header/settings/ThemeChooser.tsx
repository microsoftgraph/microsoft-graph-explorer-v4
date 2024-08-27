import { useState } from 'react';
import { Button, DialogActions, DialogTrigger, RadioGroup, Radio, webDarkTheme,
  webLightTheme,
  teamsLightTheme,
  teamsDarkTheme, Menu, MenuTrigger, MenuButton, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components';
import { useAppContext } from '../../AppContext'
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { PopupsComponent } from '../../../services/context/popups-context';
import { BrightnessHighRegular, WeatherMoonFilled, PeopleTeamRegular, PeopleTeamFilled } from '@fluentui/react-icons';
import { translateMessage } from '../../../utils/translate-messages';

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

const ThemeChooser: React.FC<PopupsComponent<null>> = (props) => {
  const [selectedTheme, setSelectedTheme] = useState(availableThemes[0]);

  const appContext = useAppContext();

  const handleChangeTheme = (theme: { key: string; displayName: string; icon: JSX.Element }) => {
    setSelectedTheme(theme);
    // Applies the theme to the Fluent UI components
    switch (theme.key) {
      case 'teamsLight':
        appContext.setState({
          ...appContext.state,
          theme: { key: 'light', fluentTheme: teamsLightTheme }
        });
        break;
      case 'teamsDark':
        appContext.setState({
          ...appContext.state,
          theme: { key: 'dark', fluentTheme: teamsDarkTheme }
        });
        break;
      case 'light':
        appContext.setState({
          ...appContext.state,
          theme: { key: theme.key, fluentTheme: webLightTheme }
        });
        break;
      case 'dark':
        appContext.setState({
          ...appContext.state,
          theme: { key: theme.key, fluentTheme: webDarkTheme }
        });
        break;
    }
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: selectedTheme
    });
  };
  return (
    <>
      {/* This component is the equivalent of ChoiceGroup in Fluent UI
       but does not fit in with the current experience */}
      {/* <RadioGroup
        value={selectedTheme.displayName}
      >
        {availableThemes.map((theme) => (
          <Radio
            key={theme.key}
            value={theme.key}
            checked={selectedTheme.key === theme.key}
            label={translateMessage(theme.displayName)}
            onClick={() => handleChangeTheme(theme)}
          >
          </Radio>
        ))}
      </RadioGroup>
      <DialogActions>
        <DialogTrigger disableButtonEnhancement>
          <Button onClick={() => props.closePopup()}>
            {translateMessage('Close')}
          </Button>
        </DialogTrigger>
      </DialogActions> */}

      {/* Recommended Component */}
      <Menu>
        <MenuTrigger>
          <MenuButton icon={selectedTheme? selectedTheme.icon : ''}>{selectedTheme.displayName}</MenuButton>
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
    </>
  );
}

export default ThemeChooser