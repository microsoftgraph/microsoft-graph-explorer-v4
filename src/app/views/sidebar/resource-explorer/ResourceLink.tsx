import {
  ContextualMenuItemType, getId, Icon, IconButton,
  IContextualMenuItem, mergeStyleSets, TooltipHost
} from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { telemetry, eventTypes, componentNames } from '../../../../telemetry';

import { IQuery } from '../../../../types/query-runner';
import { IResourceLink, ResourceOptions } from '../../../../types/resources';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { getAvailableMethods, getUrlFromLink } from './resource-explorer.utils';

interface IResourceLinkProps {
  link: any;
  isolateTree: Function;
  resourceOptionSelected: Function;
  version: string;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const dispatch = useDispatch();
  const { link: resourceLink, version } = props;

  const tooltipId = getId('tooltip');
  const buttonId = getId('targetButton');

  const iconButtonStyles = {
    root: { paddingBottom: 10 },
    menuIcon: { fontSize: 20, padding: 10 }
  };

  const setQuery = (link: IResourceLink, selectedVerb: string) => {
    const resourceUrl = getUrlFromLink(link);
    const sampleUrl = `${GRAPH_URL}/${version}${resourceUrl}`;
    const query: IQuery = {
      selectedVerb,
      selectedVersion: version,
      sampleUrl,
      sampleHeaders: [],
      sampleBody: undefined
    };
    dispatch(setSampleQuery(query));
    telemetry.trackEvent(eventTypes.LISTITEM_CLICK_EVENT,
      {
        ComponentName: componentNames.RESOURCES_SET_QUERY_LIST_ITEM,
        SelectedVerb: selectedVerb,
        ResourcePath: resourceUrl
      });
  }

  const items = getMenuItems();

  return <span className={linkStyle.link}>
    {!!resourceLink.iconresourceLink && <Icon style={{ margin: '0 4px' }}
      {...resourceLink.iconresourceLink} />}
    {resourceLink.name}

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
          className={linkStyle.button}
          styles={iconButtonStyles}
          menuIconProps={{ iconName: 'MoreVertical' }}
          title={translateMessage('More actions')}
          menuProps={{
            shouldFocusOnMount: true,
            alignTargetEdge: true,
            items
          }}
        />
      </TooltipHost>
    }
  </span>;

  function getMenuItems() {
    const availableMethods = getAvailableMethods(resourceLink.labels, version);
    const menuItems: IContextualMenuItem[] = [];

    if (resourceLink && resourceLink.links && resourceLink.links.length > 0) {
      menuItems.push(
        {
          key: 'isolate',
          text: translateMessage('Isolate'),
          itemType: ContextualMenuItemType.Normal,
          onClick: () => props.isolateTree(resourceLink)
        });
    }

    if (resourceLink.type === 'path') {
      menuItems.push(
        {
          key: ResourceOptions.ADD_TO_COLLECTION,
          text: translateMessage('Add to collection'),
          itemType: ContextualMenuItemType.Normal,
          onClick: () => props.resourceOptionSelected(ResourceOptions.ADD_TO_COLLECTION, resourceLink)
        });
    }

    if (availableMethods.length > 0) {
      const subMenuItems: IContextualMenuItem[] = [];
      availableMethods.forEach(element => {
        subMenuItems.push({
          key: element,
          text: element.toUpperCase(),
          onClick: () => setQuery(resourceLink, element.toUpperCase())
        })
      });

      menuItems.unshift({
        key: 'set-query',
        text: translateMessage('Set Query'),
        itemType: ContextualMenuItemType.Normal,
        subMenuProps: {
          items: subMenuItems
        }
      });
    }
    return menuItems;
  }
}

const linkStyle = mergeStyleSets(
  {
    link: { display: 'flex' },
    button: { float: 'right', position: 'absolute', right: 0 }
  }
);

export default ResourceLink;