import {
  Announced,
  ContextualMenuItemType, DefaultButton, DetailsList, DetailsRow, Dialog,
  DialogFooter, DialogType, getId, getTheme, IColumn, IconButton,
  IGroup,
  Label, MessageBar, MessageBarType, PrimaryButton, SearchBox, SelectionMode, styled, TooltipHost
} from '@fluentui/react';
import { useEffect, useRef, useState } from 'react';

import { historyCache } from '../../../../modules/cache/history-utils';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { SortOrder } from '../../../../types/enums';
import { Entry } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { IQuery } from '../../../../types/query-runner';
import { GRAPH_URL } from '../../../services/graph-constants';
import { runQuery, setQueryResponse } from '../../../services/slices/graph-response.slice';
import { removeAllHistoryItems, removeHistoryItem } from '../../../services/slices/history.slice';
import { setQueryResponseStatus } from '../../../services/slices/query-status.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { dynamicSort } from '../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import { createHarEntry, exportQuery, generateHar } from './har-utils';
import { ResourceLinkType } from '../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../services/slices/collections.slice';

const columns = [
  { key: 'button', name: '', fieldName: '', minWidth: 20, maxWidth: 20 },
  {
    key: 'status',
    name: '',
    fieldName: 'status',
    minWidth: 20,
    maxWidth: 50
  },
  { key: 'url', name: '', fieldName: 'url', minWidth: 100, maxWidth: 200 }
];

const formatDate = (date: any) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;
  let day = date.getDate();
  day = (day < 10 ? '0' : '') + day;
  return `${year}-${month}-${day}`;
};

const today = formatDate(new Date());
const yesterdaysDate = new Date();
const yesterday = formatDate(yesterdaysDate);
yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

const sortItems = (content: IHistoryItem[]) => {
  content.sort(dynamicSort<IHistoryItem>('createdAt', SortOrder.DESC));
  content.forEach((value: any, index: number) => {
    value.index = index;
  });
  return content;
}

const getCategory = (historyItem: IHistoryItem) => {
  const olderText = translateMessage('older');
  const todayText = translateMessage('today');
  const yesterdayText = translateMessage('yesterday');
  let category = olderText;
  if (historyItem.createdAt.includes(today)) {
    category = todayText;
  } else if (historyItem.createdAt.includes(yesterday)) {
    category = yesterdayText;
  }
  return category;
}

const getItems = (content: IHistoryItem[]): IHistoryItem[] => {
  const list: IHistoryItem[] = [];
  content.forEach((historyItem) => {
    list.push({
      ...historyItem,
      category: getCategory(historyItem)
    });
  });
  return sortItems(list);
}

