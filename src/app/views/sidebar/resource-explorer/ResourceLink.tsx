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
import { getAvailableMethods, getUrlFromLink } from './resource-explorer.utils';

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [resourceLevelOnIsolation, setResourceLevelOnIsolation] = useState(-1);
  const [isolationFlag, setIsolationFlag] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setResourceLevelOnIsolation(props.linkLevel);
  },  [isolationFlag]);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  }

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

  const setMaxOverflowWidth = () : string => {
    const compensation = compensateForLevelPx();
    if (windowWidth > 800 && windowWidth < 1024){ return `${130 - compensation}px`}
    if (windowWidth > 1024 && windowWidth < 1280){ return `${180 - compensation}px`}
    if (windowWidth < 1600) {return  `${205 - compensation}px`;}
    if (windowWidth >= 1600 && windowWidth < 2000) {return `${310-compensation}px`;}
    if (windowWidth >= 2000) {return `${400-compensation}px`;}
    return ''
  }

  const isolateResourceLink = (resourceLink_: IResourceLink) => {
    setIsolationFlag(true);
    props.isolateTree(resourceLink_);
  }

  const compensateForLevelPx = () : number => {
    const levelCompensation = new Map([
      [1, 0],
      [2, 23],
      [3, 30],
      [4, 40],
      [5, 55],
      [6, 65],
      [7, 75],
      [8, 80],
      [9, 85],
      [10, 90]
    ])
    const currentLevel: number = resourceLevelOnIsolation === -1 ? resourceLink.level :
      resourceLink.level - resourceLevelOnIsolation;
    if(currentLevel >= 11) {
      return 100;
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
        maxWidth: setMaxOverflowWidth()
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