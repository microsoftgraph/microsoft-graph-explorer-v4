import React, { useEffect, useState } from 'react';
import { TeachingBubbleContent, Coachmark, IButtonProps, Dialog, DialogType, getId,
  DialogFooter, PrimaryButton, Icon } from '@fluentui/react'
import { ITourSteps } from './utils/types';
import { useDispatch } from 'react-redux';
import { toggleTourState } from '../../services/actions/tour-action-creator';
import { translateMessage } from '../../utils/translate-messages';

const NEW_FEATURE : ITourSteps[] = [
  {
    target: '.settings-menu-button',
    content: translateMessage('Getting started message'),
    title:translateMessage('New user title')
  }
]
const NewFeature = () => {
  const [newFeaturePopup, hideNewFeaturePopup] = useState(true);
  const [hidden, hideDialog] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const hasPopupBeenLoaded = localStorage.getItem('tour');
    if(hasPopupBeenLoaded !== 'done'){
      hideNewFeaturePopup(false);
      writeToLocalStorage();
    }
  },[])

  const closeFeaturePopup = () => {
    hideNewFeaturePopup(true);
    handleDialogState();
    writeToLocalStorage();
  }

  const writeToLocalStorage = () => {
    localStorage.setItem('tour', 'done')
  }

  const beginTour = () => {
    dispatch(toggleTourState({isRunning: true, beginner: true, continuous: true, step: 0, pending: false}));
    hideNewFeaturePopup(true);
  }

  const startButton: IButtonProps = React.useMemo(
    () => ({
      children: translateMessage('Yes show me around'),
      onClick: () => beginTour()
    }),[]
  )

  const dismissButton: IButtonProps = React.useMemo(
    () => ({
      children: translateMessage('No thanks'),
      onClick: () =>{closeFeaturePopup()}
    }),[]
  )

  const dialogContentProps = {
    type: DialogType.normal,
    title: translateMessage('Tour location'),
    closeButtonAriaLabel: translateMessage('Close'),
    subText: translateMessage('Tour location message')
  }

  const handleDialogState = () => {
    let dialogHidden = hidden;
    dialogHidden = !dialogHidden
    hideDialog(dialogHidden);
  }

  const SmileyFace = () => <Icon iconName='Emoji2'/>
  return(
    <div>
      {!newFeaturePopup && (
        <Coachmark target={NEW_FEATURE[0].target}
          ariaAlertText={translateMessage('Coachmark')}
          ariaDescribedBy={translateMessage('Coachmark description')}
          ariaLabelledBy={getId('coachmark-label')}
          ariaDescribedByText={translateMessage('Open coachmark')}
          ariaLabelledByText={translateMessage('Open coachmark')}>
          <TeachingBubbleContent
            headline={NEW_FEATURE[0].title as string}
            hasCloseButton
            onDismiss={closeFeaturePopup}
            primaryButtonProps={startButton}
            secondaryButtonProps={dismissButton}
            isWide={true}
          >
            <div style={{textAlign: 'center', lineHeight:'1.5' }} >
              <div><SmileyFace/></div>
              {NEW_FEATURE[0].content}
            </div>
          </TeachingBubbleContent>
        </Coachmark>)}

      <Dialog
        hidden={hidden}
        dialogContentProps={dialogContentProps}
        modalProps={{
          titleAriaId: getId(),
          subtitleAriaId: getId(),
          isBlocking: false,
          styles: { main: { maxWidth: 450, textAlign: 'center'} }
        }}
      >
        <DialogFooter>
          <PrimaryButton text={translateMessage('Close')}  onClick={handleDialogState} />
        </DialogFooter>
      </Dialog>

    </div>
  )
}

export default NewFeature;