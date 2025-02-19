import { makeResetStyles, tokens, useFluent } from '@fluentui/react-components';
import * as React from 'react';
import { useAppSelector } from '../../../store';

interface HandleProps {
  position: 'start' | 'end' | 'top' | 'bottom';
  onDoubleClick?: () => void;
}

const useHoverStyles = makeResetStyles({
  ':hover': {
    backgroundColor: tokens.colorBrandBackgroundHover
  }
})
export const LayoutResizeHandler = React.forwardRef<HTMLDivElement, HandleProps>(
  (props, ref) => {
    const { position, ...rest } = props;
    const { dir } = useFluent();
    const hoverStyles = useHoverStyles();
    const mobileScreen  = useAppSelector((state) => state.sidebarProperties.mobileScreen);

    const handleClick = (event: React.MouseEvent) => {
      if (event.detail === 2) {
        props.onDoubleClick?.();
      }
    };

    if (mobileScreen) {
      return null;
    }

    const positioningAttr =
      dir === 'ltr'
        ? position === 'start'
          ? 'left'
          : 'right'
        : position === 'start'
          ? 'right'
          : 'left';

    const positioningProps =
      position === 'start' || position === 'end'
        ? {
          [positioningAttr]: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '100%',
          cursor: 'col-resize'
        }
        : {
          ...(position === 'top' ? { top: '-6.5px' } : { bottom: '-6.5px' }),
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '3px',
          cursor: 'row-resize'
        };

    return (
      <div
        {...rest}
        ref={ref}
        onClick={handleClick}
        tabIndex={0}
        className={hoverStyles}
        style={{
          position: 'absolute',
          borderRadius: '2px',
          ...positioningProps
        }}
      />
    );
  }
);
LayoutResizeHandler.displayName = 'LayoutResizeHandler';