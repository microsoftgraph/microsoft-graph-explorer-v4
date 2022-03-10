import { CommandBar, CommandBarButton, getTheme, IButtonProps, ICommandBarItemProps } from '@fluentui/react';
import React, { useState } from 'react';

import { translateMessage } from '../../../../utils/translate-messages';
import PathsReview from '../panels/PathsReview';
import { resourceExplorerStyles } from '../resources.styles';

interface ICommandOptions {
  version: string;
}

const CommandOptions = (props: ICommandOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const { version } = props;
  const theme = getTheme();

  const itemStyles = resourceExplorerStyles(theme).itemStyles;
  const commandStyles = resourceExplorerStyles(theme).commandBarStyles;
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

  const CustomButton: React.FunctionComponent<IButtonProps> = (props_: any) => {
    return <CommandBarButton {...props_} onClick={toggleSelectedResourcesPreview} styles={itemStyles} />;
  };

  return (
    <div>
      <CommandBar
        items={options}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
        buttonAs={CustomButton}
        styles={commandStyles}
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
