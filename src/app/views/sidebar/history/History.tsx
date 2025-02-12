import {
  AriaLiveAnnouncer,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  FlatTree,
  FlatTreeItem,
  InputOnChangeData,
  Label,
  makeStyles,
  Menu,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarBody,
  SearchBox,
  SearchBoxChangeEvent,
  Text,
  Tooltip,
  TreeItemLayout,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent
} from '@fluentui/react-components';
import { IGroup } from '@fluentui/react/lib/DetailsList';
import {
  ArrowDownloadRegular,
  ArrowRepeatAllRegular,
  DeleteRegular,
  EyeRegular,
  MoreHorizontalRegular
} from '@fluentui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
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
import { translateMessage } from '../../../utils/translate-messages';
import { createHarEntry, exportQuery, generateHar } from './har-utils';

type BadgeColors =  'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning';
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthStr = (month < 10 ? '0' : '') + month;
  const day = date.getDate();
  const dayStr = (day < 10 ? '0' : '') + day;
  return `${year}-${monthStr}-${dayStr}`;
};


const today = formatDate(new Date());
const yesterdaysDate = new Date();
const yesterday = formatDate(yesterdaysDate);
yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    height: 'calc(100vh - 374px)'
  },
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },
  titleAside: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px'
  }
})

const handleDownloadHistoryGroup = (
  event: React.MouseEvent<HTMLButtonElement>, value: string,
  historyItems: IHistoryItem[])=>{
  event.preventDefault()
  const itemsToExport = historyItems.filter((query: IHistoryItem) => getCategory(query) === value);
  const entries: Entry[] = [];

  itemsToExport.forEach((query: IHistoryItem) => {
    const harPayload = createHarEntry(query);
    entries.push(harPayload);
  });

  const generatedHarData = generateHar(entries);
  const { origin } = new URL(itemsToExport[0].url);
  const exportTitle = `${origin}/${value.toLowerCase()}/${itemsToExport[0].createdAt.slice(0, 10)}/`;

  exportQuery(generatedHarData, exportTitle);
}

interface AsideGroupIconsProps {
  groupName: string
  historyItems: IHistoryItem[]
}

