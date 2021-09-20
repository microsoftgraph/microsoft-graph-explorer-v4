import { makeFloodgate } from '@ms-ofb/officebrowserfeedbacknpm/Floodgate';
import { AuthenticationType } from '@ms-ofb/officebrowserfeedbacknpm/scripts/app/Configuration/IInitOptions';
import { OfficeBrowserFeedback } from '@ms-ofb/officebrowserfeedbacknpm/scripts/app/Window/Window';
import { getTheme, MessageBarType } from 'office-ui-fabric-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../../../appLocale';
import { authenticationWrapper } from '../../../../../modules/authentication';
import { IRootState } from '../../../../../types/root';
import { setQueryResponseStatus } from '../../../../services/actions/query-status-action-creator';
import { ACCOUNT_TYPE } from '../../../../services/graph-constants';
import { translateMessage } from '../../../../utils/translate-messages';
import { getVersion } from '../../../../utils/version';
import CampaignDefinitions from './campaignDefinitions';

export default function FeedbackForm({ activated, dismissSurvey }: any) {
    const dispatch = useDispatch();
    const [officeBrowserFeedback, setOfficeBrowserFeedback] = useState<any>(undefined);
    const currentTheme = getTheme();
    const { NODE_ENV } = process.env;
    const { profile, authToken } = useSelector((state: IRootState) => state);

    function surveyActivated(launcher: any, surveyItem: any) {
        return surveyItem;
    }

    const initializeFeedback = () => {
        const floodgateObject: OfficeBrowserFeedback = makeFloodgate();
        loadAndInitialize(floodgateObject, surveyActivated).then(() => {
            setOfficeBrowserFeedback(floodgateObject);
        });
    }
    if (!authToken.token) {
        initializeFeedback();
    }

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSurveyActivated: (launcher: any, surveyItem: any) => void): Promise<void> {
        floodgateObject.initOptions = {
            appId: 2256,
            stylesUrl: ' ', // Mandatory field
            environment: (NODE_ENV === 'development') ? 1 : 0, // 0 - Prod, 1 - Int
            ageGroup: profile?.ageGroup,
            authenticationType: getAuthType(profile?.profileType!),
            locale: geLocale,
            onError: (error: string) => { throw error; },
            build: getVersion().toString(),
            primaryColour: currentTheme.palette.themePrimary,
            secondaryColour: currentTheme.palette.themeSecondary,
            telemetryGroup: {
                audienceGroup: 'Graph Explorer',
                // loggableUserId: `a:${profile?.id}`,
                tenantId: authenticationWrapper.getAccount()?.tenantId,
            },
            userEmail: ' ',  // Replaced by the user email
            userEmailConsentDefault: false, // Should the email checkbox be checked
            customResourcesSetExternally: 2 // None = 0, Css = 1, Strings = 2, CssAndStrings = 3
        };

        floodgateObject.floodgate.initOptions = {
            autoDismiss: 2,
            campaignDefinitions: CampaignDefinitions,
            surveyEnabled: true,
            // onSurveyActivatedCallback: {  //callback implementation
            //     onSurveyActivated
            // },
            onDismiss: (campaignId: string, submitted: boolean) => {
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
            uIStringGetter: (str: string) => { return uiStringMap[str]; }
        };


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
                setEvents();
            },
            function (err: string) { throw err; });

        function setEvents() {
            window.onload = function () {
                if (floodgateObject.floodgate) {
                    floodgateObject.floodgate.start();
                    floodgateObject.floodgate.getEngine().getActivityListener().logActivity('OnPageLoad');
                    floodgateObject.floodgate.getEngine().getActivityListener().logActivityStartTime('AppUsageTime');

                }
            }
            window.onfocus = function () {
                if (floodgateObject.floodgate) {
                    floodgateObject.floodgate.start();
                    floodgateObject.floodgate.getEngine().getActivityListener().logActivityStartTime('AppUsageTime');
                    floodgateObject.floodgate.getEngine().getActivityListener().logActivity('AppResume');
                }
            }

            window.onblur = function () {
                if (floodgateObject.floodgate) {
                    floodgateObject.floodgate.getEngine().getActivityListener().logActivityStopTime('AppUsageTime');
                    floodgateObject.floodgate.stop();
                }
            }
            window.onunload = function () {
                if (officeBrowserFeedback.floodgate) {
                    officeBrowserFeedback.floodgate.getEngine().getActivityListener().logActivityStopTime('AppUsageTime');
                    officeBrowserFeedback.floodgate.stop();
                }
            }
        }
    }

    const uiStringMap: any = {
        Prompt_Title: "We'd love your feedback!",
        Prompt_Question: "We have just two questions.",
        Prompt_YesLabel: "Sure",
        Prompt_NoLabel: "Not Now",
        Graph_Explorer_Rating_Question: "How likely are you to recommend Microsoft Graph for development to another developer?",
        Rating_Values_1: "1 - Not at all likely",
        Rating_Values_2: "2",
        Rating_Values_3: "3",
        Rating_Values_4: "4",
        Rating_Values_5: "5",
        Rating_Values_6: "6",
        Rating_Values_7: "7",
        Rating_Values_8: "8",
        Rating_Values_9: "9",
        Rating_Values_10: "10 - Extremely likely",
        Question_Question: "Please tell us more. Why did you choose that answer?"
    }

    function getCampaignId(): string {
        return process.env.REACT_APP_FEEDBACK_CAMPAIGN_ID || '';
    }

    return (
        <div />
    );

    function getAuthType(profileType: ACCOUNT_TYPE) {
        return AuthenticationType[ACCOUNT_TYPE[profileType] as keyof typeof AuthenticationType];

    }

}



