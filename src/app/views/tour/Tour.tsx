import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { ITourSteps } from './utils/types'
import { getTheme, ITheme } from '@fluentui/react';
import { IRootState } from '../../../types/root';

import { toggleTourState } from '../../services/actions/tour-action-creator';
import { TourTip } from './customComponents/Tourtip';
import { BEGINNER_TOUR, ADVANCED_TOUR, COMPONENT_INFO } from './utils/steps'
import { useDispatch, useSelector } from 'react-redux';
import { ITour } from '../../../types/tour';

const GETour = () => {

  const { tourState } = useSelector((state: IRootState) => state);
  const {startIndex, continuous, beginnerTour} = tourState;
  const dispatch = useDispatch();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState(beginnerTour === true ? BEGINNER_TOUR :
    (continuous === true ? ADVANCED_TOUR : COMPONENT_INFO));
  const [stepIndex, setStepIndex] = useState(startIndex);
  const [continuousTour, setContinuousTour] = useState(continuous);
  const currentTheme: ITheme = getTheme();

  useEffect(() => {
    if(continuousTour === false){console.log('The tour has only one step')}
    setRun(true);
  }, [])

  const nextHandler = (): boolean => {
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

    if(nextHandler() && step.autoNext === true){
      step.autoNext = false;
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false)
      setStepIndex(0);
      dispatch(toggleTourState({runState: false, beginnerTour: false, continuous: true, startIndex: 0}));

    }
    else if (action === 'update' && step.autoNext) {
      // eslint-disable-next-line prefer-const
      let mutationObserver : MutationObserver ;

      const mutationHandler = () => {
        if(nextHandler()){
          mutationObserver.disconnect();

          const stepIndex_ = stepIndex + 1;

          setTimeout(() => {
            setStepIndex(stepIndex_);
          }, 500);
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

      mutationHandler();
    }
    else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setStepIndex(newStepIndex);
    }
    else {
      //
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