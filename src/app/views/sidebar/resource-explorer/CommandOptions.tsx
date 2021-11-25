import { CommandBar, DetailsList, DetailsListLayoutMode, ICommandBarItemProps, INavLink, Panel, PanelType } from '@fluentui/react';
import React, { useState } from 'react';

import { IResourceLabel } from '../../../../types/resources';
import { translateMessage } from '../../../utils/translate-messages';
import { flatten, getUrlFromLink } from './resource-explorer.utils';

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

  const columns = [
    { key: 'url', name: 'Url', fieldName: 'url', minWidth: 200, maxWidth: 300, isResizable: true },
    { key: 'methods', name: 'Methods', fieldName: 'methods', minWidth: 100, maxWidth: 200, isResizable: true }
  ];

  const paths = getPaths();

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
        type={PanelType.large}
        // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
        closeButtonAriaLabel="Close"
      >
        <DetailsList
          compact={true}
          items={paths}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
        />
      </Panel>
    </div>
  )

  function getPaths() {
    const links = items[0].links
    const content = flatten(links).filter(k => k.type === 'path');
    if (content.length > 0) {
      content.forEach(element => {
        const methods = element.labels.find((k: IResourceLabel) => k.name === version)?.methods || [];
        element.version = version;
        element.url = `${getUrlFromLink(element)}`;
        element.methods = getListOfMethods(methods);
      });
    }
    return content;
  }

  function getListOfMethods(methods: string[]) {
    let listOfMethods = '';
    if (methods.length > 0) {
      methods.forEach((method: string, index: number) => {
        listOfMethods += `${method.toUpperCase()}${(index === methods.length - 1) ? '' : ','}`;
      });
    }
    return listOfMethods;
  }
}

export default CommandOptions;
