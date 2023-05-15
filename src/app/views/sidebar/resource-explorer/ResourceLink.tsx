import {
  getId, getTheme, IconButton, INavLink,
  ITooltipHostStyles, mergeStyleSets, TooltipHost
} from '@fluentui/react';
import { CSSProperties, useEffect } from 'react';

import { useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IResourceLink, ResourceOptions } from '../../../../types/resources';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { translateMessage } from '../../../utils/translate-messages';
import { existsInCollection, setExisting } from './resourcelink.utils';

interface IResourceLinkProps {
  link: INavLink;
  resourceOptionSelected: Function;
  classes: any;
  version: string;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const { classes, version } = props;
  const { collections } = useAppSelector(state => state);
  const link = props.link as IResourceLink;

  const paths = collections?.find(k => k.isDefault)?.paths || [];
  const resourceLink = { ...link };

  useEffect(() => {
    setExisting(resourceLink, existsInCollection(link, paths, version));
  }, [paths])

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
  const removeCollectionButton = getId('removeCollectionButton');
  const removeCollectionButtonTooltip = getId('removeCollectionButtonTooltip');

  const iconButtonStyles = {
    root: { marginRight: 1, zIndex: 10 },
    menuIcon: { fontSize: 16, padding: 5 }
  };

  const methodButtonStyles: CSSProperties = {
    background: getStyleFor(resourceLink.method!),
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

  setExisting(resourceLink, existsInCollection(link, paths, version));

  const handleAddToCollectionClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    props.resourceOptionSelected(ResourceOptions.ADD_TO_COLLECTION, link);
  }

  const handleRemoveFromCollectionClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    props.resourceOptionSelected(ResourceOptions.REMOVE_FROM_COLLECTION, link);
  }

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
      {resourceLink.isInCollection ? <TooltipHost
        content={translateMessage('Remove from collection')}
        id={removeCollectionButtonTooltip}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <IconButton
          ariaLabel={translateMessage('Remove from collection')}
          role='button'
          id={removeCollectionButton}
          aria-describedby={removeCollectionButtonTooltip}
          styles={iconButtonStyles}
          menuIconProps={{ iconName: 'BoxSubtractSolid' }}
          onClick={handleRemoveFromCollectionClick}
        />
      </TooltipHost> :
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
            onClick={handleAddToCollectionClick}
          />
        </TooltipHost>}

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
