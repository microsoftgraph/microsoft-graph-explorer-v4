import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { ITourSteps } from './utils/types'
import { getTheme, ITheme } from '@fluentui/react';
import { IRootState } from '../../../types/root';

import { toggleTourState, setActionTypes as setStepAction } from '../../services/actions/tour-action-creator';
import { TourTip } from './customComponents/Tourtip';
import { BEGINNER_TOUR, ADVANCED_TOUR } from './utils/steps'
import { useDispatch, useSelector } from 'react-redux';

const GETour = () => {

  const { tourState, saveActionTypes } = useSelector((state: IRootState) => state);
  const {startIndex, beginnerTour} = tourState;
  const dispatch = useDispatch();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState(beginnerTour === true ? BEGINNER_TOUR : ADVANCED_TOUR);
  const [stepIndex, setStepIndex] = useState(startIndex);
  const [changedIndexes, setChangedIndexes] = useState([]);
  const currentTheme: ITheme = getTheme();

  const stepIndexChanged : any= []
  useEffect(() => {
    setRun(true);
  }, [])

  useEffect(() => {
    if(steps[stepIndex].expectedActionType !== null && steps[stepIndex].expectedActionType === saveActionTypes){
      setStepIndex(stepIndex + 1);
      dispatch(setStepAction(stepIndex));
    }
  }, [saveActionTypes])

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

    const { action, index, type, status } = data;
    const step: ITourSteps = data.step
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
      dispatch(toggleTourState({runState: false, beginnerTour: false, continuous: true, startIndex: 0}));

    }
    else if (action === 'update' && step.autoNext ) {
      // eslint-disable-next-line prefer-const
      let mutationObserver : MutationObserver ;

      const mutationHandler = () => {
        if(peekNextTarget()){
          mutationObserver.disconnect();
          const stepIndex_ = stepIndex + 1;
          setTimeout(() => {
            setStepIndex(stepIndex_);
          }, 1000);
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
      // mutationHandler();
    }
    else {
      if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
        const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

        if(action === ACTIONS.PREV){
          if(steps[stepIndex-1].autoNext === true){
            steps[stepIndex-1].autoNext = false;
            stepIndexChanged.push(stepIndex-1);
            setChangedIndexes(stepIndexChanged);
          }

        }
        setStepIndex(newStepIndex);
      }
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      callback={(data) => handleJoyrideCallback(data)}
      locale={{
        last: 'End Tour',
        skip: 'Close Tour'
      }}
      stepIndex={stepIndex}
      tooltipComponent={TourTip}
      debug={true}
      floaterProps={{hideArrow: true}}
      styles={{
        options:{
          primaryColor:currentTheme.palette.blue
        }
      }}
      disableOverlayClose={true}
      disableScrollParentFix={true}
    />

  )
}


export default GETour;