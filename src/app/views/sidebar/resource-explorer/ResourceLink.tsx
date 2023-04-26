import { getId, getTheme, IconButton, ITooltipHostStyles, mergeStyleSets, TooltipHost } from '@fluentui/react';
import { CSSProperties } from 'react';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';

import { ResourceOptions } from '../../../../types/resources';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { translateMessage } from '../../../utils/translate-messages';
interface IResourceLinkProps {
  link: any;
  resourceOptionSelected: Function;
  classes: any;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const { link: resourceLink, classes } = props;

  const showButtons = {
    div: {
      visibility: 'visible'
    }
  };
  const linkStyle = mergeStyleSets(
    {
      link: {
        display: 'flex', lineHeight: 'normal', width: '100%', overflow: 'hidden',
        div: {
          visibility: 'hidden',
          overflow: 'hidden',
          alignSelf: 'center'
        },
        selectors: {
          ':hover': { background: getTheme().palette.neutralLight, ...showButtons },
          ':focus-within': showButtons,
          '.is-selected &': showButtons
        }
      },
      resourceLinkNameContainer: { textAlign: 'left', flex: '1', overflow: 'hidden', display: 'flex', padding: 5 },
      resourceLinkText: { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }
    }
  );

  const tooltipId = getId('tooltip');
  const buttonId = getId('targetButton');
  const documentButton = getId('documentButton');
  const documentButtonTooltip = getId('documentButtonTooltip');

  const iconButtonStyles = {
    root: { marginRight: 1, zIndex: 10 },
    menuIcon: { fontSize: 16, padding: 5 }
  };

  const methodButtonStyles: CSSProperties = {
    background: getStyleFor(resourceLink.method),
    alignSelf: 'center',
    margin: 2,
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

  const calloutProps = { gapSpace: 0 };
  const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

  return <span className={linkStyle.link} tabIndex={0}>
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
      <TooltipHost
        content={translateMessage('Add to collection')}
        id={tooltipId}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <IconButton
          ariaLabel={translateMessage('Add to collection')}
          role='button'
          id={buttonId}
          aria-describedby={tooltipId}
          styles={iconButtonStyles}
          menuIconProps={{ iconName: 'BoxAdditionSolid' }}
          onClick={() => props.resourceOptionSelected(ResourceOptions.ADD_TO_COLLECTION, resourceLink)}
        />
      </TooltipHost>


      {resourceLink.method &&
        <TooltipHost
          content={resourceLink.docLink ? translateMessage('Read documentation')
            : translateMessage('Query documentation not found')}
          id={documentButtonTooltip}
          calloutProps={{ gapSpace: 0, target: `#${documentButton}` }}
          styles={hostStyles}
        >
          <IconButton
            aria-label={translateMessage('Read documentation')}
            role='button'
            id={documentButton}
            disabled={!resourceLink.docLink}
            aria-describedby={documentButtonTooltip}
            styles={iconButtonStyles}
            onClick={() => openDocumentationLink()}
            menuIconProps={{ iconName: 'TextDocument' }}
          />
        </TooltipHost>
      }
    </div>
    &nbsp;
  </span>
}


export default ResourceLink;
