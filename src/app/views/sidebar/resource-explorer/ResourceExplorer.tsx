import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  getId,
  getTheme,
  IconButton,
  INavLink, INavLinkGroup, Label, Nav, PrimaryButton, SearchBox, Spinner, SpinnerSize,
  Stack,
  styled,
  Toggle,
  TooltipHost
} from '@fluentui/react';
import debouce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResource, IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../services/actions/collections-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getResourcesSupportedByVersion } from '../../../utils/resources/resources-filter';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import {
  createResourcesList, getResourcePaths,
  getUrlFromLink
} from './resource-explorer.utils';
import ResourceLink from './ResourceLink';
import { navStyles, resourceExplorerStyles } from './resources.styles';
import { UploadPostmanCollection } from './collection/UploadCollection';
import { usePopups } from '../../../services/hooks';

const UnstyledResourceExplorer = (props: any) => {
  const { resources: { data, pending }, collections } = useAppSelector(
    (state) => state
  );

  const dispatch: AppDispatch = useDispatch();
  const classes = classNames(props);
  const selectedLinks = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const versions: any[] = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' }
  ];

  const resourcesToUse = data.children ? JSON.parse(JSON.stringify(data.children)) : [] as IResource[];

  const [version, setVersion] = useState(versions[0].key);
  const [searchText, setSearchText] = useState<string>('');
  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const filteredPayload = getResourcesSupportedByVersion(resourcesToUse, version, searchText);
  const navigationGroup = createResourcesList(filteredPayload, version, searchText);
  const { show: previewCollection } = usePopups('preview-collection', 'panel');
  const resourcesStyles = resourceExplorerStyles(getTheme());


  const [items, setItems] = useState<INavLinkGroup[]>(navigationGroup);

  useEffect(() => {
    setItems(navigationGroup);
  }, [filteredPayload.length]);

  const deleteResourcesDialogProps = {
    type: DialogType.normal,
    title: translateMessage('Delete collection'),
    closeButtonAriaLabel: 'Close',
    subText: translateMessage('Do you want to remove all the items you have added to the collection?')
  };

  const openPreviewCollection = () => {
    previewCollection({
      settings: {
        title: translateMessage('Selected Resources') + ' ' + translateMessage('Preview'),
        width: 'xl'
      },
      data: {
        version
      }
    })
  }

  const removeAllResources = () => {
    dispatch(removeResourcePaths(selectedLinks));
    toggleIsDialogHidden();
  }

  const toggleIsDialogHidden = () => {
    setIsDialogHidden(!isDialogHidden);
  }

  const addToCollection = (item: IResourceLink) => {
    dispatch(addResourcePaths(getResourcePaths(item, version)));
  }

  const removeFromCollection = (item: IResourceLink) => {
    dispatch(removeResourcePaths(getResourcePaths(item, version)));
  }

  const changeVersion = (_event: React.MouseEvent<HTMLElement>, checked?: boolean | undefined): void => {
    const selectedVersion = checked ? versions[1].key : versions[0].key;
    setVersion(selectedVersion);
  }

  const changeSearchValue = (event: any, value?: string) => {
    const trimmedSearchText = value ? value.trim() : '';
    setSearchText(trimmedSearchText);
  }

  const debouncedSearch = useMemo(() => {
    return debouce(changeSearchValue, 300);
  }, []);


  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev!.preventDefault();
    item!.isExpanded = !item!.isExpanded;
    setQuery(item!);
  }

  const resourceOptionSelected = (activity: string, context: any) => {
    if (activity === ResourceOptions.ADD_TO_COLLECTION) {
      addToCollection(context);
    }

    if (activity === ResourceOptions.REMOVE_FROM_COLLECTION) {
      removeFromCollection(context);
    }
  }

  const setQuery = (resourceLink: INavLink) => {
    const link = resourceLink as IResourceLink;
    if (resourceLink.type === ResourceLinkType.NODE) { return; }
    const resourceUrl = getUrlFromLink(link.paths);
    if (!resourceUrl) { return; }
    const sampleUrl = `${GRAPH_URL}/${version}${resourceUrl}`;
    const verb = resourceLink.method!;
    const query: IQuery = {
      selectedVerb: verb.toString().toUpperCase(),
      selectedVersion: version,
      sampleUrl,
      sampleHeaders: [],
      sampleBody: undefined
    };
    dispatch(setSampleQuery(query));
    telemetry.trackEvent(eventTypes.LISTITEM_CLICK_EVENT, {
      ComponentName: componentNames.RESOURCES_LIST_ITEM,
      ResourceLink: resourceUrl,
      SelectedVersion: version
    });
  }

  if (pending) {
    return (
      <Spinner
        className={classes.spinner}
        size={SpinnerSize.large}
        label={`${translateMessage('loading resources')} ...`}
        ariaLive='assertive'
        labelPosition='top'
      />
    );
  }

  return (
    <section style={{ marginTop: '8px' }}>
      <Label styles = {{root: { marginBottom: '10px'}}}>
        <FormattedMessage id='Microsoft Graph OpenAPI explorer' />
      </Label>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={debouncedSearch}
        styles={searchBoxStyles}
      />
      <hr />
      <Stack horizontal tokens={{ childrenGap: 13, padding: 10 }}>
        <Label styles={{root: {position: 'relative', top: '2px'}}} >
          {translateMessage('Switch to the beta APIs')}
        </Label>
        <Toggle
          onChange={changeVersion}
          inlineLabel
          styles={{root: {position: 'relative', top: '4px'}}}
        />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 10, padding: 10 }}>
        <Label>{translateMessage('Collection')}</Label>
        <TooltipHost
          content={translateMessage('Preview collection')}
        >
          <IconButton
            disabled={selectedLinks.length === 0}
            iconProps={{ iconName: 'View' }}
            onClick={() => openPreviewCollection()}
            styles={resourcesStyles.iconButtons}
          />
        </TooltipHost>
        <TooltipHost
          content={translateMessage('Upload collection')}
        >
          < UploadPostmanCollection />
        </TooltipHost>
        <TooltipHost
          content={translateMessage('Delete collection')}
        >
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            disabled={selectedLinks.length === 0}
            onClick={() => toggleIsDialogHidden()}
            styles={resourcesStyles.iconButtons}
          />
        </TooltipHost>
      </Stack>

      {items[0].links.length > 0 && <Label styles={{ root: { position: 'relative', left: '10px' } }}>
        <FormattedMessage id='Resources available' />
      </Label>
      }

      {
        items[0].links.length === 0 ? NoResultsFound('No resources found', { paddingBottom: '20px' }) :
          (<Nav
            groups={items}
            styles={navStyles}
            onRenderLink={link => {
              return <ResourceLink
                link={link!}
                version={version}
                resourceOptionSelected={(activity: string, context: unknown) =>
                  resourceOptionSelected(activity, context)}
                classes={classes}
              />
            }}
            onLinkClick={clickLink}
            className={classes.queryList} />
          )
      }
      <Dialog
        hidden={isDialogHidden}
        onDismiss={toggleIsDialogHidden}
        dialogContentProps={deleteResourcesDialogProps}
        modalProps={{
          titleAriaId: getId('dialogLabel'),
          subtitleAriaId: getId('subTextLabel'),
          isBlocking: false
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={removeAllResources} text={translateMessage('Yes')} />
          <DefaultButton onClick={toggleIsDialogHidden} text={translateMessage('Cancel')} />
        </DialogFooter>
      </Dialog>
    </section>
  );
}

// @ts-ignore
const ResourceExplorer = styled(UnstyledResourceExplorer, sidebarStyles);
export default ResourceExplorer;