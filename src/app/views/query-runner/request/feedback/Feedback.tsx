import * as React from "react";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export interface FeedbackSampleProps { officeBrowserFeedback: any, showSurvey: boolean }

export class Feedback extends React.Component<FeedbackSampleProps, {}> {
    constructor(props: FeedbackSampleProps) {
        super(props);
        this._showCustomSurvey = this._showCustomSurvey.bind(this);
    }

    private async _showCustomSurvey() {
        const customSurvey: OfficeBrowserFeedback.ICustomSurvey = {
            campaignId: "10000000-0000-0000-0000-000000000000",
            commentQuestion: "commentquestion",
            isZeroBased: false,
            promptQuestion: "prompt",
            promptNoButtonText: "promptno",
            promptYesButtonText: "promptyes",
            ratingQuestion: "ratingquestion",
            ratingValuesAscending: ["rating 1", "rating 2"],
            showEmailRequest: false,
            showPrompt: false,
            surveyType: 1,
            title: "title",
        }

        this.props.officeBrowserFeedback.floodgate.showCustomSurvey(customSurvey).catch(
            (error: any) => { console.log("showCustomSurvey failed: " + error); }
        );
    }

    render() {
        return (
            <div style={{ marginBottom: "12px" }} >
                <div className="ms-font-xl" style={{ marginBottom: "8px" }}>Floodgate Sample</div>
                <div className="ms-Grid">
                    <div className="ms-Grid-row" style={{ marginBottom: "8px" }}>
                        <div className="ms-Grid-col ms-u-sm6 ms-u-lg3" style={{ textAlign: "center" }}>
                            <PrimaryButton text="Show Custom Survey" disabled={!this.props.showSurvey} onClick={() => this._showCustomSurvey()} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}