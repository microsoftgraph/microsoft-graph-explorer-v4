import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { ITourSteps, ITourTooltipRenderProps } from './utils/types'
import { getTheme, ITheme } from '@fluentui/react';
import { IRootState } from '../../../types/root';

import { toggleTourState } from '../../services/actions/tour-action-creator';
import { TourTip } from './customComponents/Tourtip';
import { beaconComponent } from './customComponents/Beacon';
import { BEGINNER_TOUR, ADVANCED_TOUR, SAMPLE_TOUR } from './utils/steps'
import { useDispatch, useSelector } from 'react-redux';

//if a user is signed in, already, move to the next step, don't stay here, move on to the sample queries area.
//after clicking on a sample query, listen for the onClick
//and move to the response preview area to show them some results
// when pivot items are clicked, proceed to the actual area and show it since the expected classname is now available
interface ITourState {
  run: boolean;
  steps: ITourSteps[];
  stepIndex: number;
  tourComplete: boolean;
  hideDialog: boolean;
}

const GETour = () => {

  const { tourState } = useSelector((state: IRootState) => state);
  const dispatch = useDispatch();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState(tourState.beginnerTour === true ? BEGINNER_TOUR : ADVANCED_TOUR);
  const [stepIndex, setStepIndex] = useState(0);
  const currentTheme: ITheme = getTheme();
  const stepLength = steps.length-1;

  useEffect(() => {
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
    const targetToUse = step.target;

    console.log('Here is the type ', type);

    if(nextHandler() && step.autoNext === true){
      step.autoNext = false;
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      console.log('TOur is finished. Cleaning up');
      setRun(false)
      setStepIndex(0);
      dispatch(toggleTourState({runState: false, beginnerTour: false}));

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
      if (action === ACTIONS.PREV) {
        ///step.autoNext = false;
      }
      //if user is authenticated already, show the first one for some time.
      //Check if authenticated flag is available in App.tsx
      console.log('Running this inside EVENTS.STEPAFTER ');
      setStepIndex(newStepIndex);
    }
    else {
      //do manothing

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

            />
        </>
  )
}


export default GETour;