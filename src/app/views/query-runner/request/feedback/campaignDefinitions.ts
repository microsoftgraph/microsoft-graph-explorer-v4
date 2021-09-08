const CampaignDefinitions: object[] = [{
    "CampaignId": "6f37e1b1-e1cb-47bd-9675-5a539fcbe576", //TODO: save as env variable 6f37e1b1-e1cb-47bd-9675-5a539fcbe576
    "StartTimeUtc": "2017-01-01T00:00:00Z",
    "EndTimeUtc": null,
    "GovernedChannelType": 0, //TODO: change to 0, 1 is for testing purposes only
    "AdditionalDataRequested": ["EmailAddress"],
    "Scope":
    {
        "Type": 0
    },
    "NominationScheme":
    {
        "Type": 0,
        "PercentageNumerator": 100,
        "PercentageDenominator": 100,
        "NominationPeriod":
        {
            "Type": 0,
            "IntervalSeconds": 120
        }, //2592000
        "CooldownPeriod":
        {
            "Type": 0,
            "IntervalSeconds": 240
        }, //7776000
        "FallbackSurveyDurationSeconds": 120
    },
    "SurveyTemplate":
    {
        "Type": 4,
        "ActivationEvent":
        {
            "Type": 1,
            "Sequence":
                [{
                    "Type": 0,
                    "Activity": "AppUsageTime",
                    "Count": 60, // @todo: undo to 120
                    "IsAggregate": true
                },
                {
                    "Type": 0,
                    "Activity": "AppResume",
                    "Count": 1,
                    "IsAggregate": false,
                }
                ]
        },
        "Content": {
            Prompt: {
                Title: "Prompt_Title",
                Question: "Prompt_Question",
                YesLabel: "Prompt_YesLabel",
                NoLabel: "Prompt_NoLabel",
            },
            Rating: {
                Question: "Graph_Explorer_Rating_Question",
                RatingValuesAscending: [
                    "Rating_Values_1",
                    "Rating_Values_2",
                    "Rating_Values_3",
                    "Rating_Values_4",
                    "Rating_Values_5",
                    "Rating_Values_6",
                    "Rating_Values_7",
                    "Rating_Values_8",
                    "Rating_Values_9",
                    "Rating_Values_10"
                ],
            },
            Question: {
                Question: "Question_Question",
            },
        }
    }
}];

export default CampaignDefinitions;