const History = (props: any) => {
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state);
  const [historyItems, setHistoryItems] = useState<IHistoryItem[]>(history);
  const [hideDialog, setHideDialog] = useState(true);
  const [category, setCategory] = useState('');
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const {collections} = useAppSelector((state) => state.collections);

  const shouldGenerateGroups = useRef(true);

  const items = getItems(historyItems);

  useEffect(() => {
    if (shouldGenerateGroups.current) {
      setGroups(generateGroupsFromList(items, 'category'));
      if (groups && groups.length > 0) {
        shouldGenerateGroups.current = false;
      }
    }
  }, [historyItems, searchStarted])

  const classes = classNames(props);

  useEffect(() => {
    setHistoryItems(history);
  }, [history])

  if (!history || history.length === 0) {
    return NoResultsFound('We did not find any history items');
  }

  const isInCollection = (item: IHistoryItem) => {
    const defaultCollection = collections.find((collection) => collection.isDefault);
    if (!defaultCollection) { return false; }
    return defaultCollection.paths.some((path) => {
      const { relativeUrl } = processUrlAndVersion(item.url);
      return path.url === relativeUrl && path.method === item.method;
    });
  };

  const searchValueChanged = (_event: any, value?: string): void => {
    shouldGenerateGroups.current = true;
    setSearchStarted(searchStatus => !searchStatus);
    let content = [...history];
    if (value) {
      const keyword = value.toLowerCase();
      content = history.filter((sample: any) => {
        const name = sample.url.toLowerCase();
        return name.toLowerCase().includes(keyword);
      });
    }
    setHistoryItems(content);
  }

  const renderRow = (row: any): any => {
    return (
      <div className={classes.groupHeader}>
        <DetailsRow
          {...row}
          className={classes.queryRow}
          onClick={() => onViewQueryListItem(row.item)}
        />
      </div>
    );
  };


  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const currentTheme = getTheme();

    const actionsText = translateMessage('actions');
    const runQueryText = translateMessage('Run Query');
    const viewText = translateMessage('view');
    const removeText = translateMessage('Delete');
    const exportQueryText = translateMessage('Export');
    const inCollection = isInCollection(item);

    if (column) {
      const queryContent = item[column.fieldName as keyof any] as string;
      let color = currentTheme.palette.green;
      if (item.status > 300) {
        color = currentTheme.palette.red;
      }

      switch (column.key) {
      case 'status':
        return (
          <span style={{ color }} className={classes.badge}>
            {item.status}
          </span>
        );

      case 'button':
        const buttonActions = [
          {
            key: 'actions',
            itemType: ContextualMenuItemType.Header,
            text: actionsText
          },
          {
            key: 'view',
            text: viewText,
            iconProps: {
              iconName: 'View'
            },
            onClick: () => onViewQueryButton(item)
          },
          {
            key: 'runQuery',
            text: runQueryText,
            iconProps: {
              iconName: 'Refresh'
            },
            onClick: () => onRunQuery(item)
          },
          {
            key: 'exportQuery',
            text: exportQueryText,
            iconProps: {
              iconName: 'Download'
            },
            onClick: () => onExportQuery(item)
          },
          ...(inCollection
            ? [
              {
                key: 'removeFromCollection',
                text: translateMessage('Remove from Collection'),
                iconProps: { iconName: 'BoxSubtractSolid' },
                onClick: () => handleRemoveFromCollection(item)
              }
            ]
            : [
              {
                key: 'addToCollection',
                text: translateMessage('Add to Collection'),
                iconProps: { iconName: 'BoxAdditionSolid' },
                onClick: () => handleAddToCollection(item)
              }
            ]),
          {
            key: 'remove',
            text: removeText,
            iconProps: {
              iconName: 'Delete'
            },
            onClick: () => deleteQuery(item)
          }
        ];

        return (
          <TooltipHost
            content={translateMessage('Actions')}
            id={getId()}
            calloutProps={{ gapSpace: 0 }}
            styles={{ root: { display: 'inline-block' } }}>
            <IconButton
              className={classes.docLink}
              ariaLabel={translateMessage('Actions menu')}
              menuIconProps={{ iconName: 'More' }}
              menuProps={{
                shouldFocusOnMount: true,
                items: buttonActions
              }}
              styles={{ root: { paddingBottom: 10, marginLeft: 1 } }}
            />
          </TooltipHost>
        );

      default:
        const shortQueryContent = queryContent.replace(GRAPH_URL, '');
        return (
          <>
            <TooltipHost
              content={`${item.method} - ${queryContent}`}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <span
                aria-label={`${shortQueryContent}. ${translateMessage('Navigation help')}`}
                className={classes.queryContent}
              >
                {shortQueryContent}
              </span>
            </TooltipHost>
          </>
        );
      }
    }
  };

  const onToggleCollapse = (properties: any) => {
    return () => {
      properties.onToggleCollapse(properties.group);
    };
  }

  const renderGroupHeader = (properties: any): any => {
    const expandText = translateMessage('Expand');
    const collapseText = translateMessage('Collapse');
    const groupName: string = properties.group!.name;
    const groupCount: string = properties.group!.count;
    const collapseButtonLabel: string = properties.group!.isCollapsed ? `${expandText} ${groupName}`
      : `${collapseText} ${groupName}`;

    return (
      <div
        aria-label={`${groupName} has ${groupCount} items`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: 10
        }}
      >
        <div className={'col-md-8'}>
          <div
            className={classes.groupHeaderRow}
            onClick={onToggleCollapse(properties)}
          >
            <TooltipHost
              content={collapseButtonLabel}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}>
              <IconButton
                className={`${classes.pullLeft} ${classes.groupHeaderRowIcon}`}
                iconProps={{
                  iconName: properties.group!.isCollapsed
                    ? 'ChevronRightSmall'
                    : 'ChevronDownSmall'
                }}
                ariaLabel={collapseButtonLabel}
                onClick={() => onToggleCollapse(properties)}
                styles={{ icon: { marginTop: '15px' } }}
              />
            </TooltipHost>
            <div className={classes.groupTitle}>
              <span>{groupName}</span>
              <span className={classes.headerCount}>
                ({groupCount})
              </span>
            </div>
          </div>
        </div>
        <div className={'col-md-4'} style={{ display: 'inline-block' }}>
          <div className={`${classes.pullRight}`}>
            <TooltipHost
              content={`${translateMessage('Export')} ${groupName} queries`}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}>
              <IconButton
                className={`${classes.groupHeaderRowIcon}`}
                iconProps={{ iconName: 'Download' }}
                ariaLabel={`${translateMessage('Export')} ${groupName} queries`}
                onClick={() => exportHistoryByCategory(groupName)}
              />
            </TooltipHost>
            <TooltipHost
              content={`${translateMessage('Delete')} ${groupName} queries`}
              id={getId()}
              calloutProps={{ gapSpace: 0 }} >
              <IconButton
                className={`${classes.groupHeaderRowIcon}`}
                iconProps={{ iconName: 'Delete' }}
                ariaLabel={`${translateMessage('Delete')} ${groupName} queries`}
                onClick={() => showDialog(groupName)}
              />
            </TooltipHost>
          </div>
        </div>
      </div>
    );
  };


  const showDialog = (value: string): void => {
    setCategory(value);
    setHideDialog(false);
  };

  const closeDialog = (): void => {
    setCategory('');
    setHideDialog(true);
  };

  const deleteHistoryCategory = (): void => {
    const itemsToDelete = historyItems.filter((query: IHistoryItem) => getCategory(query) === category);
    const listOfKeys: string[] = [];
    itemsToDelete.forEach(historyItem => {
      listOfKeys.push(historyItem.createdAt);
    });
    historyCache.bulkRemoveHistoryData(listOfKeys)
    dispatch(removeAllHistoryItems(listOfKeys));
    closeDialog();
  };

  const exportHistoryByCategory = (value: string) => {
    const itemsToExport = historyItems.filter((query: IHistoryItem) => getCategory(query) === value);
    const entries: Entry[] = [];

    itemsToExport.forEach((query: IHistoryItem) => {
      const harPayload = createHarEntry(query);
      entries.push(harPayload);
    });

    const generatedHarData = generateHar(entries);
    const { origin } = new URL(itemsToExport[0].url);
    const exportTitle = `${origin}/${category.toLowerCase()}/${itemsToExport[0].createdAt.substr(0, 10)}/`;

    exportQuery(generatedHarData, exportTitle);
  };

  const renderDetailsHeader = () => {
    return <div />;
  }

  const onRunQuery = (query: IHistoryItem) => {
    const { sampleUrl, queryVersion } = parseSampleUrl(query.url);
    const sampleQuery: IQuery = {
      sampleUrl,
      selectedVerb: query.method,
      sampleBody: query.body,
      sampleHeaders: query.headers,
      selectedVersion: queryVersion
    };

    if (sampleQuery.selectedVerb === 'GET') {
      sampleQuery.sampleBody = JSON.parse('{}');
    }
    dispatch(setSampleQuery(sampleQuery));
    dispatch(runQuery(sampleQuery));

    trackHistoryItemEvent(
      eventTypes.BUTTON_CLICK_EVENT,
      componentNames.RUN_HISTORY_ITEM_BUTTON,
      query
    );
  };

  const onExportQuery = (query: IHistoryItem) => {
    const harPayload = createHarEntry(query);
    const generatedHarData = generateHar([harPayload]);
    exportQuery(generatedHarData, `${query.url}/`);
    trackHistoryItemEvent(
      eventTypes.BUTTON_CLICK_EVENT,
      componentNames.EXPORT_HISTORY_ITEM_BUTTON,
      query
    );
  };

  const deleteQuery = async (query: IHistoryItem) => {

    delete query.category;
    historyCache.removeHistoryData(query);
    dispatch(removeHistoryItem(query));
    trackHistoryItemEvent(
      eventTypes.BUTTON_CLICK_EVENT,
      componentNames.DELETE_HISTORY_ITEM_BUTTON,
      query
    );
  };

  const onViewQueryButton = (query: IHistoryItem) => {
    onViewQuery(query);
    trackHistoryItemEvent(
      eventTypes.BUTTON_CLICK_EVENT,
      componentNames.VIEW_HISTORY_ITEM_BUTTON,
      query
    );
  };

  const onViewQueryListItem = (query: IHistoryItem) => {
    onViewQuery(query);
    trackHistoryItemEvent(
      eventTypes.LISTITEM_CLICK_EVENT,
      componentNames.HISTORY_LIST_ITEM,
      query
    );
  };

  const onViewQuery = (query: IHistoryItem) => {
    const { sampleUrl, queryVersion } = parseSampleUrl(query.url);
    const sampleQuery: IQuery = {
      sampleUrl,
      selectedVerb: query.method,
      sampleBody: query.body,
      sampleHeaders: query.headers,
      selectedVersion: queryVersion
    };
    const { duration, status, statusText } = query;
    dispatch(setSampleQuery(sampleQuery));
    dispatch(setQueryResponse({
      body: query.result,
      headers: query.responseHeaders
    }))
    dispatch(setQueryResponseStatus({
      duration,
      messageBarType: status < 300 ? 'success' : 'error',
      ok: status < 300,
      status,
      statusText
    }));
  };

  const trackHistoryItemEvent = (eventName: string, componentName: string, query: IHistoryItem) => {
    const sanitizedUrl = sanitizeQueryUrl(query.url);
    telemetry.trackEvent(
      eventName,
      {
        ComponentName: componentName,
        ItemIndex: query.index,
        QuerySignature: `${query.method} ${sanitizedUrl}`
      });
  };

  const processUrlAndVersion = (url: string) => {
    let version = 'v1.0';
    if (url.includes('graph.microsoft.com/beta')) {
      version = 'beta';
      url = url.replace('https://graph.microsoft.com/beta', '');
    } else {
      url = url.replace('https://graph.microsoft.com/v1.0', '');
    }
    return { relativeUrl: url, version };
  };
  const formatHistoryItem = (item: IHistoryItem) => {
    const { relativeUrl, version } = processUrlAndVersion(item.url);
    const pathSegments = relativeUrl.split('/').filter(Boolean);
    const name = pathSegments[pathSegments.length - 1] || relativeUrl;

    return {
      paths: pathSegments,
      name,
      type: ResourceLinkType.PATH,
      version,
      method: item.method,
      url: relativeUrl,
      key: `${item.index}-${item.url}`
    };
  };

  const handleAddToCollection = (item: IHistoryItem) => {
    const resourcePath = formatHistoryItem(item);
    dispatch(addResourcePaths([resourcePath]));
  };

  const handleRemoveFromCollection = (item: IHistoryItem) => {
    const resourcePath = formatHistoryItem(item);
    dispatch(removeResourcePaths([resourcePath]));
  };


  return (
    <>
      <div>
        <SearchBox
          placeholder={translateMessage('Search history items')}
          className={classes.searchBox}
          onChange={searchValueChanged}
          styles={searchBoxStyles}
        />
        <hr />
        <MessageBar
          messageBarType={MessageBarType.info}
          isMultiline={true}
          dismissButtonAriaLabel='Close'
        >
          {translateMessage('Your history includes queries made in the last 30 days')}
          .
        </MessageBar>
        {items.length === 0 && <Label className={classes.spinner}>
          {translateMessage('We did not find any history items')}
        </Label>}
        <Announced
          message={`${items.length} search results available.`}
        />
        {items.length > 0 && <DetailsList
          className={classes.queryList}
          onRenderItemColumn={renderItemColumn}
          items={items}
          columns={columns}
          selectionMode={SelectionMode.none}
          groups={groups}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: renderGroupHeader
          }}
          onRenderRow={renderRow}
          onRenderDetailsHeader={renderDetailsHeader}
        />
        }
      </div>
      <Dialog
        hidden={hideDialog}
        onDismiss={closeDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: `${translateMessage('Delete requests')} : ${category}`,
          closeButtonAriaLabel: 'Close',
          subText: `${translateMessage('Are you sure you want to delete these requests?')}`
        }}
        modalProps={{
          titleAriaId: getId(),
          subtitleAriaId: getId(),
          isBlocking: false,
          styles: { main: { maxWidth: 450 } }
        }}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={deleteHistoryCategory}
            text={translateMessage('Delete')}
          />
          <DefaultButton onClick={closeDialog} text={translateMessage('Cancel')} />
        </DialogFooter>
      </Dialog>
    </>
  );
}

const trackedComponent = telemetry.trackReactComponent(History, componentNames.HISTORY_TAB);
// @ts-ignore
const styledHistory = styled(trackedComponent, sidebarStyles);
export default styledHistory;
