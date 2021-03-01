import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric'
import { loadAndInitialize } from './feedbackWrapper';
import { PrimaryButton } from 'office-ui-fabric-react';
import { makeFloodgateFeedback } from '@ms-ofb/officebrowserfeedbacknpm';

interface IFeedbackState {
    officeBrowserFeedback: any;
    enableFeedback: boolean,
    survey: any
}

class Feedback extends React.Component<{}, IFeedbackState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            officeBrowserFeedback: undefined,
            enableFeedback: true,
            survey: undefined,
        }
        this.onSurveyActivated = this.onSurveyActivated.bind(this);

    }


    async setOfficeBrowserFeedbackUtility() {
        const floodgateObject = makeFloodgateFeedback();
        loadAndInitialize(floodgateObject, this.onSurveyActivated).then(() => {
            this.setState({
                officeBrowserFeedback: floodgateObject,
            })
        });
    }

    // async getFloodgateObject() {
    //     // This is example to include all the Floodgate type so it's using the dynamic import
    //     // However, in the real application, app just need to call import directly at the top
    //     //  and call approriate make function later to get the desired object

    //     return officeBrowserFeedback;
    // }
    onSurveyActivated(launcher: any, survey: any) {
        this.setState({ survey });
    }

    render() {
        return (
            <Fabric>
                <PrimaryButton id="MFeedback_Button" text="Multi-Feedback" onClick={
                    () => this.state.officeBrowserFeedback.multiFeedback()
                        .catch((error: any) => { console.log("Multi feedback failed: " + error); })
                } />
            </Fabric>
        )
    }
}

export default Feedback;