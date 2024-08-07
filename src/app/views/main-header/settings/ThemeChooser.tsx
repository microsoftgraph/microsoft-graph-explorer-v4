import { ChoiceGroup, DefaultButton, DialogFooter, IChoiceGroupOption } from '@fluentui/react';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { loadGETheme } from '../../../../themes';
import { AppTheme } from '../../../../types/enums';
import { PopupsComponent } from '../../../services/context/popups-context';
import { changeTheme } from '../../../services/slices/theme.slice';
import { translateMessage } from '../../../utils/translate-messages';

const ThemeChooser: React.FC<PopupsComponent<null>> = (props) => {
  const dispatch = useAppDispatch();
  const appTheme = useAppSelector(state=> state.theme);

  const handleChangeTheme = (selectedTheme: IChoiceGroupOption | undefined) => {
    const newTheme: string = selectedTheme?.key ?? '';
    dispatch(changeTheme(newTheme));
    loadGETheme(newTheme);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SELECT_THEME_BUTTON,
      SelectedTheme: newTheme.replace('-', ' ').toSentenceCase()
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