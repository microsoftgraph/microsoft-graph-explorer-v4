import { Tooltip, Button, Badge, Link } from '@fluentui/react-components'
import { SubtractSquare20Regular, AddSquare20Regular, DocumentText20Regular } from '@fluentui/react-icons';
import { useMemo } from 'react';

import { useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IResourceLink, ResourceOptions } from '../../../../types/resources';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { translateMessage } from '../../../utils/translate-messages';
import { existsInCollection, setExisting } from './resourcelink.utils';
import { useStyles } from './resourceLinkStyles';
import { METHOD_COLORS } from '../sidebar-utils/SidebarUtils';

interface IResourceLinkProps {
  link: IResourceLink;
  resourceOptionSelected: Function;
  version: string;
}

const ResourceLink = (props: IResourceLinkProps) => {
  const { version } = props;
  const { collections } = useAppSelector(state => state.collections);
  const link = props.link as IResourceLink;
  const paths = collections?.find(k => k.isDefault)?.paths || [];
  const resourceLink = { ...link };

  const isInCollection = useMemo(() => {
    return existsInCollection(resourceLink, paths, version);
  }, [resourceLink, paths, version]);


  const linkStyles = useStyles();

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

  return (
    <div className={linkStyles.link}>
      <ResourceLinkNameContainer resourceLink={resourceLink} linkStyles={linkStyles} />
      {resourceLink.method && (
        <ResourceLinkActions
          resourceLink={{ ...resourceLink, isInCollection}}
          iconButtonStyles={linkStyles}
          openDocumentationLink={openDocumentationLink}
          handleAddToCollectionClick={handleAddToCollectionClick}
          handleRemoveFromCollectionClick={handleRemoveFromCollectionClick}
        />
      )}
    </div>
  );
}

const ResourceLinkNameContainer = ({
  resourceLink,
  linkStyles
}: {
  resourceLink: IResourceLink,
  linkStyles: any
}) => (
  resourceLink.method ? (
    <span className={linkStyles.resourceLinkNameContainer}>
      <Badge
        className={linkStyles.badge}
        size='medium'
        color={METHOD_COLORS[resourceLink.method]}
        aria-label={'http method ' + resourceLink.method + ' for'}>
        {resourceLink.method}
      </Badge>
    </span>
  ) : (
    <span className={linkStyles.resourceLinkNameContainer}>
      <span className={linkStyles.resourceLinkText}>
        {resourceLink.name}
      </span>
    </span>
  )
);

const ResourceLinkActions = ({
  resourceLink,
  iconButtonStyles,
  openDocumentationLink,
  handleAddToCollectionClick,
  handleRemoveFromCollectionClick
}: {
  resourceLink: IResourceLink,
  iconButtonStyles: any,
  openDocumentationLink: () => void,
  handleAddToCollectionClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  handleRemoveFromCollectionClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}) => (
  <div className='actions'>
    {resourceLink.method && (
      <Tooltip
        withArrow
        content={
          resourceLink.docLink? translateMessage('Read documentation')
            : translateMessage('Query documentation not found')
        }
        relationship='label'
      >
        {resourceLink.docLink ? (
          <Link
            aria-label={translateMessage('Read documentation')}
            appearance='subtle'
            className={iconButtonStyles.linkIcon}
            target='_blank' href={resourceLink.docLink}
            onClick={() => openDocumentationLink()}>
            <DocumentText20Regular /></Link>) :
          <Link
            disabled
            aria-label={translateMessage('Read documentation')}
            appearance='subtle'
            aria-disabled
            className={iconButtonStyles.linkIcon}>
            <DocumentText20Regular /></Link>}
      </Tooltip>
    )}
    {resourceLink.isInCollection ? (
      <Tooltip
        withArrow
        content={translateMessage('Remove from collection')}
        relationship='label'>
        <Button
          aria-label={translateMessage('Remove from collection')}
          id='removeCollectionButton'
          appearance='transparent'
          className={iconButtonStyles.root}
          icon={<SubtractSquare20Regular />}
          onClick={handleRemoveFromCollectionClick}
        />
      </Tooltip>
    ) : (
      <Tooltip
        withArrow
        content={translateMessage('Add to collection')}
        relationship='label'
      >
        <Button
          aria-label={translateMessage('Add to collection')}
          id='targetButton'
          appearance='transparent'
          aria-describedby='tooltip'
          className={iconButtonStyles.root}
          icon={<AddSquare20Regular />}
          onClick={handleAddToCollectionClick}
        />
      </Tooltip>
    )}
  </div>
);
export default ResourceLink;