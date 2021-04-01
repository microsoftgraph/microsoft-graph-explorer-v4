// eslint-disable-next-line no-shadow
export enum OfficeBrowserFeedbackUtility {
    FloodgateAndFeedback
}

const locale: string = "en";

export async function loadAndInitialize(
    officeBrowserFeedback: any): Promise<void> {
    officeBrowserFeedback.setUiStrings({
        "FeedbackSubtitle": "Send Feedback to Microsoft",
        "_FeedbackSubtitle.comment": "Subtitle in the main feedback control",
        "PrivacyStatement": "Privacy Statement",
        "_PrivacyStatement.comment": "Text for the privacy statement link",
        "Form": {
            "CommentPlaceholder": "Please do not include any confidential or personal information in your comment",
            "_CommentPlaceholder.comment": "Placeholder text in the comment input",
            "CategoryPlaceholder": "Select a category (optional)",
            "_CategoryPlaceholder.comment": "Placeholder text for category dropdown",
            "EmailPlaceholder": "Email (optional)",
            "_EmailPlaceholder.comment": "Placeholder text in the email input",
            "RatingLabel": "Rating",
            "_RatingLabel.comment": "Label for the rating control",
            "ScreenshotLabel": "Include screenshot",
            "_ScreenshotLabel.comment": "Label for the screenshot checkbox",
            "Submit": "Submit",
            "_Submit.comment": "Button text for the submit button",
            "Cancel": "Cancel",
            "_Cancel.comment": "Button text for the cancel button",
            "EmailCheckBoxLabel": "You can contact me about this feedback",
            "_EmailCheckBox.comment": "Text for Email checkbox",
            "PrivacyConsent": "Your IT admin will be able to collect this data.",
            "_PrivacyConsent.comment": "Text shown for enterprise scenarios",
            "PrivacyLabel": "By pressing submit, your feedback will be used to improve Microsoft products and services. ",
            "_PrivacyLabel.comment": "Default privacy text",
            "ScreenshotImgAltText": "Screenshot Preview",
            "_ScreenshotImgAltText.comment": "Alternate text of screenshot preview image"
        },
        "SingleForm": {
            "Title": "Please provide feedback",
            "_Title.comment": "Single form title text"
        },
        "UserVoiceForm": {
            "Title": "Share an idea or improvement",
            "_Title.comment": "UserVoice title text",
            "Text": "Powered by UserVoice (subject to UserVoice Terms of Service and Privacy Policy)",
            "_Text.comment": "UserVoice text",
            "Button": "Go to UserVoice",
            "_Button.comment": "Text for the UserVoice button"
        },
        "SmileForm": {
            "Anchor": "I like something",
            "_Anchor.comment": "Text for the smile feedback anchor",
            "Title": "What did you like?",
            "_Title.comment": "Title for smile feedback"
        },
        "FrownForm": {
            "Anchor": "I don't like something",
            "_Anchor.comment": "Text for the frown feedback anchor",
            "Title": "What did you not like?",
            "_Title.comment": "Title for frown feedback"
        },
        "IdeaForm": {
            "Anchor": "I have a suggestion",
            "_Anchor.comment": "Text for the idea feedback anchor",
            "Title": "What do you suggest?",
            "_Title.comment": "Title for idea feedback"
        },
        "BugForm": {
            "Anchor": "File a bug",
            "_Anchor.comment": "Text for the bug feedback anchor",
            "Title": "What is the bug?",
            "_Title.comment": "Title for bug feedback"
        },
        "ThanksPanel": {
            "Title": "Thank you!",
            "_Title.comment": "Text for the thanks anchor",
            "AppreciateText": "We appreciate your feedback. Your comments will help us improve.",
            "_AppreciateText.comment": "Paragraph text for Thanks form",
            "Close": "Close",
            "_Close.comment": "Button text to close the OCV panel"
        },
        "Floodgate": {
            "Nps": {
                "Prompt": {
                    "Title": "We'd love your feedback!",
                    "_Title.comment": "Pop-up title bar text to display when asking for participation in an NPS survey",
                    "Question": "We have just two questions for you.",
                    "_Question.comment": "Pop-up dialog text when asking for participation in an NPS survey",
                    "Yes": "Sure",
                    "_Yes.comment": "Text for the Yes button label in the NPS Prompt dialog",
                    "No": "Not now",
                    "_No.comment": "Text for the No button label in the NPS Prompt dialog"
                },
                "Comment": {
                    "Question": "Please tell us more. Why did you choose that answer?",
                    "_Question.comment": "Follow-up NPS question, asking for a free-form text response"
                },
                "Rating": {
                    "Question": "How likely are you to recommend this site to a friend or colleague?",
                    "_Question.comment": "The main NPS question. Neutral phrasing here is very important - please select verbiage to convey the same neutral tone of asking the user the likelihood of them recommending this site to their friend or colleague. Expected response is a selection from a rating chooser.",
                    "Points11Value0": "0 - Not at all likely",
                    "_Points11Value0.comment": "Please leave arabic numerals unlocalized. The worst NPS rating, on a scale from 0-10",
                    "Points11Value1": "1",
                    "_Points11Value1.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value2": "2",
                    "_Points11Value2.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value3": "3",
                    "_Points11Value3.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value4": "4",
                    "_Points11Value4.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value5": "5",
                    "_Points11Value5.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value6": "6",
                    "_Points11Value6.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value7": "7",
                    "_Points11Value7.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value8": "8",
                    "_Points11Value8.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value9": "9",
                    "_Points11Value9.comment": "Please leave arabic numerals unlocalized.",
                    "Points11Value10": "10 - Extremely likely",
                    "_Points11Value10.comment": "Please leave arabic numerals unlocalized. The best NPS rating, on a scale from 0-10",
                    "Points5Value1": "1 - Not at all likely",
                    "_Points5Value1.comment": "Please leave arabic numerals unlocalized. The worst NPS rating, on a scale from 1-5",
                    "Points5Value2": "2",
                    "_Points5Value2.comment": "Please leave arabic numerals unlocalized.",
                    "Points5Value3": "3",
                    "_Points5Value3.comment": "Please leave arabic numerals unlocalized.",
                    "Points5Value4": "4",
                    "_Points5Value4.comment": "Please leave arabic numerals unlocalized.",
                    "Points5Value5": "5 - Extremely likely",
                    "_Points5Value5.comment": "Please leave arabic numerals unlocalized. The best NPS rating, on a scale from 1-5"
                }
            }
        },
        "CloseLabel": "Close",
        "_CloseLabel.comment": "Label for a button to close the sdk"
    });

    officeBrowserFeedback.initOptions = {
        appId: 1234, // Replace by your own app id
        stylesUrl: "styles/officebrowserfeedback.css", // Replace by where you have hosted the .css
        intlUrl: "intl/", // Replace by where you have hosted the intl files.
        environment: 1, // 0 - Prod, 1 - Int
        locale,
        onError: (error: string) => { console.log("SDK encountered an error: " + error); },
        primaryColour: "#008272", // Replace by a colour which goes with your website.
        secondaryColour: "#004B50",// Replace by a colour which goes with your website.
    };

    officeBrowserFeedback.floodgate.initOptions = {
        autoDismiss: 2, // fourteen seconds
        //campaignDefinitions: CampaignDefinitions,
        onDismiss: (campaignId: string, submitted: string) => {
            console.log("Floodgate survey dismissed. campaignId: " + campaignId + ", submitted: " + submitted);
        },
    }

    officeBrowserFeedback.floodgate.initialize().then(
        function () {
            console.log('initialize suceeded');

            officeBrowserFeedback.floodgate.start();
        },
        function (err: string) { console.log('start failed with error: ' + err); });

}
