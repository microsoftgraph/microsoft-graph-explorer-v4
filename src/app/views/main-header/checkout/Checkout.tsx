import {
  DirectionalHint,
  getId,
  getTheme,
  IconButton,
  IContextualMenuItem,
  IContextualMenuProps,
  Label,
  TooltipHost
} from '@fluentui/react';
import React from 'react';
import { useAppSelector } from '../../../../store';
import { translateMessage } from '../../../utils/translate-messages';
import { mainHeaderStyles } from '../MainHeader.styles';
interface ICheckoutProps {
  togglePathsReview: (isOpen: boolean) => void;
}
export const Checkout = (props: ICheckoutProps) => {
  const {
    resources: { paths: pathItems }
  } = useAppSelector((state) => state);
  const currentTheme = getTheme();
  const {
    iconButton: checkoutButtonStyles,
    checkoutContainerStyles,
    tooltipStyles,
    checkoutNumberStyles
  } = mainHeaderStyles(currentTheme);
  const calloutStyles: React.CSSProperties = {
    overflowY: 'hidden'
  };
  const items: IContextualMenuItem[] = [];
  const menuProperties: IContextualMenuProps = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items,
    directionalHint: DirectionalHint.bottomLeftEdge,
    directionalHintFixed: true,
    calloutProps: {
      style: calloutStyles
    },
    styles: {
      container: { border: '1px solid' + currentTheme.palette.neutralTertiary }
    }
  };
  return (
    <div style={checkoutContainerStyles}>
      <TooltipHost
        content={
          <div style={{ padding: '3px' }}>
            {translateMessage('Generate client - preview')}
          </div>
        }
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
        styles={tooltipStyles}
      >
        <IconButton
          disabled={pathItems.length === 0}
          ariaLabel={translateMessage('Generate client - preview')}
          role='button'
          styles={checkoutButtonStyles}
          menuIconProps={{ iconName: 'ShoppingCart' }}
          menuProps={menuProperties}
          onMenuClick={() => props.togglePathsReview(true)}
        />
        <Label style={checkoutNumberStyles}>({pathItems.length})</Label>
      </TooltipHost>
    </div>
  );
};
