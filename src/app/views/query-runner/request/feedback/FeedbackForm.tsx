import { makeFloodgate } from '@ms-ofb/officebrowserfeedbacknpm/Floodgate';
import React, { useState } from 'react';
import { translateMessage } from '../../../../utils/translate-messages';
import { loadAndInitialize } from './feedbackWrapper';

export default function FeedbackForm({ activated }: any) {
    const [officeBrowserFeedback, setOfficeBrowserFeedback] = useState<any>(undefined);
    const [enableShowSurvey, setEnableShowSurvey] = useState<boolean>(false);
    const [survey, setSurvey] = useState<any>(undefined);

    const onSurveyActivated = (launcher: any, surveyItem: any) => {
        setSurvey(surveyItem);
    }

    const initializeFeedback = () => {
        const floodgateObject = makeFloodgate();
        loadAndInitialize(floodgateObject, onSurveyActivated).then(() => {
            setOfficeBrowserFeedback(floodgateObject);
            setEnableShowSurvey(true);
        });
    }

    initializeFeedback();

    const showCustomSurvey = () => {
        const customSurvey: OfficeBrowserFeedback.ICustomSurvey = {
            campaignId: 'e24778c9-85ae-499b-b424-1f3a194cd6c7',
            commentQuestion: translateMessage('commentQuestion'),
            isZeroBased: false,
            promptQuestion: translateMessage('promptQuestion'),
            promptNoButtonText: translateMessage('promptNoButtonText'),
            promptYesButtonText: translateMessage('promptYesButtonText'),
            ratingQuestion: translateMessage('ratingQuestion'),
            ratingValuesAscending: [
                translateMessage("Extremely difficult"),
                translateMessage("Slightly difficult"),
                translateMessage("Neither easy nor difficult"),
                translateMessage("Slightly easy"),
                translateMessage("Extremely easy")],
            showEmailRequest: true,
            showPrompt: false,
            surveyType: 2,
            title: translateMessage('title'),
        }

        officeBrowserFeedback.floodgate.showCustomSurvey(customSurvey).catch(
            (error: any) => { throw error; }
        );
    }

    if (activated) {
        showCustomSurvey();
    }
    return (
        <div>

        </div>
    );
}
