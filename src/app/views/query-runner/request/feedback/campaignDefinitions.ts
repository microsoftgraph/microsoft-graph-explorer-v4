const { NODE_ENV } = process.env;

const CampaignDefinitions: object[] = [{
  'CampaignId': getCampaignId().toString(),
  'StartTimeUtc': '2017-01-01T00:00:00Z',
  'EndTimeUtc': null,
  'GovernedChannelType': 0,
  'AdditionalDataRequested': ['EmailAddress'],
  'Scope':
    {
      'Type': 0
    },
  'NominationScheme':
    {
      'Type': 0,
      'PercentageNumerator': 100,
      'PercentageDenominator': 100,
      'NominationPeriod':
        {
          'Type': 0,
          'IntervalSeconds':(NODE_ENV === 'development') ? 120 : process.env.REACT_APP_NOMINATION_PERIOD
        },
      'CooldownPeriod':
        {
          'Type': 0,
          'IntervalSeconds': (NODE_ENV === 'development') ? 240 : process.env.REACT_APP_COOLDOWN_PERIOD
        },
      'FallbackSurveyDurationSeconds': 120
    },
  'SurveyTemplate':
    {
      'Type': 4,
      'ActivationEvent':
        {
          'Type': 1,
          'Sequence':
                [{
                  'Type': 0,
                  'Activity': 'AppUsageTime',
                  'Count': (NODE_ENV === 'development') ? 60 : process.env.REACT_APP_USAGE_TIME, //in seconds
                  'IsAggregate': true
                },
                {
                  'Type': 0,
                  'Activity': 'AppResume',
                  'Count': 1,
                  'IsAggregate': false
                }
                ]
        },
      'Content': {
        Prompt: {
          Title: 'Prompt_Title',
          Question: 'Prompt_Question',
          YesLabel: 'Prompt_YesLabel',
          NoLabel: 'Prompt_NoLabel'
        },
        Rating: {
          Question: 'Graph_Explorer_Rating_Question',
          RatingValuesAscending: [
            'Rating_Values_1',
            'Rating_Values_2',
            'Rating_Values_3',
            'Rating_Values_4',
            'Rating_Values_5',
            'Rating_Values_6',
            'Rating_Values_7',
            'Rating_Values_8',
            'Rating_Values_9',
            'Rating_Values_10'
          ]
        },
        Question: {
          Question: 'Question_Question'
        }
      }
    }
}];

export default CampaignDefinitions;

function getCampaignId(): string {
  return process.env.REACT_APP_NPS_FEEDBACK_CAMPAIGN_ID || '';
}