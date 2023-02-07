import {
  CommandBar, getTheme, ICommandBarItemProps, IOverlayProps, Label, Panel, PanelType, PrimaryButton
} from '@fluentui/react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/actions/resource-explorer-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection } from './postman.util';

export interface IPathsReview {
  isOpen: boolean;
  version: string;
  toggleSelectedResourcesPreview: Function;
}

const PathsReview = (props: IPathsReview) => {
  const dispatch: AppDispatch = useDispatch();
  const { resources: { paths: items }, theme } = useAppSelector(
    (state) => state
  );
  const { isOpen } = props;
  const headerText = translateMessage('Selected Resources') + ' ' + translateMessage('Preview');
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
  const currentTheme = getTheme();

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true }
  ];

  const generateCollection = () => {
    const content = generatePostmanCollection(items);
    const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
    downloadToLocal(content, filename);
  }

  const renderFooterContent = () => {
    return (
      <div>
        <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
          <FormattedMessage id='Download postman collection' />
        </PrimaryButton>
      </div>
    )
  }

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
  }

  const options: ICommandBarItemProps[] = [
    {
      key: 'remove',
      text: translateMessage('remove'),
      iconProps: { iconName: 'Delete' },
      disabled: selectedItems.length === 0,
      onClick: () => removeSelectedItems()
    }
  ];

  const selectItems = (content: IResourceLink[]) => {
    setSelectedItems(content);
  };

  const isCurrentThemeDark = (): boolean => {
    if (theme === 'dark' || theme === 'high-contrast') {
      return true;
    }
    return false;
  }

  const panelOverlayProps: IOverlayProps = {
    styles: {
      root: {
        backgroundColor: isCurrentThemeDark() ? currentTheme.palette.blackTranslucent40 :
          currentTheme.palette.whiteTranslucent40
      }
    }
  }

  return (
    <>
      <Panel
        headerText={`${headerText}`}
        isOpen={isOpen}
        onDismiss={() => props.toggleSelectedResourcesPreview()}
        type={PanelType.large}
        onRenderFooterContent={renderFooterContent}
        closeButtonAriaLabel='Close'
        overlayProps={panelOverlayProps}
      >
        <Label>
          <FormattedMessage id='Export list as a Postman collection message' />
        </Label>
        <CommandBar
          items={options}
          ariaLabel='Selection actions'
          primaryGroupAriaLabel='Selection actions'
          farItemsGroupAriaLabel='More selection actions'
        />
        {items && <Paths
          resources={items}
          columns={columns}
          selectItems={selectItems}
        />}
      </Panel>
    </>
  )
}

export default PathsReview;