import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step, BeaconRenderProps, TooltipRenderProps } from 'react-joyride';
import { TeachingBubble, Coachmark, IButtonProps, PrimaryButton } from '@fluentui/react';


//if a user is signed in, don't stay here, move on to the sample queries area.
//after clicking on a sample query, listen for the onClick and move to the response preview area to show them some results
interface ITourState {
  run: boolean;
  steps: Step[];
  stepIndex: number;
}

//describe how this looks later
const TOUR_STEPS : any = [
    {
        target: ".sign-in-section",
        content: (<div>Sign in with a microsoft account or leave it as it is :)</div>),
        disableBeacon: true,
        spotlightClicks: true,
        placement:'right-end'

    },
    {
        target: ".sample-queries-navigation",
        content: (<div>Here are sample queries you can run to get data from Graph API. Try the first one to see some results :)</div>),
        placement:'right-start',
        spotlightClicks: true,

    },
    {
        target: ".response-preview-area",
        content: (<div>Here is a response from Graph API of the query you just run :)</div>),
        placement: 'top-start',
        spotlightClicks: true,
    },
    {
        target: ".query-response",
        content: "This is the query response area"
    },
    {
        target: ".status-area",
        content: "This is the status area"
    }
]

const GETour = () => {
    const [ run, setRun ] = useState(false);
    const [ stepIndex, setStepIndex ] = useState(0);
    const [ tourSteps, setTourSteps ] = useState([])

    useEffect( () => {
        setRun(!run);
        setTourSteps(TOUR_STEPS);

    },[])

    const handleJoyrideCallback = (data: CallBackProps) =>{
        console.log("Handling things...");

    }

    const BeaconComponent = () => {
        return(
            <Coachmark target={null}>
                <div>Beacon</div>
            </Coachmark>
        )
    }
    const PrimaryButtonProps = (props: any) => (
        <PrimaryButton
            {...props}
            text="Skip"
        >
        </PrimaryButton>
    )
    const SecondaryButtonProps = (props: any) => (
        <PrimaryButton {...props}
            text='Next'
        >
        </PrimaryButton>
    )

    // eslint-disable-next-line react/display-name
    const TooltipComponent = (): any => ({
        continuous,
        index,
        step,
        backProps,
        closeProps,
        primaryProps,
        tooltipProps,
        } : TooltipRenderProps) => (
            <TeachingBubble {...tooltipProps}
                primaryButtonProps={PrimaryButtonProps(primaryProps)}
                secondaryButtonProps={SecondaryButtonProps(backProps)}
                headline='Ok'
            >
                {step.content}
            </TeachingBubble>
        )

    return(
        <>
            <Joyride
                steps={tourSteps}
                continuous={true}
                showSkipButton={true}
                scrollToFirstStep={true}
                showProgress={true}
                callback={handleJoyrideCallback}
                // tooltipComponent={TooltipComponent}
                />
        </>
    )
}
export default GETour;
