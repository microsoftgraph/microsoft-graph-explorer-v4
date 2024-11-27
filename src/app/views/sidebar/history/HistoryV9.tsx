import {
  AriaLiveAnnouncer,
  Badge,
  Button,
  Divider,
  FlatTree,
  FlatTreeItem,
  InputOnChangeData,
  Label,
  makeStyles,
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

import { ArrowDownloadRegular, DeleteRegular } from '@fluentui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../store';
import { SortOrder } from '../../../../types/enums';
import { Entry } from '../../../../types/har';
import { IHistoryItem } from '../../../../types/history';
import { dynamicSort } from '../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { translateMessage } from '../../../utils/translate-messages';
import { createHarEntry, exportQuery, generateHar } from './har-utils';

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
    gap: '4px'
  },
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },
  titleAside: {
    display: 'flex',
    gap: '4px'
  }
})


const handleDeleteHistoryGroup = (event: React.MouseEvent<HTMLButtonElement>)=>{
  event.preventDefault()
  console.log('deleting history')
}

const handleDownloadHistoryGroup = (
  event: React.MouseEvent<HTMLButtonElement>, value: string,
  historyItems: IHistoryItem[], category: string)=>{
  event.preventDefault()
  const itemsToExport = historyItems.filter((query: IHistoryItem) => getCategory(query) === value);
  const entries: Entry[] = [];

  itemsToExport.forEach((query: IHistoryItem) => {
    const harPayload = createHarEntry(query);
    entries.push(harPayload);
  });

  const generatedHarData = generateHar(entries);
  const { origin } = new URL(itemsToExport[0].url);
  const exportTitle = `${origin}/${category.toLowerCase()}/${itemsToExport[0].createdAt.slice(0, 10)}/`;

  exportQuery(generatedHarData, exportTitle);
}

interface AsideGroupIconsProps {
  groupName: string
  historyItems: IHistoryItem[]
  category: string
}

const AsideGroupIcons = (props: AsideGroupIconsProps)=>{
  const {groupName, historyItems, category} = props
  const styles = useStyles()
  return <div className={styles.titleAside}>
    <Tooltip withArrow relationship="label" content={`${translateMessage('Export')} ${groupName} queries`}>
      <Button onClick={
        (event: React.MouseEvent<HTMLButtonElement>)=>
          handleDownloadHistoryGroup(event,groupName, historyItems, category )}
      appearance="subtle" icon={<ArrowDownloadRegular/>}></Button>
    </Tooltip>
    <Tooltip withArrow relationship="label" content={`${translateMessage('Delete')} ${groupName} queries`}>
      <Button onClick={handleDeleteHistoryGroup}appearance="subtle" icon={<DeleteRegular/>}></Button>
    </Tooltip>
  </div>
}

interface HistoryProps {
  history: IHistoryItem[]
  groups: IGroup[]
  searchValue: string
}

const History = (props: HistoryProps)=>{
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
              <TreeItemLayout aside={<AsideGroupIcons groupName={name} historyItems={history} category={name} />}>
                <Text weight='semibold'>{name}{' '}
                  <Badge appearance='tint' color='informative' aria-label={count + translateMessage('History')}>
                    {count}
                  </Badge></Text>
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
                  <TreeItemLayout>{h.statusText}</TreeItemLayout>
                </FlatTreeItem>
              ))}
          </React.Fragment>
        )
      })}
    </FlatTree>
  )
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


export const HistoryV9 = ()=>{
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
    <Divider />
    <MessageBar>
      <MessageBarBody>
        {translateMessage('Your history includes queries made in the last 30 days')}
      </MessageBarBody>
    </MessageBar>
    {historyItems.length === 0 && <Label size='medium'>{translateMessage('We did not find any history items')}</Label>}
    <AriaLiveAnnouncer><Text>{`${historyItems.length} search results available.`}</Text></AriaLiveAnnouncer>
    <History history={historyItems} searchValue={searchValue} groups={groups}></History>
  </div>
}