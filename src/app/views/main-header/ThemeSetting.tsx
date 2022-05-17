import { ActionButton, ChoiceGroup, DefaultButton, Dialog, DialogFooter, DialogType } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { loadGETheme } from '../../../themes';
import { changeTheme } from '../../services/actions/theme-action-creator';
import { AppTheme } from '../../../types/enums';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../types/root';
export const ThemeSetting: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const {theme: appTheme} = useSelector((state: IRootState) => state);
  const [themeChooserDialogHidden, hideThemeChooserDialog] = useState(true);

  const toggleThemeChooserDialogState = () => {
    let hidden = themeChooserDialogHidden;
    hidden = !hidden;
    hideThemeChooserDialog(hidden);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.THEME_CHANGE_BUTTON
    });
  };

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
    <div>
      <ActionButton
        ariaLabel={translateMessage('change theme')}
        key= 'change-theme'
        iconProps= {{iconName: 'Brightness', style:{fontSize:15 }}}
        //text={'Theme'}
        onClick={ () => toggleThemeChooserDialogState()}
      />
      <div>
        <Dialog
          hidden={themeChooserDialogHidden}
          onDismiss={() => toggleThemeChooserDialogState()}
          dialogContentProps={{
            type: DialogType.normal,
            title: translateMessage('Change theme'),
            isMultiline: false
          }}
        >
          <ChoiceGroup
            label='Pick one theme'
            defaultSelectedKey={appTheme}
            styles={{ flexContainer: { flexWrap: 'nowrap'  }} }
            options={[
              {
                key: AppTheme.Light,
                iconProps: { iconName: 'Light' },
                text: translateMessage('Light')
              },
              {
                key: AppTheme.Dark,
                iconProps: { iconName: 'CircleFill' },
                text: translateMessage('Dark')
              },
              {
                key: AppTheme.HighContrast,
                iconProps: { iconName: 'Contrast' },
                text: translateMessage('High Contrast')
              }
            ]}
            onChange={(event, selectedTheme) =>
              handleChangeTheme(selectedTheme)
            }
          />
          <DialogFooter>
            <DefaultButton
              text={translateMessage('Close')}
              onClick={() => toggleThemeChooserDialogState()}
            />
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  )
}