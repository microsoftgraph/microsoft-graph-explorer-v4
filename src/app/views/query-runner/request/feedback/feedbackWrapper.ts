import '@ms-ofb/officebrowserfeedbacknpm/intl/en/officebrowserfeedbackstrings';
import { getTheme } from 'office-ui-fabric-react';
import { geLocale } from '../../../../../../src/appLocale';

const currentTheme = getTheme();

export async function loadAndInitialize(
    officeBrowserFeedback: any,
    onSurveyActivated: (launcher: any, survey: any) => void): Promise<void> {
    officeBrowserFeedback.initOptions = {
        appId: 2256,
        stylesUrl: ' ', // Mandatory field
        intlUrl: '', // Mandatory field
        environment: 1, // 0 - Prod, 1 - Int
        locale: geLocale,
        onError: (error: string) => { throw error; },
        primaryColour: currentTheme.palette.themePrimary,
        secondaryColour: currentTheme.palette.themeSecondary,
        telemetryGroup: {
            audienceGroup: "TestAudienceGroup",
        },
        userEmail: "test@test.com",  // Replace by the user email
        userEmailConsentDefault: false, // Should the email checkbox be checked
    };

    officeBrowserFeedback.floodgate.initOptions = {
        onDismiss: (campaignId: string, submitted: string) => {
            console.log("Floodgate survey dismissed. campaignId: " + campaignId + ", submitted: " + submitted);
        },
        surveyEnabled: true,
        onSurveyActivatedCallback: {  //callback implementation
            onSurveyActivated
        },
    }

    officeBrowserFeedback.floodgate.initialize().then(
        function () {
            officeBrowserFeedback.floodgate.start();
        },
        function (err: string) { throw err; });

}

