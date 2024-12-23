import {
  INavLink, INavLinkGroup,
  Nav} from '@fluentui/react';

import { Button, SearchBox, Spinner, Switch, Label, makeStyles } from '@fluentui/react-components'
import { StackShim, StackItemShim } from '@fluentui/react-migration-v8-v9';
import { Collections20Regular } from '@fluentui/react-icons';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../services/slices/collections.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { GRAPH_URL } from '../../../services/graph-constants';
import { searchResources } from '../../../utils/resources/resources-filter';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames'
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { createResourcesList, getResourcePaths, getUrlFromLink } from './resource-explorer.utils';
import ResourceLink from './ResourceLinkV9';
import { usePopups } from '../../../services/hooks/usePopups';


const useResourceExplorerStyles = makeStyles({
  apiCollectionButton: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'var(--color-neutral-white)',
    textAlign: 'left',
    height: '40px',
    marginTop: '10px',
    '& .label': {
      marginLeft: '8px',
      fontWeight: 'bold',
      color: 'var(--color-neutral-primary)',
      fontSize: '14px'
    }
  },
  apiCollectionCount: {
    fontSize: '14px',
    color: 'var(--color-black)'
  }
});

const useNavStyles = makeStyles({
  chevronIcon: {
    transform: 'rotate(0deg)',
    position: 'relative',
    '&.collapsed': {
      transform: 'rotate(-90deg)'
    }
  },
  chevronButton: {
    '&::after': {
      border: 'none !important',
      borderLeft: '0px !important'
    }
  },
  link: {
    '&::after': {
      border: 'none !important',
      borderLeft: '0px !important'
    }
  }
});

const useSearchBoxStyles = makeStyles({
  root: {
    width: '100%'
  },
  field: {
    paddingLeft: '10px',
    '&:focus': {
      outline: 'none !important'
    }
  }
});

const useSpinnerStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: '100px',
    justifyContent: 'center',
    alignItems: 'center'
  }});

const ResourceExplorer = (props: any) => {
  const { data, pending } = useAppSelector((state) => state.resources);
  const { collections } = useAppSelector((state) => state.collections);

  const navStyles = useNavStyles();
  const resourceExplorerStyles = useResourceExplorerStyles();
  const searchBoxStyles = useSearchBoxStyles();
  const spinnerStyles = useSpinnerStyles();

  const dispatch: AppDispatch = useAppDispatch();
  const classes = classNames(props);
  const selectedLinks = collections  && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const versions: { key: string, text: string }[] = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' }
  ];

  const [version, setVersion] = useState<string>(versions[0].key);
  const resourcesToUse = data?.[version]?.children
      && Object.keys(data[version]).length > 0
    ? data[version].children
    : [];
  const [searchText, setSearchText] = useState<string>('');
  const filteredPayload = searchText ? searchResources(resourcesToUse, searchText) : resourcesToUse;
  const navigationGroup = createResourcesList(filteredPayload, version, searchText);
  const [items, setItems] = useState<INavLinkGroup[]>(navigationGroup);
  const { show: previewCollection } = usePopups('preview-collection', 'panel');

  useEffect(() => {
    setItems(navigationGroup);
  }, [filteredPayload.length]);

  const addToCollection = (item: IResourceLink) => {
    dispatch(addResourcePaths(getResourcePaths(item, version)));
  }

  const removeFromCollection = (item: IResourceLink) => {
    dispatch(removeResourcePaths(getResourcePaths(item, version)));
  }

  const changeVersion = (_event: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean }): void => {
    const selectedVersion = data.checked ? versions[1].key : versions[0].key;
    setVersion(selectedVersion);
  }

  const changeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedSearchText = event.target.value.trim();
    setSearchText(trimmedSearchText);
  }

  const debouncedSearch = useMemo(() => {
    return debounce((event: React.ChangeEvent<HTMLInputElement>) => changeSearchValue(event), 300);
  }, []);


  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
      ev!.preventDefault();
      item!.isExpanded = !item!.isExpanded;
      setQuery(item!);
  }

  const resourceOptionSelected = (activity: string, context: IResourceLink) => {
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

  const openPreviewCollection = () => {
    previewCollection({
      settings: {
        title: translateMessage('My API collection'),
        width: 'xl'
      }
    })
  }

  if (pending) {
    return (
      <Spinner
        className={spinnerStyles.root}
        size='large'
        label={`${translateMessage('loading resources')} ...`}
        labelPosition="before"
      />
    );
  }

  return (
    <section style={{ marginTop: '8px' }}>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={(event) => debouncedSearch(event as React.ChangeEvent<HTMLInputElement>)}
        className={searchBoxStyles.root}
      />
      <Button onClick={openPreviewCollection}
        icon={<Collections20Regular />}
        aria-label={translateMessage('My API Collection')}
        className={resourceExplorerStyles.apiCollectionButton}
      >
        {translateMessage('My API Collection')}
        <StackShim horizontal reversed verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <StackItemShim align='auto'>
            <div className={resourceExplorerStyles.apiCollectionCount}>
              {selectedLinks.length > 0 ? `(${selectedLinks.length})` : ''}
            </div>
          </StackItemShim>
        </StackShim>
      </Button>
      <StackShim horizontal tokens={{ childrenGap: 10, padding: 10 }} horizontalAlign='space-between'>
        <Label style={{ position: 'relative' }}>
          {translateMessage('Resources available')}
        </Label>
        <StackShim horizontal tokens={{ childrenGap: 10 }}>
          <Switch
            onChange={changeVersion}
            labelPosition='after'
            style={{ position: 'relative', top: '2px' }}
          />
          <Label style={{ position: 'relative', top: '2px' }} >
            {translateMessage('Switch to beta')}
          </Label>
        </StackShim>
      </StackShim>
      {
        items[0].links.length === 0 ? NoResultsFound('No resources found', { paddingBottom: '20px' }) :
        // Nav v9 currently in preview, migrate after v9 version is released
          (<Nav
            groups={items}
            styles={navStyles}
            onRenderLink={link => {
              return <ResourceLink
                link={link!}
                version={version}
                resourceOptionSelected={(activity: string, context: IResourceLink) =>
                  resourceOptionSelected(activity, context)}
                classes={classes}
              />
            }}
            onLinkClick={clickLink}
            className={classes.queryList} />
          )
      }
    </section>
  );
}

export default ResourceExplorer;