import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import React, { useState } from 'react';

import { translateMessage } from '../../../utils/translate-messages';
import PathsReview from './panels/PathsReview';

interface ICommandOptions {
  version: string;
}

const CommandOptions = (props: ICommandOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const { version } = props;
  const options: ICommandBarItemProps[] = [
    {
      key: 'preview',
      text: translateMessage('Preview collection'),
      iconProps: { iconName: 'View' },
      onClick: () => toggleSelectedResourcesPreview()
    }
  ];

  const toggleSelectedResourcesPreview = () => {
    let open = isOpen;
    open = !open;
    setIsOpen(open);
  }

  return (
    <div>
      <CommandBar
        items={options}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
      />
      <PathsReview
        isOpen={isOpen}
        version={version}
        toggleSelectedResourcesPreview={toggleSelectedResourcesPreview}
      />
    </div>
  )
}

export default CommandOptions;
