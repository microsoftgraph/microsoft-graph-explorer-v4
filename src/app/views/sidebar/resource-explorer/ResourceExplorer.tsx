import {
  FontSizes,
  Pivot, PivotItem,
  styled
} from '@fluentui/react';

import { telemetry } from '../../../../telemetry';
import { translateMessage } from '../../../utils/translate-messages';
import { sidebarStyles } from '../Sidebar.styles';
import Endpoints from './Endpoints';
import PathsReview from './collection/PreviewCollection';

const UnstyledResourceExplorer = (props: any) => {

  const onPivotItemClick = (item?: PivotItem) => {
    if (!item) { return; }
    const key = item.props.itemKey;
    if (key) {
      props.setSidebarTabSelection(key);
      telemetry.trackTabClickEvent(key);
    }
  }

  return (
    <section style={{ marginTop: '8px' }}>
      <Pivot onLinkClick={onPivotItemClick}
        overflowBehavior='menu'
        overflowAriaLabel={translateMessage('More items')}
        defaultSelectedKey={props.currentTab}
        styles={{ text: { fontSize: FontSizes.size14 } }}>
        <PivotItem
          headerText={translateMessage('Endpoints')}
          itemIcon='Rocket'
          itemKey='endpoints'
          headerButtonProps={{
            'aria-controls': 'endpoints-tab'
          }}
        >
          <div id={'endpoints-tab'}><Endpoints /></div>
        </PivotItem>

        <PivotItem
          headerText={translateMessage('Collection')}
          itemIcon='History'
          itemKey='history'
          headerButtonProps={{
            'aria-controls': 'collection-tab'
          }}
        >
          <div id={'collection-tab'}><PathsReview dismissPopup={function (): void {
            throw new Error('Function not implemented.');
          }} closePopup={function (results?: string | object | undefined): void {
            throw new Error('Function not implemented.');
          }} settings={{ title: 'Path' }} data={{
            version: '1.0.0'
          }} /></div>
        </PivotItem>
      </Pivot>
    </section >
  );
}

// @ts-ignore
const ResourceExplorer = styled(UnstyledResourceExplorer, sidebarStyles);
export default ResourceExplorer;