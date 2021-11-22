import {
  ContextualMenuItemType, Icon, IconButton,
  IContextualMenuItem, INavLink
} from '@fluentui/react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { IQuery } from '../../../../types/query-runner';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { MethodIndicator } from './methods';
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

  const setQuery = (link: INavLink) => {
    const sampleUrl = `${GRAPH_URL}/${version}${getUrlFromLink(link)}`;
    const query: IQuery = {
      selectedVerb: 'GET',
      selectedVersion: version,
      sampleUrl,
      sampleHeaders: [],
      sampleBody: undefined
    };
    dispatch(setSampleQuery(query));
    if (!sampleUrl.includes('{')) {
      dispatch(runQuery(query));
    }
  }

  const items = getMenuItems();
  const availableMethods = getAvailableMethods(resourceLink.labels, version);

  return <span style={{ display: 'flex' }}>
    {!!resourceLink.iconresourceLink && <Icon style={{ margin: '0 4px' }}
      {...resourceLink.iconresourceLink} />}
    {resourceLink.name}
    {availableMethods.length > 0 && <MethodIndicator methods={availableMethods} key={resourceLink.key} />}

    {items.length > 0 && <IconButton
      ariaLabel={translateMessage('More actions')}
      role='button'
      style={{ float: 'right', position: 'absolute', right: 0 }}
      styles={{
        label: { marginBottom: -20 },
        menuIcon: { fontSize: 20 }
      }}
      menuIconProps={{ iconName: 'MoreVertical' }}
      menuProps={{
        shouldFocusOnMount: true,
        alignTargetEdge: true,
        items
      }}
    />}
  </span>;

  function getMenuItems() {
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
          key: 'run-query',
          text: translateMessage('Run Query'),
          itemType: ContextualMenuItemType.Normal,
          onClick: () => setQuery(resourceLink)
        },
        {
          key: 'show-query-parameters',
          text: translateMessage('Access query parameters'),
          itemType: ContextualMenuItemType.Normal,
          onClick: () => props.openPanel('show-query-parameters', resourceLink)
        });
    }

    const availableMethods = getAvailableMethods(resourceLink.labels, version);
    if (availableMethods.length > 0) {
      const subMenuItems: IContextualMenuItem[] = [];
      availableMethods.forEach(element => {
        subMenuItems.push({ key: element, text: element.toUpperCase(), disabled: true })
      });
      menuItems.unshift({
        key: 'supported-methods',
        itemType: ContextualMenuItemType.Normal,
        text: translateMessage('Show methods'),
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

export default ResourceLink;