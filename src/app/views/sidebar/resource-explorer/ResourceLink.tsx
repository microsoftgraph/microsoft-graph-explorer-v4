import { getId, getTheme, IconButton, mergeStyleSets, TooltipHost } from '@fluentui/react';
import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';

import { ResourceOptions } from '../../../../types/resources';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { translateMessage } from '../../../utils/translate-messages';
interface IResourceLinkProps {
  link: any;
  isolateTree: Function;
  resourceOptionSelected: Function;
  linkLevel: number;
  classes: any;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const { link: resourceLink, classes } = props;

  const tooltipId = getId('tooltip');
  const buttonId = getId('targetButton');
  const documentButton = getId('documentButton');
  const documentButtonTooltip = getId('documentButtonTooltip');

  const iconButtonStyles = {
    root: { marginTop: -5, marginRight: 2, zIndex: 10 },
    menuIcon: { fontSize: 14, padding: 5 }
  };

  const methodButtonStyles: CSSProperties = {
    background: getStyleFor(resourceLink.method),
    textAlign: 'center',
    marginRight: '12px',
    maxHeight: 24,
    textTransform: 'uppercase'
  }

  const openDocumentationLink = () => {
    window.open(resourceLink.docLink, '_blank');
    trackDocumentLinkClickedEvent();
  }

  const trackDocumentLinkClickedEvent = async (): Promise<void> => {
    const documentationLink = resourceLink.docLink;
    const properties: { [key: string]: any } = {
      ComponentName: componentNames.RESOURCE_DOCUMENTATION_LINK,
      QueryUrl: resourceLink.url,
      Link: documentationLink
    };
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, properties);
    // Check if link throws error
    validateExternalLink(documentationLink || '', componentNames.AUTOCOMPLETE_DOCUMENTATION_LINK, documentationLink);
  }

  return <span className={linkStyle.link}>
    {resourceLink.method &&
      <span className={classes.badge} style={methodButtonStyles}>
        {resourceLink.method}
      </span>
    }

    <span className={linkStyle.resourceLinkNameContainer}>
      <span className={linkStyle.resourceLinkText}>
        {resourceLink.name}
      </span>
    </span>

    <div>
      {resourceLink.method &&
        <TooltipHost
          content={translateMessage('Query documentation')}
          id={documentButtonTooltip}
          calloutProps={{ gapSpace: 0, target: `#${documentButton}` }}
          tooltipProps={{
            onRenderContent: () => {
              return <div style={{ paddingBottom: 2 }}>
                {resourceLink.docLink ? resourceLink.docLink : translateMessage('Query documentation not found')}
              </div>
            }
          }}
        >
          <IconButton
            aria-label={translateMessage('Query documentation')}
            role='button'
            id={documentButton}
            disabled={!resourceLink.docLink}
            aria-describedby={documentButton}
            styles={iconButtonStyles}
            onClick={() => openDocumentationLink()}
            menuIconProps={{ iconName: 'TextDocument' }}
          />
        </TooltipHost>
      }

      <TooltipHost
        content={translateMessage('Add to collection')}
        id={tooltipId}
        calloutProps={{ gapSpace: 0, target: `#${buttonId}` }}
        tooltipProps={{
          onRenderContent: () => {
            return <div style={{ paddingBottom: 2 }}>
              <FormattedMessage id={'Add to collection'} />
            </div>
          }
        }}
      >
        <IconButton
          ariaLabel={translateMessage('Add to collection')}
          role='button'
          id={buttonId}
          aria-describedby={tooltipId}
          styles={iconButtonStyles}
          menuIconProps={{ iconName: 'AddNotes' }}
          onClick={() => props.resourceOptionSelected(ResourceOptions.ADD_TO_COLLECTION, resourceLink)}
        />
      </TooltipHost>
    </div>
  </span>
}

const linkStyle = mergeStyleSets(
  {
    link: {
      display: 'flex', lineHeight: 'normal', width: '100%', overflow: 'hidden',
      div: {
        display: 'none'
      },
      '&:hover': {
        background: getTheme().palette.neutralLighter,
        div: {
          display: 'inline',
          overflow: 'hidden',
          alignItems: 'center'
        }
      }
    },
    resourceLinkNameContainer: { textAlign: 'left', flex: '1', overflow: 'hidden', display: 'flex', padding: 5 },
    resourceLinkText: { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }
  }
);

export default ResourceLink;
