import { getTheme, IconButton, IOverlayProps, Panel, PanelType, Spinner } from '@fluentui/react';
import { Suspense } from 'react';

import { useAppSelector } from '../../../../store';
import { translateMessage } from '../../../utils/translate-messages';
import { WrapperProps } from './popups.types';

export function PanelWrapper(props: WrapperProps) {
  const appTheme  = useAppSelector((state) => state.theme);
  const theme = getTheme();
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { title, renderFooter } = popupsProps.settings;

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

  const headerText = title ? title : '';

  const getPanelType = () => {
    switch (popupsProps.settings.width) {
    case 'sm':
      return PanelType.smallFluid;
    case 'md':
      return PanelType.medium;
    case 'lg':
      return PanelType.largeFixed;
    case 'xl':
      return PanelType.large;
    }
    return PanelType.medium;
  }

  const panelType = getPanelType();

  const onRenderFooterContent = (): JSX.Element | null => {
    return renderFooter ? renderFooter() : null;
  }

  const showBackButton = title === 'Edit Scope' || title === 'Edit Collection' || title === 'Preview Permissions';

  const onRenderHeader = (): JSX.Element => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        iconProps={{ iconName: 'Back' }}
        ariaLabel={translateMessage('Back')}
        onClick={() => dismissPopup()}
        styles={{ root: { marginRight: 8 } }}
      />
      <span style={{ fontSize: theme.fonts.xLarge.fontSize, fontWeight: theme.fonts.xLarge.fontWeight }}>
        {title}
      </span>
    </div>
  );

  return (
    <div>
      <Panel
        isOpen={isOpen}
        hasCloseButton={false}
        type={panelType}
        headerText={headerText.toString()}
        isFooterAtBottom={true}
        isBlocking={true}
        isLightDismiss={false}
        closeButtonAriaLabel='Close'
        overlayProps={panelOverlayProps}
        onRenderFooterContent={onRenderFooterContent}
        onRenderHeader={showBackButton ? onRenderHeader: undefined}
      >
        <IconButton
          styles={{
            root: {
              float: 'right',
              zIndex: 1,
              marginTop: -30
            }
          }}
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel={translateMessage('Close')}
          onClick={() => dismissPopup()}
        />
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