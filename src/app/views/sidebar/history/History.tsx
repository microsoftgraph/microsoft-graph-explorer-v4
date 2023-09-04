import {
  Announced,
  ContextualMenuItemType, DefaultButton, DetailsList, DetailsRow, Dialog,
  DialogFooter, DialogType, getId, getTheme, IColumn, IconButton,
  IDetailsGroupDividerProps,
  IDetailsRowProps,
  IGroup,
  Label, mergeStyles, MessageBar, MessageBarType, PrimaryButton, SearchBox, SelectionMode, styled, TooltipHost
} from '@fluentui/react';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { SortOrder } from '../../../../types/enums';
import { Entry } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { IQuery } from '../../../../types/query-runner';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { setQueryResponseStatus } from '../../../services/actions/query-status-action-creator';
import {
  bulkRemoveHistoryItems, removeHistoryItem, viewHistoryItem
} from '../../../services/actions/request-history-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { dynamicSort } from '../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import { createHarEntry, exportQuery, generateHar } from './har-utils';

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

const formatDate = (date: Date): string => {
  const year = date.getFullYear();

  const month = date.getMonth() + 1;
  const monthVal = (month < 10 ? '0' : '') + month;

  const day = date.getDate();
  const dayVal = (day < 10 ? '0' : '') + day;

  return `${year}-${monthVal}-${dayVal}`;
};

const sortItems = (content: IHistoryItem[]) => {
  content.sort(dynamicSort('createdAt', SortOrder.DESC));
  content.forEach((value: IHistoryItem, index: number) => {
    value.index = index;
  });
  return content;
}

const getItems = (content: IHistoryItem[]) => {
  const list: IHistoryItem[] = [];
  const olderText = translateMessage('older');
  const todayText = translateMessage('today');
  const yesterdayText = translateMessage('yesterday');

  let date = olderText;
  const today = formatDate(new Date());
  const yesterdaysDate = new Date();
  yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
  const yesterday = formatDate(yesterdaysDate);

  content.forEach((element: IHistoryItem) => {
    if (element.createdAt.includes(today)) {
      date = todayText;
    } else if (element.createdAt.includes(yesterday)) {
      date = yesterdayText;
    }
    element.category = date;
    list.push(element);
  });
  return sortItems(list);
}

