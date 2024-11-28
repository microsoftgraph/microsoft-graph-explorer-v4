import { makeStyles, RadioGroup, Radio} from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { PopupsComponent } from '../../../services/context/popups-context';
import { changeTheme } from '../../../services/slices/theme.slice';
import { loadGETheme } from '../../../../themes';
import { translateMessage } from '../../../utils/translate-messages';
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

const useIconOptionStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  icon: {
    fontSize: '30px'
  }
});

const useLabelStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '5px'
  }
});

const ThemeChooserV9: React.FC<PopupsComponent<null>> = () => {
  const dispatch = useAppDispatch();
  const appTheme = useAppSelector(state=> state.theme);
  const iconOptionStyles = useIconOptionStyles();
  const labelStyles = useLabelStyles();


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
    <RadioGroup layout="horizontal" aria-labelledby='theme-chooser'
      defaultValue={availableThemes.find(theme => theme.key === appTheme)?.displayName}
    >
      {availableThemes.map((theme) => (
        <div key={theme.key} className={iconOptionStyles.root}>
          <Radio
            value={theme.key}
            checked={appTheme === theme.key}
            label={{
              className: labelStyles.root,
              children: (
                <>
                  <span className={iconOptionStyles.icon}>{theme.icon}</span> {translateMessage(theme.displayName)}
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