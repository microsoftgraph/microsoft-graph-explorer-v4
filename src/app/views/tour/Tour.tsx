import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { ITourSteps } from './utils/types'
import { Dialog, DialogType, getId, getTheme, ITheme, Link } from '@fluentui/react';
import { IRootState } from '../../../types/root';

import { toggleTourState, setNextTourStep } from '../../services/actions/tour-action-creator';
import { TourTip } from './custom-components/Tourtip';
import { BEGINNER_TOUR, ADVANCED_TOUR } from './utils/steps'
import { useDispatch, useSelector } from 'react-redux';
import { translateMessage } from '../../utils/translate-messages';
import { FormattedMessage } from 'react-intl';
import { setSampleQuery } from '../../services/actions/query-input-action-creators';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { geLocale } from '../../../appLocale';

const GETour = () => {

  const { tour } = useSelector((state: IRootState) => state);
  const {step, beginner, isRunning} = tour;
  const dispatch = useDispatch();
  const [run, setRun] = useState(isRunning);
  const [steps] = useState(beginner === true ? BEGINNER_TOUR : ADVANCED_TOUR);
  const [stepIndex, setStepIndex] = useState(step);
  const [changedIndexes, setChangedIndexes] = useState([]);
  const [hidden, hideInfoDialog] = useState(true);
  const [dialogContentProps, setDialogContentProps] = useState({
    type: DialogType.normal,
    title: translateMessage('All set'),
    closeButtonAriaLabel: translateMessage('Close'),
    subText: beginner === true ? translateMessage('Beginner closing message'):
      translateMessage('Advanced closing message'),
    showCloseButton: true
  })
  const [temporarilyDisableOverlay, setDisableOverlay] = useState(false);
  const [pauseTourOnResponse, setPauseTour] = useState(false);
  const currentTheme: ITheme = getTheme();
  let responseTimeout: NodeJS.Timeout;

  // eslint-disable-next-line max-len
  const geDocsLink = `https://docs.microsoft.com/${geLocale}/graph/graph-explorer/graph-explorer-overview?context=graph%2Fapi%2F1.0&view=graph-rest-1.0`

  const stepIndexChanged : any= []
  useEffect(() => {
    setRun(isRunning);
  }, [])

  useEffect(() => {
    if(!!steps[stepIndex].expectedActionType && steps[stepIndex].expectedActionType === tour.actionType){
      pauseOnResponse(stepIndex + 1);
      dispatch(setNextTourStep(stepIndex));
    }

    if(tour.actionType === 'AUTOCOMPLETE_FETCH_SUCCESS' ){
      setDisableOverlay(true);
    }
  }, [tour.actionType])

  const peekNextTarget = (): boolean => {
    if(stepIndex + 1 >= steps.length){
      return false;
    }
    const nextStep = steps[stepIndex+1];
    if(nextStep.target instanceof HTMLElement){
      return true;
    }
    const selector = nextStep.target;
    return document.querySelector(selector) != null;
  }

  const handleJoyrideCallback = (data: CallBackProps) => {

    if(stepIndex < steps.length-1 && !!steps[stepIndex].query){
      const query = steps[stepIndex].query;
      dispatch(setSampleQuery(query!));
      dispatch(setNextTourStep(stepIndex));
    }

    const { action, index, type, status } = data;
    const tourStep: ITourSteps = data.step
    if(changedIndexes.length > 0 ){
      const changedIndexesClone = changedIndexes.slice();
      for (const changedIndex of changedIndexes){
        if(changedIndex !== stepIndex){
          steps[changedIndex].autoNext = !steps[changedIndex].autoNext;

          const indexToRemove = changedIndexesClone.indexOf(changedIndex);
          if(indexToRemove > -1){
            changedIndexesClone.splice(indexToRemove,1)
          }
        }
      }
      setChangedIndexes(changedIndexesClone);
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false)
      setStepIndex(0);

      if(index < steps.length-1){
        setDialogContentProps({
          type: DialogType.normal,
          title: translateMessage('Sad to see you go'),
          closeButtonAriaLabel: translateMessage('Close'),
          subText: translateMessage('Ending the tour midway'),
          showCloseButton: true
        })
      }

      hideInfoDialog(false);

      telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
        ComponentName: componentNames.START_TOUR_BUTTON,
        tourIndex: index,
        totalSteps: steps.length,
        tourType: beginner === true ? 'BEGINNER_TOUR' : 'ADVANCED_TOUR'
      });

    }
    else if (action === 'update' && tourStep.autoNext ) {
      // eslint-disable-next-line prefer-const
      let mutationObserver : MutationObserver ;

      const mutationHandler = () => {
        if(peekNextTarget()){
          mutationObserver.disconnect();
          const stepIndex_ = stepIndex + 1;
          pauseOnResponse(stepIndex_);
        }
      };
      mutationObserver = new MutationObserver(mutationHandler);
      mutationObserver.observe(
        document.body,
        {
          childList: true,
          attributes: true,
          subtree: true
        }
      )
    }
    else {
      if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
        const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

        if(action === ACTIONS.NEXT || ACTIONS.PREV && pauseTourOnResponse === true){
          clearTimeout(responseTimeout);
        }

        if(action === ACTIONS.PREV){
          if(steps[stepIndex-1].autoNext === true){
            steps[stepIndex-1].autoNext = false;
            stepIndexChanged.push(stepIndex-1);
            setChangedIndexes(stepIndexChanged);
          }
          dispatch(setNextTourStep(stepIndex));

        }
        setDisableOverlay(false);
        setStepIndex(newStepIndex);
      }
    }
  }

  const handleCloseDialog = () => {
    hideInfoDialog(true);
    dispatch(toggleTourState({isRunning: false, beginner: false, continuous: true, step: 0}));
  }

  const pauseOnResponse = (nextIndex: number) => {
    if(steps[stepIndex].target === '.pivot-response *[data-content="Response preview xx"]' && !pauseTourOnResponse){
      setPauseTour(true);
      responseTimeout = setTimeout( () => {
        setStepIndex(nextIndex);
      }, 5000 );
    }
    else{
      setStepIndex(nextIndex);
      clearTimeout(responseTimeout);
    }
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        callback={(data) => handleJoyrideCallback(data)}
        locale={{
          last: 'End Tour',
          skip: 'Got it'
        }}
        stepIndex={stepIndex}
        tooltipComponent={TourTip}
        debug={false}
        floaterProps={{hideArrow: true}}
        styles={{
          options:{
            primaryColor:currentTheme.palette.blue
          }
        }}
        disableOverlayClose={true}
        disableScrollParentFix={true}
        disableOverlay={temporarilyDisableOverlay}
      />
      <Dialog
        hidden={hidden}
        dialogContentProps={dialogContentProps}
        modalProps={{
          titleAriaId: getId(),
          subtitleAriaId: getId(),
          isBlocking: false,
          styles: { main: { maxWidth: 450, textAlign: 'center', font:'bold', lineHeight:'1.8'} }
        }}
        onDismiss={handleCloseDialog}
      >
        <Link
          href={geDocsLink} target='_blank' underline
        >
          <FormattedMessage id='Graph explorer docs'/>
        </Link>
      </Dialog>
    </>

  )
}


export default GETour;