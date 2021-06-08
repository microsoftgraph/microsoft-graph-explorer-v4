import { makeFloodgate } from '@ms-ofb/officebrowserfeedbacknpm/Floodgate';
import { getTheme, MessageBarType } from 'office-ui-fabric-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../../../appLocale';
import { authenticationWrapper } from '../../../../../modules/authentication';
import { IRootState } from '../../../../../types/root';
import { setQueryResponseStatus } from '../../../../services/actions/query-status-action-creator';
import { translateMessage } from '../../../../utils/translate-messages';
import { getVersion } from '../../../../utils/version';

export default function FeedbackForm({ activated, dismissSurvey }: any) {
    const dispatch = useDispatch();
    const [officeBrowserFeedback, setOfficeBrowserFeedback] = useState<any>(undefined);
    const currentTheme = getTheme();
    const { NODE_ENV } = process.env;
    const { profile } = useSelector((state: IRootState) => state);

    function onSurveyActivated(launcher: any, surveyItem: any) {
        return surveyItem;
    }

    const initializeFeedback = () => {
        const floodgateObject = makeFloodgate();
        loadAndInitialize(floodgateObject, onSurveyActivated).then(() => {
            setOfficeBrowserFeedback(floodgateObject);
        });
    }

    initializeFeedback();

    const showCustomSurvey = () => {
        const customSurvey: OfficeBrowserFeedback.ICustomSurvey = {
            campaignId: getCampaignId().toString(),
            commentQuestion: translateMessage('Comment question'),
            isZeroBased: false,
            promptQuestion: translateMessage('Prompt question'),
            promptNoButtonText: translateMessage('No'),
            promptYesButtonText: translateMessage('Yes'),
            ratingQuestion: translateMessage('Rating question'),
            ratingValuesAscending: [
                translateMessage('Extremely difficult'),
                translateMessage('Slightly difficult'),
                translateMessage('Neither easy nor difficult'),
                translateMessage('Slightly easy'),
                translateMessage('Extremely easy')],
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

    async function loadAndInitialize(
        floodgateObject: any,
        surveyActivated: (launcher: any, surveyItem: any) => void): Promise<void> {
        floodgateObject.initOptions = {
            appId: 2256,
            stylesUrl: ' ', // Mandatory field
            environment: (NODE_ENV === 'development') ? 1 : 0, // 0 - Prod, 1 - Int
            locale: geLocale,
            onError: (error: string) => { throw error; },
            build: getVersion(),
            primaryColour: currentTheme.palette.themePrimary,
            secondaryColour: currentTheme.palette.themeSecondary,
            telemetryGroup: {
                audienceGroup: 'Graph Explorer',
                loggableUserId: `a:${profile?.id}`,
                tenantId: authenticationWrapper.getAccount()?.tenantId,
            },
            userEmail: '',  // Replaced by the user email
            userEmailConsentDefault: false, // Should the email checkbox be checked
            customResourcesSetExternally: 2 // None = 0, Css = 1, Strings = 2, CssAndStrings = 3
        };

        floodgateObject.floodgate.initOptions = {
            surveyEnabled: true,
            onSurveyActivatedCallback: {  //callback implementation
                surveyActivated
            },
            onDismiss: (campaignId: string, submitted: string) => {
                if (submitted) {
                    dispatch(setQueryResponseStatus({
                        status: translateMessage('Submitted Successfully'),
                        statusText: translateMessage('Graph Explorer Feedback'),
                        ok: true,
                        messageType: MessageBarType.success
                    }));

                }
                dismissSurvey();
            },
        }

        // Setting the UI strings here before initialization.
        floodgateObject.setUiStrings({
            "PrivacyStatement": translateMessage('Privacy Statement'),
            "_PrivacyStatement.comment": translateMessage('Privacy Consent'),
            "Form": {
                "EmailPlaceholder": translateMessage('Email (optional)'),
                "RatingLabel": translateMessage('Rating'),
                "Submit": translateMessage('Submit'),
                "Cancel": translateMessage('Cancel'),
                "EmailCheckBoxLabel": translateMessage('You can contact me about this feedback'),
            },
            "CloseLabel": translateMessage('Close')
        });

        floodgateObject.floodgate.initialize().then(
            function () {
                floodgateObject.floodgate.start();
            },
            function (err: string) { throw err; });

        window.onfocus = function () {
            if (floodgateObject.floodgate) {
                floodgateObject.floodgate.start();
            }
        }

        window.onblur = function () {
            if (floodgateObject.floodgate) {
                floodgateObject.floodgate.stop();
            }
        }

        window.onunload = function () {
            if (floodgateObject.floodgate) {
                floodgateObject.floodgate.stop();
            }
        }

    }

    function getCampaignId(): string {
        return process.env.REACT_APP_FEEDBACK_CAMPAIGN_ID || '';
    }

    return (
        <div />
    );
}


