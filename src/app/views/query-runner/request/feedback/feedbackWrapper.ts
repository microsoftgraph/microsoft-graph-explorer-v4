const locale: string = "en";

export async function loadAndInitialize(
    officeBrowserFeedback: any): Promise<void> {
    officeBrowserFeedback.setUiStrings({
        "FeedbackSubtitle": "Send Feedback to Graph Explorer",
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
        "CloseLabel": "Close",
        "_CloseLabel.comment": "Label for a button to close the sdk"
    });

    officeBrowserFeedback.initOptions = {
        appId: 2256, // Replace by your own app id
        stylesUrl: " ", // Replace by where you have hosted the .css
        intlUrl: "intl/", // Replace by where you have hosted the intl files.
        environment: 1, // 0 - Prod, 1 - Int
        locale,
        onError: (error: string) => { throw error; },
        primaryColour: "#0078d4",
        secondaryColour: "#2b88d8",
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
    }

    officeBrowserFeedback.floodgate.initialize().then(
        function () {
            officeBrowserFeedback.floodgate.start();
        },
        function (err: string) { throw err; });

}

