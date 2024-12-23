import {INavLink} from '@fluentui/react';

import {makeStyles, Tooltip, Button, Badge } from '@fluentui/react-components'
import { SubtractSquare20Regular, AddSquare20Regular, DocumentText20Regular } from '@fluentui/react-icons';
import { useEffect } from 'react';

import { useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IResourceLink, ResourceOptions } from '../../../../types/resources';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { translateMessage } from '../../../utils/translate-messages';
import { existsInCollection, setExisting } from './resourcelink.utils';

interface IResourceLinkProps {
  link: INavLink;
  resourceOptionSelected: Function;
  classes: any;
  version: string;
}

type Colors = 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning'

const useStyles = makeStyles({
  link: {
    display: 'flex',
    lineHeight: 'normal',
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  resourceLinkNameContainer: {
    textAlign: 'left',
    flex: '1',
    overflow: 'hidden',
    display: 'flex',
    marginTop: '4px',
    paddingLeft: '4px'
  },
  resourceLinkText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginTop: '6px'
  },
  badge: {
    maxWidth: '50px'
  }
});

const useIconButtonStyles = makeStyles({
  root: {
    marginRight: '1px'
  }
});

const ResourceLink = (props: IResourceLinkProps) => {
  const { version } = props;
  const { collections } = useAppSelector(state => state.collections);
  const link = props.link as IResourceLink;
  const paths = collections?.find(k => k.isDefault)?.paths || [];
  const resourceLink = { ...link };

  useEffect(() => {
    setExisting(resourceLink, existsInCollection(link, paths, version));
  }, [paths])

  const colors: Record<string, Colors> = {
    'GET': 'brand',
    'POST': 'success',
    'PATCH': 'severe',
    'DELETE': 'danger',
    'PUT': 'warning'
  }

  const linkStyles = useStyles();
  const iconButtonStyles = useIconButtonStyles();

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

  setExisting(resourceLink, existsInCollection(link, paths, version));

  const handleAddToCollectionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    props.resourceOptionSelected(ResourceOptions.ADD_TO_COLLECTION, link);
  }

  const handleRemoveFromCollectionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    props.resourceOptionSelected(ResourceOptions.REMOVE_FROM_COLLECTION, link);
  }

  return <span className={linkStyles.link} tabIndex={0}>
    {resourceLink.method ?
      <span className={linkStyles.resourceLinkNameContainer}>
        <Badge
          className={linkStyles.badge}
          size='medium'
          color={colors[resourceLink.method]}
          aria-label={'http method ' + resourceLink.method + ' for'}>
          {resourceLink.method}
        </Badge>
      </span>
      :
      <span className={linkStyles.resourceLinkNameContainer}>
        <span className={linkStyles.resourceLinkText}>
          {resourceLink.name}
        </span>
      </span>
    }

    {resourceLink.count && resourceLink.count > 0 ?
      <Badge appearance='tint' color='informative' aria-label={resourceLink.count + translateMessage('Resources')}>
        {resourceLink.count}
      </Badge> : ''}

    <div>
      {resourceLink.method &&
        <Tooltip
          withArrow
          content={resourceLink.docLink ? translateMessage('Read documentation')
            : translateMessage('Query documentation not found')}
          relationship='label'
        >
          <Button
            aria-label={translateMessage('Read documentation')}
            id='documentButton'
            aria-disabled={!resourceLink.docLink}
            className={iconButtonStyles.root}
            icon={<DocumentText20Regular />}
            onClick={() => openDocumentationLink()}
          />
        </Tooltip>
      }
      {resourceLink.isInCollection ?
        <Tooltip
          withArrow
          content={translateMessage('Remove from collection')}
          relationship='label'>
          <Button
            aria-label={translateMessage('Remove from collection')}
            id='removeCollectionButton'
            className={iconButtonStyles.root}
            icon={<SubtractSquare20Regular />}
            onClick={handleRemoveFromCollectionClick}
          />
        </Tooltip>:
        <Tooltip
          withArrow
          content={translateMessage('Add to collection')}
          relationship='label'
        >
          <Button
            aria-label={translateMessage('Add to collection')}
            id='targetButton'
            aria-describedby='tooltip'
            className={iconButtonStyles.root}
            icon={<AddSquare20Regular />}
            onClick={handleAddToCollectionClick}
          />
        </Tooltip>}
    </div>
      &nbsp;
  </span>
}

export default ResourceLink;