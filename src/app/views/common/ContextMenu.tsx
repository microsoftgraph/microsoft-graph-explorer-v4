import React, { useState } from 'react';
import { ContextualMenu } from '@fluentui/react';

const ContextMenu = (props: any) => {
  const {
    component: Component = 'div',
    items,
    menuProps,
    onItemClick,
    ...componentProps
  } = props;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);

  const onContextMenu = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setHidden(false);
  };

  const onDismiss = () => {
    setHidden(true);
  };

  return (
    <>
      <Component {...componentProps}
        onContextMenu={onContextMenu}>
        {props.children}
      </Component>
      <ContextualMenu
        {...menuProps}
        items={items}
        hidden={hidden}
        target={position}
        onItemClick={onItemClick}
        onDismiss={onDismiss}
      />
    </>
  );
}

export default ContextMenu;