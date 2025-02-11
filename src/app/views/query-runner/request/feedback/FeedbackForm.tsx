import { getTheme } from '@fluentui/react';
import { makeFloodgate } from '@ms-ofb/officebrowserfeedbacknpm/Floodgate';
import { AuthenticationType } from '@ms-ofb/officebrowserfeedbacknpm/scripts/app/Configuration/IInitOptions';
import { OfficeBrowserFeedback } from '@ms-ofb/officebrowserfeedbacknpm/scripts/app/Window/Window';
import { useEffect, useState } from 'react';

import { authenticationWrapper } from '../../../../../modules/authentication';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, telemetry } from '../../../../../telemetry';
import { ACCOUNT_TYPE } from '../../../../services/graph-constants';
import { setQueryResponseStatus } from '../../../../services/slices/query-status.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { getVersion } from '../../../../utils/version';
import CampaignDefinitions from './campaignDefinitions';
import { uiStringMap } from './uiStrings';

export default function FeedbackForm({ activated, onDismissSurvey, onDisableSurvey }: any) {
  const dispatch = useAppDispatch();
  const [officeBrowserFeedback, setOfficeBrowserFeedback] = useState<any>(undefined);
  const currentTheme = getTheme();
  const { NODE_ENV } = process.env;
  const user = useAppSelector((state) => state.profile.user);

  function surveyActivated(launcher: any, surveyItem: any) {
    return surveyItem;
  }

  const initializeFeedback = () => {
    const floodgateObject: OfficeBrowserFeedback = makeFloodgate();
    loadAndInitialize(floodgateObject, surveyActivated).then(() => {
      setOfficeBrowserFeedback(floodgateObject);
    });
  }

  useEffect(() => {
    initializeFeedback();
  }, []);

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
      title: translateMessage('title')
    }
    if(officeBrowserFeedback){
      officeBrowserFeedback.floodgate.showCustomSurvey(customSurvey).catch(
        (error: any) => {
          onDisableSurvey();
          throw error; }
      );
    }
  }

  if (activated) {
    showCustomSurvey();
  }


  async function loadAndInitialize(
    floodgateObject: any,
    // eslint-disable-next-line no-unused-vars
    _onSurveyActivated: (launcher: any, surveyItem: any) => void): Promise<void> {
    floodgateObject.initOptions = {
      appId: 2256,
      stylesUrl: ' ', // Mandatory field
      environment: (NODE_ENV === 'development') ? 1 : 0, // 0 - Prod, 1 - Int
      ageGroup: user?.ageGroup,
      authenticationType: getAuthType(user?.profileType!),
      onError: (error: string): string => { throw error; },
      build: getVersion().toString(),
      primaryColour: currentTheme.palette.themePrimary,
      secondaryColour: currentTheme.palette.themeSecondary,
      telemetryGroup: {
        audienceGroup: 'Graph Explorer',
        // loggableUserId: `a:${profile?.id}`,
        tenantId: authenticationWrapper.getAccount()?.tenantId
      },
      userEmail: ' ',  // Replaced by the user email
      userEmailConsentDefault: false, // Should the email checkbox be checked
      emailPolicyValue: 0, // NotConfigured = 0, Enabled = 1, Disabled = 2
      screenshotPolicyValue: 0,
      customResourcesSetExternally: 2 // None = 0, Css = 1, Strings = 2, CssAndStrings = 3
    };

    floodgateObject.floodgate.initOptions = {
      autoDismiss: 2,
      campaignDefinitions: CampaignDefinitions,
      showEmailAddress: true,
      surveyEnabled: (user?.profileType !== ACCOUNT_TYPE.AAD),
      onDismiss: (campaignId: string, submitted: boolean) => {
        const SecondsBeforePopup = getSecondsBeforePopup(floodgateObject.floodgate.getEngine()
          .previousSurveyEventActivityStats);
        const telemetryData = { SecondsBeforePopup, IsSubmitted: false };
        if (submitted) {
          dispatch(setQueryResponseStatus({
            status: translateMessage('Submitted Successfully'),
            statusText: translateMessage('Graph Explorer Feedback'),
            ok: true,
            messageBarType: 'success'
          }));
          trackSurveyPopup({...telemetryData, IsSubmitted: true}, campaignId);
        }
        else{
          trackSurveyPopup(telemetryData, campaignId);
        }
        onDismissSurvey();
      },
      uIStringGetter: (str: string): any => { return uiStringMap[str]; }
    };


    // Setting the UI strings here before initialization.
    floodgateObject.setUiStrings({
      'PrivacyStatement': translateMessage('Privacy Statement'),
      '_PrivacyStatement.comment': translateMessage('Privacy Consent'),
      'Form': {
        'EmailPlaceholder': translateMessage('Email (optional)'),
        'RatingLabel': translateMessage('Rating'),
        'Submit': translateMessage('Submit'),
        'Cancel': translateMessage('Cancel'),
        'EmailCheckBoxLabel': translateMessage('You can contact me about this feedback')
      },
      'CloseLabel': translateMessage('Close')
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

  const trackSurveyPopup = (telemetryData: any, campaignId: string) => {
    if(campaignId === process.env.REACT_APP_NPS_FEEDBACK_CAMPAIGN_ID){
      telemetry.trackWindowOpenEvent(componentNames.LAUNCH_FEEDBACK_POPUP_ACTION, telemetryData);
    }
  }

  const getSecondsBeforePopup = (previousSurveyEventActivityStats: any) : string => {
    let latestCount : number = 0;
    if (Object.keys(previousSurveyEventActivityStats.Surveys).length > 0) {
      const surveyStats: any = Object.values(previousSurveyEventActivityStats.Surveys);
      latestCount = surveyStats[0].Counts;
    }
    return latestCount.toString();
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