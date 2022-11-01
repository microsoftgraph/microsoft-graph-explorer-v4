import {
  CommandBar,
  ICommandBarItemProps,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  DefaultButton,
  Stack,
  IStackTokens,
  Callout,
  Text,
  mergeStyleSets,
  FontWeights
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/actions/resource-explorer-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackGenerate } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection } from './postman.util';

export interface IPathsReview {
  isOpen: boolean;
  version: string;
  toggleSelectedResourcesPreview: Function;
}

const PathsReview = (props: IPathsReview) => {
  const dispatch: AppDispatch = useDispatch();
  const {
    resources: { paths: items }
  } = useAppSelector((state) => state);
  const { isOpen } = props;
  const headerText =
    translateMessage('Selected Resources') + ' ' + translateMessage('Preview');
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
  const [
    showVersionErrorMessage,
    {
      toggle: toggleShowVersionErrorMessage,
      setTrue: setShowVersionErrorMessageTrue,
      setFalse: setShowVersionErrorMessageFalse
    }
  ] = useBoolean(false);

  const columns = [
    {
      key: 'url',
      name: 'URL',
      fieldName: 'url',
      minWidth: 300,
      maxWidth: 350,
      isResizable: true
    }
  ];

  const getItemsForActions = () => {
    if (selectedItems.length === 0) {
      return items;
    }
    return selectedItems;
  };

  const generateCollection = () => {
    const content = generatePostmanCollection(getItemsForActions());
    const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
    downloadToLocal(content, filename);
  };
  const getDescriptionUrl = () => {
    const workingItems = getItemsForActions();
    if (workingItems.length > 0 && workingItems[0].version === 'beta') {
      return 'https://raw.githubusercontent.com/microsoftgraph/msgraph-metadata/master/openapi/beta/openapi.yaml';
    }
    return 'https://raw.githubusercontent.com/microsoftgraph/msgraph-metadata/master/openapi/v1.0/openapi.yaml';
  };
  const getVersionsCount = () => {
    const workingItems = getItemsForActions();
    const versions = workingItems.map((item) => item.version);
    return new Set(versions).size;
  };
  const redirectToKiotaWeb = () => {
    const includePatterns = getItemsForActions()
      .map((item) => item.url)
      .flat()
      .join(',');
    const versionCount = getVersionsCount();
    if (versionCount > 1) {
      setShowVersionErrorMessageTrue();
    } else {
      setShowVersionErrorMessageFalse();
      window.open(
        // eslint-disable-next-line max-len
        `https://app.kiota.dev/generate?i=${includePatterns}&d=${getDescriptionUrl()}&b=True&ad=True&c=GraphServiceClient`,
        '_blank'
      );
      trackGenerate();
    }
  };
  const stackTokens: IStackTokens = { childrenGap: 40 };
  const generateId = useId('generate');
  const styles = mergeStyleSets({
    button: {
      width: 130
    },
    callout: {
      width: 320,
      maxWidth: '90%',
      padding: '20px 24px'
    },
    title: {
      marginBottom: 12,
      fontWeight: FontWeights.semilight
    },
    link: {
      display: 'block',
      marginTop: 20
    }
  });
  const renderFooterContent = () => {
    return (
      <div>
        <Stack horizontal tokens={stackTokens}>
          <DefaultButton
            onClick={generateCollection}
            disabled={selectedItems.length > 0}
          >
            <FormattedMessage id='Download postman collection' />
          </DefaultButton>
          <PrimaryButton
            id={generateId}
            onClick={redirectToKiotaWeb}
            disabled={selectedItems.length > 0}
          >
            <FormattedMessage id='Generate client - preview' />
          </PrimaryButton>
        </Stack>
        {showVersionErrorMessage && (
          <Callout
            role='dialog'
            className={styles.callout}
            gapSpace={0}
            target={`#${generateId}`}
            onDismiss={toggleShowVersionErrorMessage}
            setInitialFocus
          >
            <Text as='h1' block variant='xLarge' className={styles.title}>
              <FormattedMessage id='Generate client - multiple versions - title' />
            </Text>
            <Text block variant='small'>
              <FormattedMessage id='Generate client - multiple versions' />
            </Text>
          </Callout>
        )}
      </div>
    );
  };

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
  };

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

  return (
    <>
      <Panel
        headerText={`${headerText}`}
        isOpen={isOpen}
        onDismiss={() => props.toggleSelectedResourcesPreview()}
        type={PanelType.large}
        onRenderFooterContent={renderFooterContent}
        closeButtonAriaLabel='Close'
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
        {items && (
          <Paths
            resources={items}
            columns={columns}
            selectItems={selectItems}
          />
        )}
      </Panel>
    </>
  );
};

export default PathsReview;
