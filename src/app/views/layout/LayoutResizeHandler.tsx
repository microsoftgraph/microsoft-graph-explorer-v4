import { makeResetStyles, tokens, useFluent } from '@fluentui/react-components';
import * as React from 'react';
import { useAppSelector } from '../../../store';

interface HandleProps {
  position: 'start' | 'end' | 'top' | 'bottom';
  onDoubleClick?: () => void;
  onMouseDown?: (event: React.MouseEvent) => void;
}

const useHoverStyles = makeResetStyles({
  ':hover': {
    backgroundColor: tokens.colorBrandBackgroundHover
  }
})
export const LayoutResizeHandler = React.forwardRef<HTMLDivElement, HandleProps>(
  (props, ref) => {
    const { position,onMouseDown, ...rest } = props;
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
    const positioningProps = (() => {
      if (position === 'start' || position === 'end') {
        return {
          [positioningAttr]: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '100%',
          cursor: 'col-resize'
        };
      }

      if (position === 'top' || position === 'bottom') {
        return {
          [position]: '0',
          left: '0',
          width: '100%',
          height: '6px',
          cursor: 'row-resize'
        };
      }

      return {};
    })();

    return (
      <div
        {...rest}
        ref={ref}
        onClick={handleClick}
        onMouseDown={onMouseDown}
        tabIndex={-1}
        className={hoverStyles}
        style={{
          position: 'absolute',
          borderRadius: '2px',
          ...positioningProps
        }}
        aria-hidden={true}
      />
    );
  }
);
LayoutResizeHandler.displayName = 'LayoutResizeHandler';