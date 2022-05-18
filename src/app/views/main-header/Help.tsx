import {
  ContextualMenuItemType,
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
        onClick: () => trackReportAnIssueLinkClickEvent()
      },
      { key: 'divider_1', itemType: ContextualMenuItemType.Divider },
      {
        key: 'ge-documentation',
        text: translateMessage('Documentation'),
        href: ' https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0',
        target: '_blank',
        iconProps: {
          iconName: 'Documentation'
        },
        onClick: () => trackDocumentationLinkClickEvent()
      },
      {
        key: 'github',
        text: translateMessage('GitHub'),
        href: 'https://github.com/microsoftgraph/microsoft-graph-explorer-v4',
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
        onClick: () => trackGithubLinkClickEvent()
      }
    ];
    setItems(menuItems);
  }, [authenticated]);

  const trackReportAnIssueLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.REPORT_AN_ISSUE_LINK
    });
  };

  const trackDocumentationLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.GE_DOCUMENTATION_LINK
    });
  };

  const trackGithubLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.GITHUB_LINK
    });
  };

  const calloutStyles: React.CSSProperties = {
    overflowY: 'hidden'
  }
  const helpButtonStyles = mainHeaderStyles(currentTheme).iconButton;

  const menuProperties = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items,
    calloutProps: {
      style: calloutStyles
    }
  };

  return (
    <div>
      <TooltipHost
        content={translateMessage('Help')}
        id={getId()}
        calloutProps={{ gapSpace: 0 }}
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

