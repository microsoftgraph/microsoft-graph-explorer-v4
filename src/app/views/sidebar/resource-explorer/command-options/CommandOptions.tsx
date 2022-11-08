import {
  CommandBar, CommandBarButton, DefaultButton, Dialog, DialogFooter, DialogType,
  getId, getTheme, IButtonProps, ICommandBarItemProps, PrimaryButton
} from '@fluentui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { removeResourcePaths } from '../../../../services/actions/resource-explorer-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import PathsReview from '../panels/PathsReview';
import { resourceExplorerStyles } from '../resources.styles';

interface ICommandOptions {
  version: string;
}

const CommandOptions = (props: ICommandOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const { version } = props;
  const theme = getTheme();

  const { resources: { paths } } = useAppSelector((state) => state);
  const itemStyles = resourceExplorerStyles(theme).itemStyles;
  const commandStyles = resourceExplorerStyles(theme).commandBarStyles;
  const options: ICommandBarItemProps[] = [
    {
      key: 'preview',
      text: translateMessage('Preview collection'),
      ariaLabel: translateMessage('Preview collection'),
      iconProps: { iconName: 'View' },
      onClick: () => toggleSelectedResourcesPreview()
    }
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'delete-all',
      iconProps: { iconName: 'Delete' },
      style: {
        marginLeft: 30
      },
      ariaLabel: translateMessage('Delete'),
      onClick: () => toggleIsDialogHidden()
    }
  ]

  const toggleSelectedResourcesPreview = () => {
    let open = isOpen;
    open = !open;
    setIsOpen(open);
  }

  const removeAllResources = () => {
    dispatch(removeResourcePaths(paths));
  }

  const CustomButton: React.FunctionComponent<IButtonProps> = (props_: any) => {
    return <CommandBarButton {...props_} styles={itemStyles} />;
  };

  const deleteResourcesDialogProps = {
    type: DialogType.normal,
    title: translateMessage('Delete collection'),
    closeButtonAriaLabel: 'Close',
    subText: translateMessage('Do you want to remove all the items you have added to the collection?')
  };

  const toggleIsDialogHidden = () => {
    setIsDialogHidden(!isDialogHidden);
  }

  return (
    <div>
      <CommandBar
        items={options}
        farItems={farItems}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
        buttonAs={CustomButton}
        styles={commandStyles}
      />
      <PathsReview
        isOpen={isOpen}
        version={version}
        toggleSelectedResourcesPreview={toggleSelectedResourcesPreview}
      />
      <Dialog
        hidden={isDialogHidden}
        onDismiss={toggleIsDialogHidden}
        dialogContentProps={deleteResourcesDialogProps}
        modalProps={{
          titleAriaId: getId('dialogLabel'),
          subtitleAriaId: getId('subTextLabel'),
          isBlocking: false
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={removeAllResources} text={translateMessage('Yes')} />
          <DefaultButton onClick={toggleIsDialogHidden} text={translateMessage('Cancel')} />
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default CommandOptions;