const GroupIcons = (props: AsideGroupIconsProps)=>{
  const dispatch = useAppDispatch()
  const {groupName, historyItems} = props
  const [open, setOpen] = useState(false);
  const styles = useStyles()

  const handleDeleteHistoryGroup = (event: React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault()
    const itemsToDelete = historyItems.filter((query: IHistoryItem) => getCategory(query) === groupName);
    const listOfKeys: string[] = [];
    itemsToDelete.forEach(historyItem => {
      listOfKeys.push(historyItem.createdAt);
    });
    historyCache.bulkRemoveHistoryData(listOfKeys)
    dispatch(removeAllHistoryItems(listOfKeys));
    setOpen(false)
  }

  return <div className={styles.titleAside}>
    <Text weight='semibold'>{groupName}{' '}</Text>
    <Tooltip withArrow relationship="label" content={`${translateMessage('Export')} ${groupName} queries`}>
      <Button onClick={
        (e) => handleDownloadHistoryGroup(e,groupName, historyItems )}
      appearance="subtle" icon={<ArrowDownloadRegular/>}></Button>
    </Tooltip>
    <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip withArrow relationship="label" content={`${translateMessage('Delete')} ${groupName} queries`}>
          <Button appearance="subtle" icon={<DeleteRegular/>}></Button>
        </Tooltip>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{translateMessage('Delete requests')} "{groupName}"</DialogTitle>
          <DialogContent>{translateMessage('Are you sure you want to delete these requests?')}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{translateMessage('Cancel')}</Button>
            </DialogTrigger>
            <Button
              onClick={handleDeleteHistoryGroup}
              appearance="primary"
            >
              {translateMessage('Delete')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>

  </div>
}

interface HistoryProps {
  history: IHistoryItem[]
  groups: IGroup[]
  searchValue: string
}

const HistoryItems = (props: HistoryProps)=>{
  const dispatch = useAppDispatch()
  const {groups, history} = props

  const openHistoryItems = new Set<string>()
  'Today'.split('').forEach(ch=> openHistoryItems.add(ch))
  openHistoryItems.add('Today')

  const [openItems, setOpenItems] = useState<Set<TreeItemValue>>(
    () => openHistoryItems
  );
  const handleOpenChange = (_: TreeOpenChangeEvent, data: TreeOpenChangeData) => {
    setOpenItems(data.openItems);
  };

  const handleViewQuery = (query: IHistoryItem)=>{
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
    trackHistoryItemEvent(
      eventTypes.LISTITEM_CLICK_EVENT,
      componentNames.HISTORY_LIST_ITEM,
      query
    );
  }


  return(
    <FlatTree openItems={openItems} aria-label={translateMessage('History')} onOpenChange={handleOpenChange}>
      {groups.map((group, pos) => {
        const {name, ariaLabel, count, key, startIndex} = group
        const historyLeafs = history.slice(startIndex, startIndex + count)
        return (
          <React.Fragment key={key}>
            <FlatTreeItem
              value={name}
              itemType='branch'
              aria-level={1}
              aria-setsize={2}
              aria-posinset={pos+1}
              aria-label={ariaLabel}>
              <TreeItemLayout aside={
                <Badge appearance='tint' color='informative' aria-label={count + translateMessage('History')}>
                  {count}
                </Badge>}>
                <GroupIcons groupName={name} historyItems={history} />
              </TreeItemLayout>
            </FlatTreeItem>
            {openItems.has(name) &&
              historyLeafs.map((h: IHistoryItem) => (
                <FlatTreeItem
                  value={h.statusText}
                  parentValue={name}
                  itemType='leaf'
                  key={h.createdAt}
                  id={h.createdAt}
                  aria-level={2}
                  aria-setsize={historyLeafs.length}
                  aria-posinset={historyLeafs.findIndex((q) => q.createdAt === h.createdAt) + 1}
                >
                  <TreeItemLayout
                    onClick={()=>handleViewQuery(h)}
                    iconBefore={<HistoryStatusCodes status={h.status} method={h.method}/>}
                    aside={<HistoryItemActionMenu item={h}/>}>
                    <Tooltip content={`${h.method} - ${h.url}`} relationship='description' withArrow>
                      <Text>{h.url.replace(GRAPH_URL, '')}</Text>
                    </Tooltip>
                  </TreeItemLayout>
                </FlatTreeItem>
              ))}
          </React.Fragment>
        )
      })}
    </FlatTree>
  )
}

const HistoryStatusCodes = ({ status, method }: { status: number, method?: string }) => {
  const getBadgeColor = (): BadgeColors => {
    if (status >= 100 && status < 199) { return 'informative' }
    if (status >= 200 && status < 299) { return 'success' }
    if (status >= 300 && status < 399) { return 'important' }
    if (status >= 400 && status < 599) { return 'danger' }
    return 'success';
  };

  const methodColors: Record<string, BadgeColors> = {
    GET: 'brand',
    POST: 'success',
    PATCH: 'severe',
    DELETE: 'danger',
    PUT: 'warning'
  };

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {method && (
        <Badge color={methodColors[method] || 'informative'}>
          {method}
        </Badge>
      )}
      <Badge color={getBadgeColor()} appearance="ghost">{status}</Badge>
    </div>
  );
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

interface HistoryItemActionMenuProps {
  item: IHistoryItem
}


const HistoryItemActionMenu = (props: HistoryItemActionMenuProps)=>{
  const dispatch = useAppDispatch()
  const {item} = props

  const handleExportQuery = (query: IHistoryItem)=>{
    const harPayload = createHarEntry(query);
    const generatedHarData = generateHar([harPayload]);
    exportQuery(generatedHarData, `${query.url}/`);
    trackHistoryItemEvent(
      eventTypes.BUTTON_CLICK_EVENT,
      componentNames.EXPORT_HISTORY_ITEM_BUTTON,
      query
    );
  }

  const handleDeleteQuery = (query:IHistoryItem)=>{
    delete query.category;
    historyCache.removeHistoryData(query);
    dispatch(removeHistoryItem(query));
    trackHistoryItemEvent(
      eventTypes.BUTTON_CLICK_EVENT,
      componentNames.DELETE_HISTORY_ITEM_BUTTON,
      query
    );
  }
  return <Menu>
    <MenuTrigger disableButtonEnhancement>
      <Button appearance='subtle' icon={<MoreHorizontalRegular/>}></Button>
    </MenuTrigger>

    <MenuPopover>
      <MenuList>
        <MenuGroup>
          <MenuGroupHeader>{translateMessage('actions')}</MenuGroupHeader>
          <MenuItem icon={<ArrowDownloadRegular/>}
            onClick={()=>handleExportQuery(item)}>{translateMessage('Export')}</MenuItem>
          <MenuItem icon={<DeleteRegular/>}
            onClick={()=>handleDeleteQuery(item)}>{translateMessage('Delete')}</MenuItem>
        </MenuGroup>
      </MenuList>
    </MenuPopover>
  </Menu>
}

const sortItems = (content: IHistoryItem[]) => {
  content.sort(dynamicSort<IHistoryItem>('createdAt', SortOrder.DESC));
  content.forEach((value: IHistoryItem, index: number) => {
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


const History = ()=>{
  const styles = useStyles()
  const history = useAppSelector(state=> state.history)
  const [historyItems, setHistoryItems] = useState<IHistoryItem[]>(history)
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchStarted, setSearchStarted] = useState(false);
  const shouldGenerateGroups = useRef(true)
  const [groups, setGroups] = useState<IGroup[]>([]);

  const items = getItems(historyItems);

  useEffect(() => {
    if (shouldGenerateGroups.current) {
      setGroups(generateGroupsFromList(items, 'category'));
      if (groups && groups.length > 0) {
        shouldGenerateGroups.current = false;
      }
    }
  }, [historyItems, searchStarted, shouldGenerateGroups])

  useEffect(()=>{
    setHistoryItems(history)
  }, [history])

  const handleSearchValueChanged = (_: SearchBoxChangeEvent, data: InputOnChangeData)=>{
    shouldGenerateGroups.current = true
    setSearchStarted(true)
    let content = [...history]
    const value = data.value.trim() ?? '';
    if(value) {
      setSearchValue(value)
      content = history.filter((item:IHistoryItem)=>{
        const name = item.url.toLowerCase()
        return name.includes(value)
      })
    }
    setHistoryItems(content)
  }
  return <div className={styles.container}>
    <SearchBox
      placeholder={translateMessage('Search history items')}
      onChange={handleSearchValueChanged}
      className={styles.searchBox}
    >
    </SearchBox>
    <hr/>
    <MessageBar>
      <MessageBarBody>
        {translateMessage('Your history includes queries made in the last 30 days')}
      </MessageBarBody>
    </MessageBar>
    {historyItems.length === 0 && <Label size='medium'>{translateMessage('We did not find any history items')}</Label>}
    <AriaLiveAnnouncer><Text>{`${historyItems.length} search results available.`}</Text></AriaLiveAnnouncer>
    <HistoryItems history={historyItems} searchValue={searchValue} groups={groups}></HistoryItems>
  </div>
}

export default History