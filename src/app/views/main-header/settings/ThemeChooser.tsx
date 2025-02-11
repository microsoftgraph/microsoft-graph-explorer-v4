import React, { useEffect } from 'react';
import { RadioGroup, Radio, DialogActions, Button} from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { PopupsComponent } from '../../../services/context/popups-context';
import { changeTheme } from '../../../services/slices/theme.slice';
import { loadGETheme } from '../../../../themes';
import { translateMessage } from '../../../utils/translate-messages';
import { useIconOptionStyles, useRadioGroupStyles } from './ThemeChooser.styles';
import { BrightnessHigh24Regular, WeatherMoon24Regular, DarkTheme24Regular} from '@fluentui/react-icons';

const availableThemes = [
  {
    key: 'light',
    displayName: 'Light',
    icon: <BrightnessHigh24Regular />
  },
  {
    key: 'dark',
    displayName: 'Dark',
    icon: <WeatherMoon24Regular />
  },
  {
    key: 'high-contrast',
    displayName: 'High Contrast',
    icon: <DarkTheme24Regular />
  }
];

const getSystemTheme = (): string => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const ThemeChooser: React.FC<PopupsComponent<null>> = (props) => {
  const dispatch = useAppDispatch();
  const appTheme = useAppSelector(state=> state.theme);
  const iconOptionStyles = useIconOptionStyles();
  const radioGroupStyles = useRadioGroupStyles();

  useEffect(() => {
    // Load the theme from local storage or use the system theme as the default
    const savedTheme = localStorage.getItem('appTheme') ?? getSystemTheme();
    dispatch(changeTheme(savedTheme));
    loadGETheme(savedTheme); // Remove when cleaning up
  }, [dispatch]);


  const handleChangeTheme = (selectedTheme: { key: string; displayName: string; icon: JSX.Element }) => {
    const newTheme: string = selectedTheme.key;
    // Save the selected theme to local storage
    localStorage.setItem('appTheme', newTheme);
    // Applies the theme to the Fluent UI components
    dispatch(changeTheme(newTheme));
    loadGETheme(newTheme); //Remove when cleaning up
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: newTheme.replace('-', ' ').toSentenceCase()
    });
  };
  return (
    <>
      <RadioGroup layout="horizontal" aria-labelledby='theme-chooser' className={radioGroupStyles.root}
        value={availableThemes.find(theme => theme.key === appTheme)?.displayName}
      >
        {availableThemes.map((theme) => (
          <div key={theme.key} className={iconOptionStyles.root}>
            <div className={iconOptionStyles.icon}>{theme.icon}</div>
            <Radio
              value={theme.key}
              checked={appTheme === theme.key}
              className={iconOptionStyles.radio}
              label={{
                children: (
                  <div>{translateMessage(theme.displayName)} </div>
                )
              }}
              onClick={() => handleChangeTheme(theme)}>
            </Radio>
          </div>
        ))}
      </RadioGroup>
      <DialogActions>
        <Button appearance="primary" onClick={() => props.dismissPopup()}>
          {translateMessage('Save changes')}
        </Button>
      </DialogActions>
    </>
  );
}

export default ThemeChooser