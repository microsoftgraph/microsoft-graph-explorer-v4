import React, { useState, useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { ITourSteps } from './tourUtils/types'
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton} from '@fluentui/react';
import { IRootState } from '../../../types/root';

import { toggleTourState } from '../../services/actions/tour-action-creator';
import { tooltip } from './customComponents/tooltipComponent';
import { beaconComponent } from './customComponents/beaconComponent';
import { BEGINNER_TOUR, ADVANCED_TOUR, SAMPLE_TOUR } from './tourUtils/tourSteps'
import { useDispatch, useSelector } from 'react-redux';

//if a user is signed in, already, move to the next step, don't stay here, move on to the sample queries area.
//after clicking on a sample query, listen for the onClick and move to the response preview area to show them some results
// when pivot items are clicked, proceed to the actual area and show it since the expected classname is now available
interface ITourState {
  run: boolean;
  steps: ITourSteps[];
  stepIndex: number;
  tourComplete: boolean;
  hideDialog: boolean;
}

const GETour = (props? : any) => {

    const dispatch = useDispatch();
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState(BEGINNER_TOUR);
    const [stepIndex, setStepIndex] = useState(0);
    const [hideDialog, setHideDialog] = useState(true);
    const [tourComplete, setTourComplete] = useState(false);



    useEffect(() => {
        console.log("It changed again to ", tourComplete, ' and dialog is ', hideDialog);
    },[tourComplete, hideDialog]);


    useEffect(() => {
        setRun(true);
    },[])

    const handleJoyrideCallback = (data: CallBackProps) =>{

        const { action, index, type, status } = data;
        const step : ITourSteps = data.step
        console.log(step);

        if( ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status) ){
            console.log("TOur is finished. Cleaning up");
            setRun(false)
            setStepIndex(0);

            if(steps !== ADVANCED_TOUR){
                setTourComplete(true);
                setHideDialog(false);
            }else{
                dispatch(toggleTourState(false));
            }

        }
        else if(action === 'update' && step.autoNext){
            const nextStep : ITourSteps = steps[index + 1];  //gets the next step

            const nextHandler = (): boolean => {
                if(nextStep.target instanceof HTMLElement){
                    return true;
                }
                const selector = nextStep.target;
                return document.querySelector(selector) != null;
            }
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
        else if(([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type) ){
            const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
            if(action === ACTIONS.PREV){
                ///step.autoNext = false;
            }
            //if user is authenticated already, show the first one for some time.
            //Check if authenticated flag is available in App.tsx
            console.log('Running this inside EVENTS.STEPAFTER ');
            setStepIndex(newStepIndex);
        }
        else{
            //do manothing

        }
    }
    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Tour Type',
        closeButtonAriaLabel: 'Close',
        subText: 'Do you want to view a more advanced tour?',
    };
    const dialogStyles = { main: { maxWidth: 450 } };

    const setYes = () => {

        if(steps === ADVANCED_TOUR){
            setTourComplete(false);
            setHideDialog(true);
            dispatch(toggleTourState(false));
        }
        else{
            console.log('Setting new touur');
            setStepIndex(0);
            setTourComplete(false);
            setSteps(ADVANCED_TOUR);
            setHideDialog(true);
            setRun(true);
        }

    }

    const setNo = () => {
        setTourComplete(false);
        setHideDialog(true);
        dispatch(toggleTourState(false));
    }

    return(
        <>
            <Joyride
                steps={steps}
                run={run}
                continuous={true}
                showSkipButton={true}
                showProgress={true}
                callback={(data) => handleJoyrideCallback(data)}
                styles={{
                    tooltipContainer: {
                        textAlign: "left"
                    },
                    buttonNext: {
                        backgroundColor: "blue"
                    },
                    buttonBack: {
                        marginRight: 10
                    }
                }}
                locale={{
                    last: 'End Tour',
                    skip: "Close Tour"
                }}
                stepIndex={stepIndex}
                tooltipComponent={tooltip}
                debug={true}
                floaterProps={{hideArrow : true}}
            />
            {tourComplete === true &&
                <Dialog dialogContentProps={dialogContentProps} hidden={hideDialog}  >
                    <DialogFooter>
                        <DefaultButton text="No" onClick={setNo} />
                        <PrimaryButton text="Yes" onClick={setYes} />
                    </DialogFooter>
                </Dialog>
            }

        </>
    )
}


export default GETour;

