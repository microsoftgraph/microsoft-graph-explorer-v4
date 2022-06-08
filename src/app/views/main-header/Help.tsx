import {
  ContextualMenuItemType,
  DirectionalHint,
  getId,
  getTheme,
  IconButton,
  registerIcons,
  TooltipHost
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GitHubLogoIcon } from '@fluentui/react-icons-mdl2';

import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { IRootState } from '../../../types/root';
import { translateMessage } from '../../utils/translate-messages';
import { mainHeaderStyles } from './MainHeader.styles';

export const Help = () => {
  const { authToken } = useSelector((state: IRootState) => state);
  const authenticated = authToken.token;
  const [items, setItems] = useState([]);
  const currentTheme = getTheme();

  registerIcons({
    icons: {
      GitHubLogo: <GitHubLogoIcon />
    }
  });

  useEffect(() => {
    const menuItems: any = [
      {
        key: 'report-issue',
        text: translateMessage('Report an Issue'),
        href: 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4/issues/new/choose',
        target: '_blank',
        iconProps: {
          iconName: 'ReportWarning'
        },
        onClick: () => trackLinkClickEvents(componentNames.REPORT_AN_ISSUE_LINK)
      },
      { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
      {
        key: 'ge-documentation',
        text: translateMessage('Get started with Graph Explorer'),
        href: 'https://docs.microsoft.com/en-us/graph/graph-explorer/graph-explorer-overview?view=graph-rest-1.0',
        target: '_blank',
        iconProps: {
          iconName: 'TextDocument'
        },
        onClick: () => trackLinkClickEvents(componentNames.GE_DOCUMENTATION_LINK)
      },
      {
        key: 'graph-documentation',
        text: translateMessage('Graph Documentation'),
        href: ' https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0',
        target: '_blank',
        iconProps: {
          iconName: 'Documentation'
        },
        onClick: () => trackLinkClickEvents(componentNames.GRAPH_DOCUMENTATION_LINK)
      },
      {
        key: 'github',
        text: 'GitHub',
        href: 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4#readme',
        target: '_blank',
        iconProps: {
          iconName: 'GitHubLogo',
          styles: {
            root: {
              position: 'relative',
              top: '-2px'
            }
          }
        },
        onClick: () => trackLinkClickEvents(componentNames.GITHUB_LINK)
      }
    ];
    setItems(menuItems);
  }, [authenticated]);

  const trackLinkClickEvents = (componentName: string) => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentName
    });
  };

  const calloutStyles: React.CSSProperties = {
    overflowY: 'hidden'
  }
  const { iconButton: helpButtonStyles, tooltipStyles, helpContainerStyles } = mainHeaderStyles(currentTheme);

  const menuProperties = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items,
    directionalHint: DirectionalHint.bottomLeftEdge,
    calloutProps: {
      style: calloutStyles
    },
    styles:{container: {border: '1px solid' + currentTheme.palette.neutralTertiary}}
  };

  return (
    <div style={helpContainerStyles}>
      <TooltipHost
        content={
          <div style={{padding:'3px'}}>
            {translateMessage('Help')}
          </div>}
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
        styles={ tooltipStyles }
      >
        <IconButton
          ariaLabel={translateMessage('Help')}
          role={'button'}
          styles={helpButtonStyles}
          menuIconProps={{ iconName: 'Help' }}
          menuProps={menuProperties}
        />
      </TooltipHost>
    </div>
  );
}

