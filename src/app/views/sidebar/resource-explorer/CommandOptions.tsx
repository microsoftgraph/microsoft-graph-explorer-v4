import { CommandBar, ICommandBarItemProps, INavLink } from '@fluentui/react';
import React, { useState } from 'react';

import { translateMessage } from '../../../utils/translate-messages';
import PostmanCollection from './panels/PostmanCollection';

interface ICommandOptions {
  list: INavLink[],
  version: string;
}

const CommandOptions = (props: ICommandOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const { list, version } = props;
  const options: ICommandBarItemProps[] = [
    {
      key: 'preview',
      text: translateMessage('Preview tree'),
      iconProps: { iconName: 'View' },
      onClick: () => toggleSelectedResourcesPreview()
    }
  ];

  const farRightItems: ICommandBarItemProps[] = [
    {
      key: 'info',
      text: 'Info',
      // This needs an ariaLabel since it's icon-only
      ariaLabel: 'Info',
      iconOnly: true,
      iconProps: { iconName: 'Info' },
      onClick: () => console.log('info')
    }
  ];

  const toggleSelectedResourcesPreview = () => {
    let open = isOpen;
    open = !open;
    setIsOpen(open);
  }

  const items = [{
    links: list
  }]

  return (
    <div>
      <CommandBar
        items={options}
        farItems={farRightItems}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
      />
      <PostmanCollection
        isOpen={isOpen}
        items={items}
        version={version}
        toggleSelectedResourcesPreview={toggleSelectedResourcesPreview}
      />
    </div>
  )
}

export default CommandOptions;
