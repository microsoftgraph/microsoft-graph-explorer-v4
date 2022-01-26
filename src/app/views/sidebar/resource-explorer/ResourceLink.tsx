import {
  ContextualMenuItemType, getId, Icon, IconButton,
  IContextualMenuItem, mergeStyleSets, TooltipHost
} from '@fluentui/react';
import React, { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { IQuery } from '../../../../types/query-runner';
import { ResourceOptions } from '../../../../types/resources';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { translateMessage } from '../../../utils/translate-messages';
import { getUrlFromLink } from './resource-explorer.utils';

interface IResourceLinkProps {
  link: any;
  isolateTree: Function;
  resourceOptionSelected: Function;
  version: string;
  classes: any;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const dispatch = useDispatch();
  const { link: resourceLink, version, classes } = props;

  const tooltipId = getId('tooltip');
  const buttonId = getId('targetButton');

  const iconButtonStyles = {
    root: { paddingBottom: 10 },
    menuIcon: { fontSize: 20, padding: 10 }
  };

  const methodButtonStyles: CSSProperties = {
    background: getStyleFor(resourceLink.method),
    textAlign: 'center',
    marginRight: '12px',
    marginLeft: '6px',
    maxHeight: 24
  }

  const setQuery = () => {
    const resourceUrl = getUrlFromLink(resourceLink);
    const sampleUrl = `${GRAPH_URL}/${version}${resourceUrl}`;
    const query: IQuery = {
      selectedVerb: resourceLink.method,
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
    {resourceLink.method &&
    <span
      className={classes.badge}
      style={methodButtonStyles}
      onClick={setQuery}
    >
      {resourceLink.method}
    </span>}
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

    if (resourceLink.type === 'path' || resourceLink.type === 'function') {
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
    link: { display: 'flex', lineHeight: 'normal' },
    button: { float: 'right', position: 'absolute', right: 0 }
  }
);

export default ResourceLink;
