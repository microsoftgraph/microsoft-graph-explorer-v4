import React from 'react';
import Joyride from 'react-joyride';

const tourSteps = [
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
    console.log("running the tour");

    return(
        <>
            <Joyride steps={tourSteps} continuous={true} showSkipButton={true} />
        </>
    )
}
export default GETour;
