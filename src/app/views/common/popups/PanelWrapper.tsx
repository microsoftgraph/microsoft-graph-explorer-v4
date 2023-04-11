import { getTheme, IOverlayProps, Panel, PanelType, Spinner } from '@fluentui/react';
import { Suspense } from 'react';

import { useAppSelector } from '../../../../store';
import { WrapperProps } from './popups.types';

export function PanelWrapper(props: WrapperProps) {
  const { theme: appTheme } = useAppSelector((state) => state);
  const theme = getTheme();
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { title } = popupsProps.settings;

  const isCurrentThemeDark = (): boolean => {
    return (appTheme === 'dark' || appTheme === 'high-contrast');
  }

  const panelOverlayProps: IOverlayProps = {
    styles: {
      root: {
        backgroundColor: isCurrentThemeDark() ? theme.palette.blackTranslucent40 :
          theme.palette.whiteTranslucent40
      }
    }
  }

  const headerText = title ? title! : '';

  const getPanelType = () => {
    switch (popupsProps.settings.width) {
      case 'sm':
        return PanelType.smallFluid;
      case 'md':
        return PanelType.medium;
      case 'lg':
        return PanelType.large;
    }
    return undefined;
  }

  const panelType = getPanelType();

  return (
    <div>
      <Panel
        isOpen={isOpen}
        onDismiss={() => dismissPopup()}
        hasCloseButton={true}
        type={panelType}
        headerText={headerText.toString()}
        isFooterAtBottom={true}
        closeButtonAriaLabel='Close'
        overlayProps={panelOverlayProps}
      >
        <div>
          {
            <Suspense fallback={<Spinner />}>
              <Component
                {...popupsProps}
                data={popupsProps.data || {}}

                dismissPopup={() => dismissPopup()}
                closePopup={(e: any) => closePopup(e)}
              />
            </Suspense>
          }
        </div>

      </Panel>
    </div>
  );
}