const History = () => {
  const dispatch: AppDispatch = useDispatch();
  const { history } = useAppSelector((state) => state);
  const [historyItems, setHistoryItems] = useState<IHistoryItem[]>(history);
  const [hideDialog, setHideDialog] = useState(true);
  const [category, setCategory] = useState('');
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const theme = getTheme();

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

  const groupHeaderClass = mergeStyles(sidebarStyles(theme).groupHeader);
  const queryRowClass = mergeStyles(sidebarStyles(theme).queryRow);
  const badgeClass = mergeStyles(sidebarStyles(theme).badge);
  const docLinkClass = mergeStyles(sidebarStyles(theme).docLink);
  const queryContentClass = mergeStyles(sidebarStyles(theme).queryContent);
  const groupHeaderRowClass = mergeStyles(sidebarStyles(theme).groupHeaderRow);
  const groupHeaderRowIconClass = mergeStyles(sidebarStyles(theme).groupHeaderRowIcon);
  const pullLeftClass = mergeStyles(sidebarStyles(theme).pullLeft);
  const pullRightClass = mergeStyles(sidebarStyles(theme).pullRight);
  const headerCountClass = mergeStyles(sidebarStyles(theme).headerCount);
  const groupTitleClass = mergeStyles(sidebarStyles(theme).groupTitle);
  const searchBoxClass = mergeStyles(sidebarStyles(theme).searchBox);
  const spinnerClass = mergeStyles(sidebarStyles(theme).spinner);
  const queryListClass = mergeStyles(sidebarStyles(theme).queryList);

  useEffect(() => {
    setHistoryItems(history);
  }, [history])

  if (!history || history.length === 0) {
    return NoResultsFound('We did not find any history items');
  }

  const searchValueChanged = (value?: string): void => {
    shouldGenerateGroups.current = true;
    setSearchStarted(searchStatus => !searchStatus);
    let content = [...history];
    if (value) {
      const keyword = value.toLowerCase();
      content = history.filter((sample: IHistoryItem) => {
        const name = sample.url.toLowerCase();
        return name.toLowerCase().includes(keyword);
      });
    }
    setHistoryItems(content);
  }

  const renderRow = (row?: IDetailsRowProps): JSX.Element | null => {
    if (!row) {
      return null;
    }
    return (
      <div className={groupHeaderClass}
        onClick={() => onViewQueryListItem(row.item)}
      >
        <DetailsRow
          {...row}
          className={queryRowClass}
        />
      </div>
    );
  };

  const renderItemColumn = (item: IHistoryItem, index: number | undefined, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const currentTheme = getTheme();

    const actionsText = translateMessage('actions');
    const runQueryText = translateMessage('Run Query');
    const viewText = translateMessage('view');
    const removeText = translateMessage('Delete');
    const exportQueryText = translateMessage('Export');

    if (column) {
      const queryContent = item[column.fieldName as keyof IHistoryItem] as string;
      let color = currentTheme.palette.green;
      if (item.status > 300) {
        color = currentTheme.palette.red;
      }

      switch (column.key) {
        case 'status':
          return (
            <span style={{ color }} className={badgeClass}>
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
                className={docLinkClass}
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
                  className={queryContentClass}
                >
                  {shortQueryContent}
                </span>
              </TooltipHost>
            </>
          );
      }
    }
  };

  const onToggleCollapse = (properties: IDetailsGroupDividerProps) => {
    return () => {
      properties.onToggleCollapse!(properties?.group!);
    };
  }

  const onRenderGroupHeader = (properties?: IDetailsGroupDividerProps): JSX.Element | null => {
    const expandText = translateMessage('Expand');
    const collapseText = translateMessage('Collapse');
    const groupName: string = properties?.group!.name!;
    const groupCount: number = properties?.group!.count!;
    const collapseButtonLabel: string = properties?.group!.isCollapsed ? `${expandText} ${groupName}`
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
            className={groupHeaderRowClass}
            onClick={onToggleCollapse(properties!)}
          >
            <TooltipHost
              content={collapseButtonLabel}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}>
              <IconButton
                className={`${pullLeftClass} ${groupHeaderRowIconClass}`}
                iconProps={{
                  iconName: properties?.group!.isCollapsed
                    ? 'ChevronRightSmall'
                    : 'ChevronDownSmall'
                }}
                ariaLabel={collapseButtonLabel}
                onClick={() => onToggleCollapse(properties!)}
                styles={{ icon: { marginTop: '15px' } }}
              />
            </TooltipHost>
            <div className={groupTitleClass}>
              <span>{groupName}</span>
              <span className={headerCountClass}>
                ({groupCount})
              </span>
            </div>
          </div>
        </div>
        <div className={'col-md-4'} style={{ display: 'inline-block' }}>
          <div className={`${pullRightClass}`}>
            <TooltipHost
              content={`${translateMessage('Export')} ${groupName} queries`}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}>
              <IconButton
                className={`${groupHeaderRowIconClass}`}
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
                className={`${groupHeaderRowIconClass}`}
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
    const itemsToDelete = historyItems.filter((query: IHistoryItem) => query.category === category);
    dispatch(bulkRemoveHistoryItems(itemsToDelete));
    closeDialog();
  };

  const exportHistoryByCategory = (value: string) => {
    const itemsToExport = historyItems.filter((query: IHistoryItem) => query.category === value);
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
    dispatch(viewHistoryItem({
      ...query,
      headers: query.responseHeaders
    }));
    dispatch(setQueryResponseStatus({
      duration,
      messageType:
        status < 300 ? MessageBarType.success : MessageBarType.error,
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
  }


  return (
    <>
      <div>
        <SearchBox
          placeholder={translateMessage('Search history items')}
          className={searchBoxClass}
          onChange={(e_, value) => searchValueChanged(value)}
          styles={searchBoxStyles}
        />
        <hr />
        <MessageBar
          messageBarType={MessageBarType.info}
          isMultiline={true}
          dismissButtonAriaLabel='Close'
        >
          <FormattedMessage id='Your history includes queries made in the last 30 days' />
          .
        </MessageBar>
        {items.length === 0 && <Label className={spinnerClass}>
          <FormattedMessage id='We did not find any history items' />
        </Label>}
        <Announced
          message={`${items.length} search results available.`}
        />
        {items.length > 0 && <DetailsList
          className={queryListClass}
          onRenderItemColumn={renderItemColumn}
          items={items}
          columns={columns}
          selectionMode={SelectionMode.none}
          groups={groups}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: onRenderGroupHeader
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
