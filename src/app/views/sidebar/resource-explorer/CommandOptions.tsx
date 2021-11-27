import { CommandBar, ICommandBarItemProps, INavLink } from '@fluentui/react';
import React, { useState } from 'react';

import { translateMessage } from '../../../utils/translate-messages';
import PathsReview from './panels/PathsReview';

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
      <PathsReview
        isOpen={isOpen}
        items={items}
        version={version}
        toggleSelectedResourcesPreview={toggleSelectedResourcesPreview}
      />
    </div>
  )
}

export default CommandOptions;
