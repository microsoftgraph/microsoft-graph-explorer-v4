import { makeResetStyles, tokens, useFluent } from '@fluentui/react-components';
import * as React from 'react';

interface HandleProps {
  position: 'start' | 'end' | 'top' | 'bottom';
  onDoubleClick?: () => void;
}

const useHoverStyles = makeResetStyles({
  ':hover': {
    backgroundColor: tokens.colorBrandBackgroundHover
  }
});
export const LayoutResizeHandler = React.forwardRef<
  HTMLDivElement,
  HandleProps
>((props, ref) => {
  const { position, ...rest } = props;
  const { dir } = useFluent();
  const hoverStyles = useHoverStyles();

  const handleClick = (event: React.MouseEvent) => {
    if (event.detail === 2) {
      props.onDoubleClick?.();
    }
  };

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
          [positioningAttr]: '-7px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: '100%',
          cursor: 'col-resize'
        }
      : {
          ...(position === 'top' ? { top: '-7px' } : { bottom: '-7px' }),
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
});
LayoutResizeHandler.displayName = 'LayoutResizeHandler';
