import {
  ContextualMenuItemType, Icon, IconButton,
  IContextualMenuItem, INavLink, mergeStyleSets
} from '@fluentui/react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { IQuery } from '../../../../types/query-runner';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { getAvailableMethods, getUrlFromLink, removeCounter } from './resource-explorer.utils';

interface IResourceLink {
  link: any;
  isolateTree: Function;
  openPanel: Function;
  version: string;
}

const ResourceLink = (props: IResourceLink) => {
  const dispatch = useDispatch();
  const { link: resourceLink, version } = props;

  const iconButtonStyles = {
    root: { paddingBottom: 10 },
    menuIcon: { fontSize: 20, padding: 10 }
  };

  const setQuery = (link: INavLink, selectedVerb: string) => {
    const sampleUrl = `${GRAPH_URL}/${version}${getUrlFromLink(link)}`;
    const query: IQuery = {
      selectedVerb,
      selectedVersion: version,
      sampleUrl,
      sampleHeaders: [],
      sampleBody: undefined
    };
    dispatch(setSampleQuery(query));
  }

  const items = getMenuItems();

  return <span className={linkStyle.link}>
    {!!resourceLink.iconresourceLink && <Icon style={{ margin: '0 4px' }}
      {...resourceLink.iconresourceLink} />}
    {resourceLink.name}

    {items.length > 0 && <IconButton
      ariaLabel={translateMessage('More actions')}
      role='button'
      className={linkStyle.button}
      styles={iconButtonStyles}
      menuIconProps={{ iconName: 'MoreVertical' }}
      menuProps={{
        shouldFocusOnMount: true,
        alignTargetEdge: true,
        items
      }}
    />}
  </span>;

  function getMenuItems() {
    const availableMethods = getAvailableMethods(resourceLink.labels, version);
    const menuItems: IContextualMenuItem[] = [];

    if (resourceLink!.links!.length > 0) {
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
          key: 'show-query-parameters',
          text: translateMessage('Access query parameters'),
          itemType: ContextualMenuItemType.Normal,
          onClick: () => props.openPanel('show-query-parameters', resourceLink)
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

    if (menuItems.length > 0) {
      menuItems.unshift({
        key: 'actions',
        itemType: ContextualMenuItemType.Header,
        text: removeCounter(resourceLink.name)
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