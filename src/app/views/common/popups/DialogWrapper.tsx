import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Spinner
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { Suspense, useCallback, useEffect, useRef } from 'react';

import { WrapperProps } from './popups.types';
import { translateMessage } from '../../../utils/translate-messages';

const FOCUSABLE_SELECTOR = [
  'input:not([type="hidden"])', 'select', 'textarea', 'button', 'a[href]', '[tabindex]:not([tabindex="-1"])'
].join(',');

function findFirstContentFocusable(container: HTMLElement, exclude: HTMLElement | null) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).find(element =>
    element !== exclude && !element.matches(':disabled') && !element.closest('[aria-hidden="true"], [hidden]'));
}

const ContentReady = ({ onReady }: { onReady: () => void }) => {
  useEffect(() => { onReady(); }, []);
  return null;
};

export function DialogWrapper(props: WrapperProps) {
  const { isOpen, dismissPopup, Component, popupsProps, closePopup } = props;
  const { settings: { title, subtitle } } = popupsProps;
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // The close button is a secondary, mouse-oriented control; initial focus belongs to the content.
  // Fluent focuses the first focusable element (the close button) on open, and lazy content may
  // mount later, so move focus to the content unless the user has already moved it there.
  const focusContent = useCallback(() => {
    const body = bodyRef.current;
    const closeButton = closeButtonRef.current;
    const active = body?.ownerDocument.activeElement;
    if (!body || (active && active !== closeButton && body.contains(active))) {
      return;
    }
    (findFirstContentFocusable(body, closeButton) ?? closeButton)?.focus();
  }, []);

  useEffect(() => {
    if (isOpen) {
      focusContent();
    }
  }, [isOpen, focusContent]);

  return (
    <Dialog modalType='modal' aria-modal='true' open={isOpen} onOpenChange={(_, data) => !data.open && dismissPopup()}>
      <DialogSurface>
        <DialogBody ref={bodyRef}>
          <DialogTitle action={
            <Button
              ref={closeButtonRef}
              type='button'
              appearance='subtle'
              icon={<Dismiss24Regular />}
              aria-label={translateMessage('Close')}
              onClick={() => dismissPopup()}
            />
          }>
            {title?.toString()}
          </DialogTitle>
          <Suspense fallback={<Spinner />}>
            <DialogContent>{subtitle?.toString()}
              <Component
                {...popupsProps}
                data={popupsProps.data || {}}
                dismissPopup={() => dismissPopup()}
                closePopup={(e: any) => closePopup(e)}
              />
            </DialogContent>
            {popupsProps.settings.renderFooter && (
              <DialogActions>{popupsProps.settings.renderFooter()}</DialogActions>
            )}
            <ContentReady onReady={focusContent} />
          </Suspense>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}