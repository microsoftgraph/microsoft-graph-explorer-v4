import { useFluent } from '@fluentui/react-components';
import * as React from 'react';

interface HandleProps {
  position: 'start' | 'end' | 'top' | 'bottom';
  onDoubleClick?: () => void;
}

export const LayoutResizeHandler = React.forwardRef<HTMLDivElement, HandleProps>(
  (props, ref) => {
    const { position, ...rest } = props;
    const { dir } = useFluent();

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
          [positioningAttr]: '-4px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '100px',
          cursor: 'ew-resize'
        }
        : {
          ...(position === 'top' ? { top: '-7px' } : { bottom: '-7px' }),
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '6px',
          cursor: 'ns-resize'
        };

    return (
      <div
        {...rest}
        ref={ref}
        onClick={handleClick}
        tabIndex={0}
        style={{
          position: 'absolute',
          borderRadius: '2px',
          backgroundColor: 'gray',
          ...positioningProps
        }}
      />
    );
  }
);
LayoutResizeHandler.displayName = 'LayoutResizeHandler';