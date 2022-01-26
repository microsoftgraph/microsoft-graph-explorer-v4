import {
  ContextualMenuItemType, getId, Icon, IconButton,
  IContextualMenuItem, mergeStyleSets, TooltipHost
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { telemetry, eventTypes, componentNames } from '../../../../telemetry';

import { IQuery } from '../../../../types/query-runner';
import { IResourceLink, ResourceOptions } from '../../../../types/resources';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { getAvailableMethods, getUrlFromLink, getOverflowWidthRange } from './resource-explorer.utils';
import { getScreenResolution } from '../../common/screen-resolution/screen-resolution';

interface IResourceLinkProps {
  link: any;
  isolateTree: Function;
  resourceOptionSelected: Function;
  version: string;
  linkLevel: number;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const dispatch = useDispatch();
  const { link: resourceLink, version } = props;
  const [resourceLevelOnIsolation, setResourceLevelOnIsolation] = useState(-1);
  const [isolationFlag, setIsolationFlag] = useState(false);
  const {device: resolution, width, currentResolution} = getScreenResolution();

  useEffect(() => {
    setResourceLevelOnIsolation(props.linkLevel);
  },  [isolationFlag]);

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

  const setMaximumOverflowWidth = () : string => {
    const compensation = compensateForLinkIndent();
    const { minimumOverflowWidth, maximumOverflowWidth } = getOverflowWidthRange(resolution);
    return `${updateOverflowWidth(minimumOverflowWidth, maximumOverflowWidth) - compensation}px`
  }

  // Dynamically maps the overflow width range over the screen resolution range
  const updateOverflowWidth = ( minimumOverflowWidth: number, maximumOverflowWidth: number) : number => {
    const current_resolution = currentResolution;
    const lowestDeviceWidth = width.minimumWidth;
    const highestDeviceWidth = width.maximumWidth;
    return (current_resolution - lowestDeviceWidth) * (maximumOverflowWidth - minimumOverflowWidth) /
     (highestDeviceWidth - lowestDeviceWidth) + minimumOverflowWidth;
  }

  const isolateResourceLink = (resourceLink_: IResourceLink) => {
    setIsolationFlag(true);
    props.isolateTree(resourceLink_);
  }

  // Adjusts maximum width for each link level
  const compensateForLinkIndent = () : number => {
    const levelCompensation = new Map([
      [1, -30],
      [2, -20],
      [3, 10],
      [4, 25],
      [5, 40],
      [6, 60],
      [7, 70],
      [8, 75],
      [9, 80],
      [10, 85]
    ])
    const currentLevel: number = resourceLevelOnIsolation === -1 ? resourceLink.level :
      resourceLink.level - resourceLevelOnIsolation;
    if(currentLevel >= 11) {
      return 120;
    }
    const compensation = levelCompensation.get(currentLevel);
    return  compensation ? compensation : 0;
  }

  return <span
    className={linkStyle.link}>

    <span
      style={{
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: setMaximumOverflowWidth()
      }}
    >
      {!!resourceLink.iconresourceLink && <Icon style={{ margin: '0 4px' }}
        {...resourceLink.iconresourceLink} />}
      {resourceLink.name}
    </span>

    <span>
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
    </span>
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
          onClick: () => isolateResourceLink(resourceLink)
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