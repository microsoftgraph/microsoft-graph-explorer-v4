import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Spinner,
  Button,
  makeStyles,
  DrawerHeaderTitle
} from '@fluentui/react-components';
import { ArrowLeft20Filled } from '@fluentui/react-icons';
import { Suspense } from 'react';
import { translateMessage } from '../../../utils/translate-messages';
import { WrapperProps } from './popups.types';

const useDrawerStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  backButton: {
    marginInlineEnd: '20px'
  }
});

export function DrawerWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { title, renderFooter } = popupsProps.settings;
  const headerText = title || '';

  const drawerClasses = useDrawerStyles();

  const getDrawerSize = () => {
    switch (popupsProps.settings.width) {
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
      return 'large';
    case 'xl':
      return 'full';
    }
    return 'medium';
  }

  const drawerSize = getDrawerSize();

  const onRenderFooterContent = (): JSX.Element | null => {
    return renderFooter ? renderFooter() : null;
  }

  const showBackButton = title === 'Edit Scope' || title === 'Edit Collection' || title === 'Preview Permissions';

  const onRenderHeader = (): JSX.Element => (

    <div className={drawerClasses.header}>
      <Button
        className={drawerClasses.backButton}
        icon={<ArrowLeft20Filled />}
        aria-label={translateMessage('Back')}
        onClick={() => dismissPopup()}
      />
      <DrawerHeaderTitle>
        {headerText}
      </DrawerHeaderTitle>
    </div>
  );

  return (
    <div>
      <Drawer
        open={isOpen}
        type='overlay'
        size={drawerSize}
        position='end'
      >
        <DrawerHeader>
          {showBackButton && onRenderHeader()}
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