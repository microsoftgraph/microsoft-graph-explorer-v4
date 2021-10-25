import { CommandBar, ICommandBarItemProps, INavLink, Nav, Panel, PanelType } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../../utils/translate-messages';

interface ICommandOptions {
  list: INavLink[]
}

const CommandOptions = (props: ICommandOptions) => {
  const [isOpen, setIsOpen] = useState(false);


  const { list } = props;
  const options: ICommandBarItemProps[] = [
    {
      key: 'preview',
      text: translateMessage('Preview tree'),
      iconProps: { iconName: 'View' },
      onClick: () => toggleSelectedResourcesPreview()
    },
    {
      key: 'download',
      text: translateMessage('Download as postman collection'),
      iconProps: { iconName: 'Download' },
      onClick: () => console.log('Download')
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

  const headerText = translateMessage('Selected Resources') + ' ' + translateMessage('Preview');
  const navStyles: any = (properties: any) => ({
    chevronIcon: [
      properties.isExpanded && {
        transform: 'rotate(0deg)'
      },
      !properties.isExpanded && {
        transform: 'rotate(-90deg)'
      }
    ]
  });

  return (
    <div>
      <CommandBar
        items={options}
        farItems={farRightItems}
        ariaLabel="Selection actions"
        primaryGroupAriaLabel="Selection actions"
        farItemsGroupAriaLabel="More selection actions"
      />

      <Panel
        headerText={`${headerText}`}
        isOpen={isOpen}
        onDismiss={toggleSelectedResourcesPreview}
        type={PanelType.medium}
        // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
        closeButtonAriaLabel="Close"
      >
        <Nav
          groups={items}
          styles={navStyles}
        />
      </Panel>
    </div>
  )
}

export default CommandOptions;
