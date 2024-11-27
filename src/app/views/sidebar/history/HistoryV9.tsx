import {
  AriaLiveAnnouncer,
  Divider,
  InputOnChangeData,
  Label,
  makeStyles,
  MessageBar,
  MessageBarBody,
  SearchBox,
  SearchBoxChangeEvent,
  Text
} from '@fluentui/react-components';
import { IGroup } from '@fluentui/react/lib/DetailsList';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../store';
import { SortOrder } from '../../../../types/enums';
import { IHistoryItem } from '../../../../types/history';
import { dynamicSort } from '../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { translateMessage } from '../../../utils/translate-messages';

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
  }
})

interface HistoryProps {
  history: IHistoryItem[]
  groups: IGroup[]
  searchValue: string
}

const History = (props: HistoryProps)=>{
  console.log(props)
  return <p>Items</p>
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
    <div>
    </div>
  </div>
}