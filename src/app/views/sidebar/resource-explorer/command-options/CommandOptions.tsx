import {
  CommandBar, CommandBarButton, DefaultButton, Dialog, DialogFooter, DialogType,
  getId, getTheme, IButtonProps, ICommandBarItemProps, PrimaryButton
} from '@fluentui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { removeResourcePaths } from '../../../../services/actions/collections-action-creators';
import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { resourceExplorerStyles } from '../resources.styles';

interface ICommandOptions {
  version: string;
}

const CommandOptions = (props: ICommandOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const { show: previewCollection } = usePopups('preview-collection', 'panel');

  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const { version } = props;
  const theme = getTheme();

  const { collections } = useAppSelector((state) => state);
  const paths = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];

  const itemStyles = resourceExplorerStyles(theme).itemStyles;
  const commandStyles = resourceExplorerStyles(theme).commandBarStyles;
  const options: ICommandBarItemProps[] = [
    {
      key: 'preview',
      text: translateMessage('Preview collection'),
      ariaLabel: translateMessage('Preview collection'),
      iconProps: { iconName: 'View' },
      onClick: () => openPreviewCollection()
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

  const openPreviewCollection = () => {
    previewCollection({
      settings: {
        title: translateMessage('Selected Resources') + ' ' + translateMessage('Preview'),
        width: 'xl'
      },
      data: {
        version
      }
    })
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
