// import { getTheme, IconButton, IOverlayProps, Spinner } from '@fluentui/react';
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerProps,
  Spinner,
  Button
} from '@fluentui/react-components';
import { ArrowStepBack20Regular, TrayItemRemove20Regular  } from '@fluentui/react-icons';
import { Suspense } from 'react';

import { useAppSelector } from '../../../../store';
import { translateMessage } from '../../../utils/translate-messages';
import { WrapperProps } from './popups.types';

export function PanelWrapper(props: WrapperProps) {
  const appTheme  = useAppSelector((state) => state.theme);
  // const theme = getTheme();
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { title, renderFooter } = popupsProps.settings;

  const isCurrentThemeDark = (): boolean => {
    return (appTheme === 'dark' || appTheme === 'high-contrast');
  }

  // const drawerOverlayProps: DrawerProps['overlayProps'] = {
  //   styles: {
  //     root: {
  //       backgroundColor: isCurrentThemeDark() ? theme.palette.blackTranslucent40 :
  //         theme.palette.whiteTranslucent40
  //     }
  //   }
  // }

  const headerText = title ? title : '';

  // const getDrawerSize = () => {
  //   switch (popupsProps.settings.width) {
  //   case 'sm':
  //     return 'small';
  //   case 'md':
  //     return 'medium';
  //   case 'lg':
  //     return 'large';
  //   case 'xl':
  //     return 'extraLarge';
  //   }
  //   return 'medium';
  // }

  // const drawerSize = getDrawerSize();

  const onRenderFooterContent = (): JSX.Element | null => {
    return renderFooter ? renderFooter() : null;
  }

  const showBackButton = title === 'Edit Scope' || title === 'Edit Collection' || title === 'Preview Permissions';

  const onRenderHeader = (): JSX.Element => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        icon={< ArrowStepBack20Regular />}
        aria-label={translateMessage('Back')}
        onClick={() => dismissPopup()}
      />
      <span>
        {title}
      </span>
    </div>
  );

  return (
    <div>
      <Drawer
        open={isOpen}
        type='overlay'
        size='full'
      >
        <DrawerHeader>
          {showBackButton && onRenderHeader()}
          <Button
            icon={< TrayItemRemove20Regular />}
            aria-label={translateMessage('Close')}
            onClick={() => dismissPopup()}
          />
        </DrawerHeader>
        <DrawerBody>
          <Suspense fallback={<Spinner />}>
            <Component
              {...popupsProps}
              data={popupsProps.data || {}}
              dismissPopup={() => dismissPopup()}
              closePopup={(e: any) => closePopup(e)}
            />
          </Suspense>
        </DrawerBody>
        {renderFooter && (
          <DrawerFooter>
            {onRenderFooterContent()}
          </DrawerFooter>
        )}
      </Drawer>
    </div>
  );
}