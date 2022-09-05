import { DirectionalHint,
  FontSizes,
  getTheme,
  IconButton,
  Pivot,
  PivotItem,
  Stack,
  TooltipDelay,
  TooltipHost } from '@fluentui/react';
import React from 'react';

import { telemetry } from '../../../telemetry';
import { translateMessage } from '../../utils/translate-messages';
import History from './history/History';
import { ResourceExplorer } from './resource-explorer';
import SampleQueries from './sample-queries/SampleQueries';
import { sidebarStyles } from './Sidebar.styles';

interface ISidebar {
  currentTab: string;
  setSidebarTabSelection: Function;
  showSidebar: boolean;
  toggleSidebar: Function;
  mobileScreen: boolean;
}
export const Sidebar = (props: ISidebar) =>{
  const theme = getTheme();
  const styles = sidebarStyles(theme).sidebarButtons;

  const onPivotItemClick = (item?: PivotItem) => {
    if (!item) { return; }
    const key = item.props.itemKey;
    if (key) {
      props.setSidebarTabSelection(key);
      telemetry.trackTabClickEvent(key);
    }
  }
  const openComponent = (key: string) => {
    props.toggleSidebar();
    props.setSidebarTabSelection(key);
  }

  return (
    <div>
      {props.showSidebar &&
      <Pivot onLinkClick={onPivotItemClick}
        overflowBehavior='menu'
        overflowAriaLabel={translateMessage('More items')}
        defaultSelectedKey={props.currentTab}
        styles={{text: {fontSize: FontSizes.size14}}}>
        <PivotItem
          headerText={translateMessage('Sample Queries')}
          itemIcon='Rocket'
          itemKey='sample-queries'
          headerButtonProps={{
            'aria-controls': 'sample-queries-tab'
          }}
        >
          <div id={'sample-queries-tab'}><SampleQueries /></div>
        </PivotItem>
        <PivotItem
          headerText={translateMessage('Resources')}
          itemIcon='ExploreData'
          itemKey='resources'
          headerButtonProps={{
            'aria-controls': 'resources-tab'
          }}
        >
          <div id={'resources-tab'}><ResourceExplorer /></div>
        </PivotItem>
        <PivotItem
          headerText={translateMessage('History')}
          itemIcon='History'
          itemKey='history'
          headerButtonProps={{
            'aria-controls': 'history-tab'
          }}
        >
          <div id={'history-tab'}><History /></div>
        </PivotItem>
      </Pivot>
      }
      { !props.showSidebar && !props.mobileScreen && (
        <Stack tokens={{childrenGap: 10}}>
          <TooltipHost
            content={
              <div style={{padding:'3px'}}>
                {translateMessage('Sample Queries')}
              </div>}
            calloutProps={{gapSpace: 0}}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{root: { display: 'inline-block'}}}
            delay={TooltipDelay.zero}
          >
            <IconButton
              iconProps={{iconName: 'Rocket'}}
              ariaLabel={translateMessage('Sample Queries')}
              onClick={() => openComponent('sample-queries')}
              styles={styles}
            />
          </TooltipHost>
          <TooltipHost
            content={
              <div style={{padding:'3px'}}>
                {translateMessage('Resources')}
              </div>}
            calloutProps={{gapSpace: 0}}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{root: { display: 'inline-block'}}}
            delay={TooltipDelay.zero}
          >
            <IconButton
              iconProps={{iconName: 'ExploreData'}}
              ariaLabel={translateMessage('Resources')}
              onClick={() => openComponent('resources')}
              styles={styles}
            />
          </TooltipHost>
          <TooltipHost
            content={
              <div style={{padding:'3px'}}>
                {translateMessage('History')}
              </div>}
            calloutProps={{gapSpace: 0}}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{root: { display: 'inline-block'}}}
            delay={TooltipDelay.zero}
          >
            <IconButton
              iconProps={{iconName: 'History'}}
              ariaLabel={translateMessage('History')}
              onClick={() => openComponent('history')}
              styles={styles}
            />
          </TooltipHost>
        </Stack>)
      }
    </div>
  );
};


