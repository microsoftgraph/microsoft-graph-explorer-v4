import {
  ContextualMenuItemType, getId, IconButton,
  IContextualMenuItem, mergeStyleSets, TooltipHost
} from '@fluentui/react';
import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';

import { ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { translateMessage } from '../../../utils/translate-messages';
interface IResourceLinkProps {
  link: any;
  isolateTree: Function;
  resourceOptionSelected: Function;
  linkLevel: number;
  classes: any;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const { link: resourceLink, classes } = props;

  const tooltipId = getId('tooltip');
  const buttonId = getId('targetButton');


  const iconButtonStyles = {
    root: { marginTop: -5, marginRight: 2 },
    menuIcon: { fontSize: 20, padding: 5 }
  };

  const methodButtonStyles: CSSProperties = {
    background: getStyleFor(resourceLink.method),
    textAlign: 'center',
    marginRight: '12px',
    maxHeight: 24
  }

  const items = getMenuItems();

  return <span className={linkStyle.link}>
    {resourceLink.method &&
      <span
        className={classes.badge}
        style={methodButtonStyles}
      >
        {resourceLink.method}
      </span>}

    <span className={linkStyle.resourceLinkNameContainer}>
      <span className={linkStyle.resourceLinkText}>
        {resourceLink.name}
      </span>
    </span>


    {items.length > 0 &&
      <TooltipHost
        content={translateMessage('More actions')}
        id={tooltipId}
        calloutProps={{ gapSpace: 0, target: `#${buttonId}` }}
        tooltipProps={{
          onRenderContent: function renderContent() {
            return <div style={{ paddingBottom: 3 }}>
              <FormattedMessage id={'More actions'} />
            </div>
          }
        }}
      >
        <IconButton
          ariaLabel={translateMessage('More actions')}
          role='button'
          id={buttonId}
          aria-describedby={tooltipId}
          styles={iconButtonStyles}
          menuIconProps={{ iconName: 'MoreVertical' }}
          menuProps={{
            shouldFocusOnMount: true,
            alignTargetEdge: true,
            items
          }}
        />
      </TooltipHost>
    }
  </span>

  function getMenuItems() {
    const menuItems: IContextualMenuItem[] = [];

    if (resourceLink) {
      if (resourceLink.type === ResourceLinkType.NODE) {
        menuItems.push(
          {
            key: 'isolate',
            text: translateMessage('Isolate'),
            itemType: ContextualMenuItemType.Normal,
            onClick: () => props.isolateTree(resourceLink)
          });
      }

      menuItems.push(
        {
          key: ResourceOptions.ADD_TO_COLLECTION,
          text: translateMessage('Add to collection'),
          itemType: ContextualMenuItemType.Normal,
          onClick: () => props.resourceOptionSelected(ResourceOptions.ADD_TO_COLLECTION, resourceLink)
        });
    }
    return menuItems;
  }
}

const linkStyle = mergeStyleSets(
  {
    link: { display: 'flex', lineHeight: 'normal', width: '100%', overflow: 'hidden' },
    resourceLinkNameContainer: { textAlign: 'left', flex: '1', overflow: 'hidden', display: 'flex' },
    resourceLinkText: { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }
  }
);

export default ResourceLink;
