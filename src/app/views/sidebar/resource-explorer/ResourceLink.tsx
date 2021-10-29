import { ContextualMenuItemType, Icon, INavLink } from '@fluentui/react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { IQuery } from '../../../../types/query-runner';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { MethodIndicator } from './methods';
import { getAvailableMethods, getUrlFromLink } from './resource-explorer.utils';
import ContextMenu from '../../common/ContextMenu';

interface IResourceLink {
  link: any;
  isolateTree: Function;
  openPanel: Function;
  version: string;
}

const ResourceLink = (props: IResourceLink) => {
  const dispatch = useDispatch();
  const { link: resourceLink, version } = props;

  const selectContextItem = (e: any, item: any, link: INavLink) => {
    switch (item.key) {
      case 'isolate':
        props.isolateTree(link);
        break;
      case 'show-query-parameters':
        props.openPanel('show-query-parameters', link);
        break;
      default:
        setQuery(link);
        break;
    }
  };

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

  const menuItems = [
    {
      key: 'actions',
      itemType: ContextualMenuItemType.Header,
      text: resourceLink.name
    }
  ];

  if (resourceLink!.links!.length > 0) {
    menuItems.push(
      {
        key: 'isolate',
        text: translateMessage('Isolate'),
        itemType: ContextualMenuItemType.Normal
      });
  }

  if (resourceLink.type === 'path') {
    menuItems.push(
      {
        key: 'run-query',
        text: translateMessage('Run Query'),
        itemType: ContextualMenuItemType.Normal
      },
      {
        key: 'show-query-parameters',
        text: translateMessage('Query parameters'),
        itemType: ContextualMenuItemType.Normal
      });
  }

  const availableMethods = getAvailableMethods(resourceLink.labels, version);

  return <ContextMenu
    style={{
      flexGrow: 1,
      textAlign: 'left',
      boxSizing: 'border-box'
    }}
    key={resourceLink.key}
    items={menuItems}
    onItemClick={(e: any, item: any) => selectContextItem(e, item, resourceLink)}>
    <span style={{ display: 'flex' }}>
      {!!resourceLink.iconresourceLink && <Icon style={{ margin: '0 4px' }} {...resourceLink.iconresourceLink} />}
      {resourceLink.name}
      {availableMethods.length > 0 && <MethodIndicator methods={availableMethods} key={resourceLink.key} />}
    </span>
  </ContextMenu>;
}

export default ResourceLink;