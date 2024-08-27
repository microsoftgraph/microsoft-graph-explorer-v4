import {
  DirectionalHint,
  FontSizes,
  Pivot,
  PivotItem,
  Stack,
  TooltipDelay,
  TooltipHost
} from '@fluentui/react';
import { Button } from '@fluentui/react-components';
import { HistoryRegular, RocketRegular } from '@fluentui/react-icons';
import { telemetry } from '../../../telemetry';
import { translateMessage } from '../../utils/translate-messages';
import UnstyledSampleQueries from './sample-queries/SampleQueries';
import { sidebarStyles } from './Sidebar.styles';
import { ResourceExplorer, History } from '../common/lazy-loader/component-registry';
import { ExploreContentIcon } from '@fluentui/react-icons-mdl2';
interface ISidebar {
  currentTab: string;
  setSidebarTabSelection: Function;
  showSidebar: boolean;
  toggleSidebar: Function;
  mobileScreen: boolean;
}

export const Sidebar = (props: ISidebar) => {
  const styles = sidebarStyles();

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
          styles={{ text: { fontSize: FontSizes.size14 } }}>
          <PivotItem
            headerText={translateMessage('Sample Queries')}
            itemIcon='Rocket'
            itemKey='sample-queries'
            headerButtonProps={{
              'aria-controls': 'sample-queries-tab'
            }}
          >
            <div id={'sample-queries-tab'}><UnstyledSampleQueries /></div>
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
      {!props.showSidebar && !props.mobileScreen && (
        <Stack tokens={{ childrenGap: 10 }}>
          <TooltipHost
            content={
              <div style={{ padding: '3px' }}>
                {translateMessage('Sample Queries')}
              </div>}
            calloutProps={{ gapSpace: 0 }}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{ root: { display: 'inline-block' } }}
            delay={TooltipDelay.zero}
          >
            <Button
              appearance='transparent'
              icon={<RocketRegular />}
              aria-label={translateMessage('Sample Queries')}
              onClick={() => openComponent('sample-queries')}
              className={styles.sidebarButtons}
            />
          </TooltipHost>
          <TooltipHost
            content={
              <div style={{ padding: '3px' }}>
                {translateMessage('Resources')}
              </div>}
            calloutProps={{ gapSpace: 0 }}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{ root: { display: 'inline-block' } }}
            delay={TooltipDelay.zero}
          >
            <Button
              icon={<ExploreContentIcon/>}
              aria-label={translateMessage('Resources')}
              onClick={() => openComponent('resources')}
              className={styles.sidebarButtons}
            />
          </TooltipHost>
          <TooltipHost
            content={
              <div style={{ padding: '3px' }}>
                {translateMessage('History')}
              </div>}
            calloutProps={{ gapSpace: 0 }}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{ root: { display: 'inline-block' } }}
            delay={TooltipDelay.zero}
          >
            <Button
              icon={<HistoryRegular/>}
              aria-label={translateMessage('History')}
              onClick={() => openComponent('history')}
              className={styles.sidebarButtons}
            />
          </TooltipHost>
        </Stack>)
      }
    </div>
  );
};


