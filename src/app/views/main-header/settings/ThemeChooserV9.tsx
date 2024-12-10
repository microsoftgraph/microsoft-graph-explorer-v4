import React, { useEffect } from 'react';
import { makeStyles, RadioGroup, Radio} from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { PopupsComponent } from '../../../services/context/popups-context';
import { changeTheme } from '../../../services/slices/theme.slice';
import { loadGETheme } from '../../../../themes';
import { translateMessage } from '../../../utils/translate-messages';
import { BrightnessHighRegular, WeatherMoonFilled, CircleHalfFillFilled, SettingsFilled} from '@fluentui/react-icons';

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
  },
  {
    key: 'system',
    displayName: 'System Default',
    icon: <SettingsFilled />
  }
];

const useIconOptionStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    fontSize: '30px',
    display: 'block'
  },
  name: {
    display: 'block'
  },
  radio: {
    '&:checked ~ .fui-Radio__indicator::after': {
      borderRadius: '50%'
    }
  }

});

const useLabelStyles = makeStyles({
  root: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
});

const getSystemTheme = (): string => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const ThemeChooserV9: React.FC<PopupsComponent<null>> = () => {
  const dispatch = useAppDispatch();
  const appTheme = useAppSelector(state=> state.theme);
  const iconOptionStyles = useIconOptionStyles();
  const labelStyles = useLabelStyles();

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
    <RadioGroup layout="horizontal" aria-labelledby='theme-chooser'
      value={availableThemes.find(theme => theme.key === appTheme)?.displayName}
    >
      {availableThemes.map((theme) => (
        <div key={theme.key} className={iconOptionStyles.root}>
          <Radio
            value={theme.key}
            checked={appTheme === theme.key}
            className={iconOptionStyles.radio}
            label={{
              className: labelStyles.root,
              children: (
                <>
                  <div className={iconOptionStyles.icon}>{theme.icon}</div>
                  <div className={iconOptionStyles.name}>{translateMessage(theme.displayName)} </div>
                </>
              )
            }}
            onClick={() => handleChangeTheme(theme)}>
          </Radio>
        </div>
      ))}
    </RadioGroup>
  );
}

export default ThemeChooserV9