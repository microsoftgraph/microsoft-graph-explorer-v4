import { ChoiceGroup, DefaultButton, DialogFooter } from '@fluentui/react';

import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { loadGETheme } from '../../../../themes';
import { AppTheme } from '../../../../types/enums';
import { changeTheme } from '../../../services/actions/theme-action-creator';
import { PopupsComponent } from '../../../services/context/popups-context';
import { translateMessage } from '../../../utils/translate-messages';

const ThemeChooser: React.FC<PopupsComponent<null>> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const { theme: appTheme } = useAppSelector((state) => state);

  const handleChangeTheme = (selectedTheme: any) => {
    const newTheme: string = selectedTheme.key;
    dispatch(changeTheme(newTheme));
    loadGETheme(newTheme);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: selectedTheme.key.replace('-', ' ').toSentenceCase()
    });
  };

  return (
    <>
      <ChoiceGroup defaultSelectedKey={appTheme} styles={{
        flexContainer: {
          flexWrap: 'nowrap'
        }
      }} options={[{
        key: AppTheme.Light,
        iconProps: {
          iconName: 'Light'
        },
        text: translateMessage('Light')
      }, {
        key: AppTheme.Dark,
        iconProps: {
          iconName: 'CircleFill'
        },
        text: translateMessage('Dark')
      }, {
        key: AppTheme.HighContrast,
        iconProps: {
          iconName: 'Contrast'
        },
        text: translateMessage('High Contrast')
      }]} onChange={(_event, selectedTheme) => handleChangeTheme(selectedTheme)} />
      <DialogFooter>
        <DefaultButton
          text={translateMessage('Close')}
          onClick={() => props.closePopup()}
        />
      </DialogFooter>
    </>
  );
}

export default ThemeChooser