
// export enum OfficeBrowserFeedbackUtility {
//     FloodgateAndFeedback,
//     FloodgateWithUI,
//     FloodgateWithoutUI
// }

export async function loadAndInitialize(
    officeBrowserFeedback: any,
    onSurveyActivated: (launcher: any, survey: any) => void): Promise<void> {

    // Get locale
    // const locale: string = document.documentElement.getAttribute("lang") ? document.documentElement.getAttribute("lang") : "en";

    officeBrowserFeedback.initOptions = {
        appId: 1234, // Replace by your own app id
        stylesUrl: "styles/officebrowserfeedback.css", // Replace by where you have hosted the .css
        intlUrl: "intl/", // Replace by where you have hosted the intl files.
        environment: 1, // 0 - Prod, 1 - Int
        locale: 'en',
        onError: (error: string) => { console.log("SDK encountered an error: " + error); },
        primaryColour: "#008272", // Replace by a colour which goes with your website.
        secondaryColour: "#004B50",// Replace by a colour which goes with your website.
        applicationGroup: {
            appData: "{\"AppData1\":\"AppData1 Value\", \"AppData2\":\"AppData2 Value\"}"
        },
        telemetryGroup: {
            audienceGroup: "TestAudienceGroup",
        },
        userVoice: {
            url: "http://bing.com"
        }
    };
}


const uiStringMap: any = {
    en: {
        FPS_Prompt_Title: "We'd love your feedback on Excel co-authoring!",
        FPS_Prompt_Question: "We have just two questions.",
        FPS_Prompt_YesLabel: "Sure",
        FPS_Prompt_NoLabel: "Not Now",
        FPS_Rating_Question: "Please rate your experience.",
        FPS_Rating_Values_1: "1 - Poor",
        FPS_Rating_Values_2: "2",
        FPS_Rating_Values_3: "3",
        FPS_Rating_Values_4: "4",
        FPS_Rating_Values_5: "5 - Great",
        FPS_Question_Question: "Please describe how we can make Excel co-authoring better for you."
    },
    de: {
        FPS_Prompt_Title: "Wir freuen uns über Ihr Feedback zu Excel Co-Authoring!",
        FPS_Prompt_Question: "Wir haben nur zwei Fragen.",
        FPS_Prompt_YesLabel: "Sicher",
        FPS_Prompt_NoLabel: "Nicht jetzt",
        FPS_Rating_Question: "Bitte bewerten Sie Ihre Erfahrungen.",
        FPS_Rating_Values_1: "1 - Arm",
        FPS_Rating_Values_2: "2",
        FPS_Rating_Values_3: "3",
        FPS_Rating_Values_4: "4",
        FPS_Rating_Values_5: "5 - Groß",
        FPS_Question_Question: "Bitte beschreiben Sie, wie wir Excel Co-Authoring besser für Sie machen können."
    }
}