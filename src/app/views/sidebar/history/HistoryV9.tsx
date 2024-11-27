import { InputOnChangeData, makeStyles, SearchBox, SearchBoxChangeEvent } from '@fluentui/react-components'
import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../../../store'
import { IHistoryItem } from '../../../../types/history'
import { translateMessage } from '../../../utils/translate-messages'

const useStyles = makeStyles({
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  }
})

export const HistoryV9 = ()=>{
  const styles = useStyles()
  const shouldGenerateGroups = useRef(true)
  const history = useAppSelector(state=> state.history)
  const [historyItems, setHistoryItems] = useState<IHistoryItem[]>(history)
  const [searchStarted, setSearchStarted] = useState(false);

  useEffect(()=>{
    setHistoryItems(history)
  }, [history])

  const handleSearchValueChanged = (_: SearchBoxChangeEvent, data: InputOnChangeData)=>{
    shouldGenerateGroups.current = true
    setSearchStarted(true)
    let content = [...history]
    const searchValue = data.value.trim() ?? '';
    if(searchValue) {
      content = history.filter((item:IHistoryItem)=>{
        const name = item.url.toLowerCase()
        return name.includes(searchValue)
      })
    }
    setHistoryItems(content)
    console.log(historyItems)
  }
  return <>
    <SearchBox
      placeholder={translateMessage('Search history items')}
      onChange={handleSearchValueChanged}
      className={styles.searchBox}
    >
    </SearchBox>
    <div>
    </div>
  </>
}