import { Suspense } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Button,
  Spinner,
  makeStyles,
  Tooltip
} from '@fluentui/react-components';
import { ArrowLeft24Regular, Dismiss24Regular } from '@fluentui/react-icons';

import { translateMessage } from '../../../utils/translate-messages';
import { WrapperProps } from './popups.types';

const useDrawerStyles = makeStyles({
  root: {
    width: '1100px'
  },
  button: {
    marginInlineEnd: '20px'
  },
  body: {
    padding: 0
  }
});


export function DrawerWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { title, renderFooter, width } = popupsProps.settings;
  const drawerStyles = useDrawerStyles();

  const getDrawerSize = () => {
    switch (width) {
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
      return 'large';
    case 'xl':
      return 'full';
    default:
      return 'medium';
    }
  };

  const showBackButton =
    title === 'Edit Scope' ||
    title === 'Edit Collection' ||
    title === 'Preview Permissions';

  const onOpenChange = (_ev: unknown, data: { open: boolean }) => {
    if (!data.open) {
      dismissPopup();
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      position='end'
      type='overlay'
      size={getDrawerSize()}
      className={drawerStyles.root}
    >
      <DrawerHeader>
        <DrawerHeaderTitle action={
          <Tooltip
            content={translateMessage('Close')} relationship='label'>
            <Button
              icon={<Dismiss24Regular />}
              appearance='subtle'
              onClick={() => dismissPopup()}
              aria-label={translateMessage('Close')}
            />
          </Tooltip>
        }>
          {showBackButton && (
            <Tooltip
              content={translateMessage('Back')}
              relationship='label'>
              <Button
                icon={<ArrowLeft24Regular />}
                appearance='subtle'
                onClick={() => dismissPopup()}
                aria-label={translateMessage('Back')}
                className={drawerStyles.button}
              />
            </Tooltip>
          )}
          {title || ''}
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody className={drawerStyles.body}>
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