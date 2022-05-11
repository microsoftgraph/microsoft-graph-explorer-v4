import {
  ContextualMenuItemType,
  getId,
  IconButton,
  registerIcons,
  TooltipHost
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { GitHubLogoIcon } from '@fluentui/react-icons-mdl2';

import '../../utils/string-operations';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { IRootState } from '../../../types/root';
import { ISettingsProps } from '../../../types/settings';
import { translateMessage } from '../../utils/translate-messages';
import { geLocale } from '../../../appLocale';

function Settings(props: ISettingsProps) {
  const { authToken } = useSelector((state: IRootState) => state);
  const authenticated = authToken.token;
  const [items, setItems] = useState([]);

  const {
    intl: { messages }
  }: any = props;

  registerIcons({
    icons: {
      GitHubLogo: <GitHubLogoIcon />
    }
  });

  useEffect(() => {
    const menuItems: any = [
      {
        key: 'office-dev-program',
        text: messages['Office Dev Program'],
        href: `https://developer.microsoft.com/${geLocale}/office/dev-program`,
        target: '_blank',
        iconProps: {
          iconName: 'CommandPrompt'
        },
        onClick: () => trackOfficeDevProgramLinkClickEvent()
      },
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
        text: translateMessage('Github'),
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

  const trackOfficeDevProgramLinkClickEvent = () => {
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
      ComponentName: componentNames.OFFICE_DEV_PROGRAM_LINK
    });
  };

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
          role='button'
          styles={{
            label: { marginBottom: -20 },
            menuIcon: { fontSize: 20 }
          }}
          menuIconProps={{ iconName: 'Help' }}
          menuProps={menuProperties}
        />
      </TooltipHost>
    </div>
  );
}

export default injectIntl(Settings);

