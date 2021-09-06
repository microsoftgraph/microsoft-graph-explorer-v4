const CampaignDefinitions: any[] = [{
    "CampaignId": "6f37e1b1-e1cb-47bd-9675-5a539fcbe576", //TODO: save as env variable
    "StartTimeUtc": "2018-01-01T00:00:00Z",
    "EndTimeUtc": null,
    "GovernedChannelType": 1, //TODO: change to 0, 1 is for testing purposes only
    //"AdditionalDataRequested": ["EmailAddress"],
    "Scope":
    {
        "Type": 0
    },
    "NominationScheme": {
        "Type": 0,
        "PercentageNumerator": 100,
        "PercentageDenominator": 100,
        "NominationPeriod": { "Type": 0, "IntervalSeconds": 120 }, //2592000
        "CooldownPeriod": { "Type": 0, "IntervalSeconds": 240 }, //7776000
        "FallbackSurveyDurationSeconds": 120
    },
    "SurveyTemplate": {
        "Type": 0,
        "ActivationEvent": {
            'Type': 1,
            'Sequence': [
                {
                    'Type': 0,
                    'Activity': 'AppUsageTime',
                    'IsAggregate': true,
                    'Count': 5 // @todo: undo to 120
                },
                {
                    'Type': 0,
                    'Activity': 'AppResume',
                    'IsAggregate': true,
                    'Count': 1
                }
            ]
        }
    }
}];

export default CampaignDefinitions;