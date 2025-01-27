import * as React from 'react';
import { Suspense } from 'react';
import { Spinner } from '@fluentui/react'; // or switch to v9 spinner if needed
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Button,
  makeStyles,
  shorthands,
  typographyStyles
} from '@fluentui/react-components';
import { ArrowLeft24Regular, Dismiss24Regular } from '@fluentui/react-icons';

import { useAppSelector } from '../../../../store';
import { translateMessage } from '../../../utils/translate-messages';
import { WrapperProps } from './popups.types';

// Example custom backdrop styling (if you need an overlay color similar to v8):
// const useStyles = makeStyles({
//   backdrop: (theme: { colorNeutralForeground2: any; }) => ({
//     // You can pick colors from your v9 theme or hardcode RGBA as needed:
//     backgroundColor: theme.colorNeutralForeground2, // Example
//     // or, if you want to approximate blackTranslucent40:
//     // backgroundColor: 'rgba(0,0,0,0.4)',
//     ...shorthands.borderRadius('0') // just as an example
//   }),

//   headerTitle: {
//     // Example to match the font size/weight from v8 theme
//     ...typographyStyles.title1
//   }
// });

export function DrawerWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { title, renderFooter, width } = popupsProps.settings;
  const appTheme = useAppSelector((state) => state.theme);

  // If you still rely on a 'dark vs light vs high-contrast' distinction:
  const isCurrentThemeDark = () => {
    return appTheme === 'dark' || appTheme === 'high-contrast';
  };

  /**
   * Map the old PanelType logic to Drawer sizes
   * Adjust if you want more nuanced widths or a custom approach
   */
  const getDrawerSize = () => {
    switch (width) {
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
      return 'large';
    case 'xl':
      // Fluent v9 does not have an 'xl' built-in; pick 'largest' or use custom styling
      return 'full';
    default:
      return 'medium';
    }
  };

  // We show a back button for certain panel titles
  const showBackButton =
    title === 'Edit Scope' ||
    title === 'Edit Collection' ||
    title === 'Preview Permissions';

  // Called whenever user attempts to open/close the Drawer (e.g., clicking backdrop or X button).
  // If we do NOT want them to close by clicking the backdrop, we can conditionally ignore the event
  // or set `modalType` so the overlay isn’t clickable. For demonstration, we simply dismiss on close:
  const onOpenChange = (_ev: unknown, data: { open: boolean }) => {
    if (!data.open) {
      dismissPopup();
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      position='end'  // Panels typically slide from the right
      type='overlay'    // Mimics a modal overlay
      // If you want to prevent 'light dismiss' by clicking the backdrop:
      // modalType='alert' // or handle it in onOpenChange
      // size maps from the old PanelType
      size={getDrawerSize()}
    >
      <DrawerHeader>
        {showBackButton && (
          <Button
            icon={<ArrowLeft24Regular />}
            appearance='subtle'
            onClick={() => dismissPopup()}
            aria-label={translateMessage('Back')}
          />
        )}
        <DrawerHeaderTitle action={
          <Button
            icon={<Dismiss24Regular />}
            appearance='subtle'
            onClick={() => dismissPopup()}
            aria-label={translateMessage('Close')}
          />

        }>
          {title || ''}
        </DrawerHeaderTitle>
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
          {renderFooter()}
        </DrawerFooter>
      )}
    </Drawer>
  );
}