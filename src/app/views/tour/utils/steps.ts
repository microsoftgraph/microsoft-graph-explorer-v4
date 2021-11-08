import { DirectionalHint } from '@fluentui/react';
import { ITourSteps } from './types';
import {
  FETCH_ADAPTIVE_CARD_SUCCESS, GET_SNIPPET_SUCCESS, PROFILE_REQUEST_SUCCESS, QUERY_GRAPH_SUCCESS,
  SET_SAMPLE_QUERY_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS
} from '../../../services/redux-constants';
import { geLocale } from '../../../../appLocale';
import { translateMessage } from '../../../utils/translate-messages';

export const BEGINNER_TOUR: ITourSteps[] = [];

export const ADVANCED_TOUR: ITourSteps[] = [];

const devLink = `https://developer.microsoft.com/${geLocale}/office/dev-program`
const toolkitComponentDocsLink = `https://docs.microsoft.com/${geLocale}/graph/toolkit/overview`
const adaptiveCardsDocsLink = `https://docs.microsoft.com/${geLocale}/adaptive-cards/`


export const TourSteps =
{
  'TourSteps':
    [
      {
        target: '.query-box',
        content: translateMessage('Query box message beginner'),
        directionalHint: DirectionalHint.leftBottomEdge,
        spotlightClicks: true,
        hideCloseButton: true,
        title: translateMessage('Query title'),
        autoNext: false,
        disableBeacon: true,
        expectedActionType: QUERY_GRAPH_SUCCESS,
        query: {
          selectedVerb: 'GET',
          selectedVersion: 'v1.0',
          sampleUrl: 'https://graph.microsoft.com/beta/me/',
          sampleHeaders: []
        },
        advanced: false
      },
      {
        target: '.pivot-response *[data-content="Response preview xx"]',
        content: translateMessage('Response preview message'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        title: translateMessage('Response Preview'),
        autoNext: true,
        disableBeacon: true,
        advanced: false
      },
      {
        target: '.response-preview-body',
        content: translateMessage('Response body profile message'),
        title: translateMessage('API Response'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        disableBeacon: true,
        advanced: false

      },
      {
        target: '.sample-queries-navigation',
        content: translateMessage('Sample queries message'),
        spotlightClicks: true,
        title: translateMessage('Sample Queries'),
        directionalHint: DirectionalHint.rightTopEdge,
        disableBeacon: true,
        expectedActionType: QUERY_GRAPH_SUCCESS,
        advanced: false
      },
      {
        target: '.pivot-response *[data-content="Response preview xx"]',
        content: translateMessage('Response preview message'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        title: translateMessage('Response Preview'),
        autoNext: true,
        disableBeacon: true,
        advanced: false
      },
      {
        target: '.response-preview-body',
        content: translateMessage('Response body message'),
        title: translateMessage('API Response'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        disableBeacon: true,
        advanced: false

      },
      {
        target: '.side-bar-pivot *[data-content="History xx"]',
        content: translateMessage('History button message'),
        title: translateMessage('History items'),
        spotlightClicks: true,
        directionalHint: DirectionalHint.rightCenter,
        disableBeacon: true,
        autoNext: true,
        advanced: false
      },
      {
        target: '.history-items',
        content: translateMessage('History message'),
        title: translateMessage('History items'),
        spotlightClicks: true,
        directionalHint: DirectionalHint.leftTopEdge,
        disableBeacon: true,
        expectedActionType: VIEW_HISTORY_ITEM_SUCCESS,
        advanced: false
      },
      {
        target: '.pivot-response *[data-content="Response preview xx"]',
        content: translateMessage('Response preview message'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        title: translateMessage('Response Preview'),
        autoNext: true,
        disableBeacon: true,
        advanced: false
      },
      {
        target: '.response-preview-body',
        content: translateMessage('History item API response'),
        title: translateMessage('Response Preview'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        disableBeacon: true,
        advanced: false

      },
      {
        target: '.sign-in-section',
        content: translateMessage('Sign in message'),
        disableBeacon: true,
        spotlightClicks: true,
        title: translateMessage('Sign in'),
        directionalHint: DirectionalHint.rightTopEdge,
        expectedActionType: PROFILE_REQUEST_SUCCESS,
        advanced: true,
        query: {}
      },
      {
        target: '.settings-menu-button',
        content: translateMessage('Sandbox message'),
        title: translateMessage('More actions'),
        spotlightClicks: true,
        directionalHint: DirectionalHint.leftCenter,
        disableBeacon: true,
        advanced: true,
        query: {},
        docsLink: devLink
      },
      {
        target: '.request-option',
        content: translateMessage('Request option message'),
        directionalHint: DirectionalHint.leftBottomEdge,
        spotlightClicks: true,
        title: translateMessage('HTTP request method option'),
        disableBeacon: true,
        expectedActionType: SET_SAMPLE_QUERY_SUCCESS,
        advanced: true
      },
      {
        target: '.query-version',
        content: translateMessage('Query version message'),
        directionalHint: DirectionalHint.bottomCenter,
        spotlightClicks: true,
        title: translateMessage('Microsoft Graph API Version option'),
        disableBeacon: true,
        expectedActionType: SET_SAMPLE_QUERY_SUCCESS,
        advanced: true
      },
      {
        target: '.query-box',
        content: translateMessage('Query box message advanced'),
        directionalHint: DirectionalHint.leftBottomEdge,
        spotlightClicks: true,
        title: translateMessage('Query title'),
        autoNext: false,
        disableBeacon: true,
        expectedActionType: QUERY_GRAPH_SUCCESS,
        query: {
          selectedVerb: 'GET',
          selectedVersion: 'v1.0',
          sampleUrl: 'https://graph.microsoft.com/v1.0',
          sampleHeaders: []
        },
        advanced: true
      },
      {
        target: '.pivot-response *[data-content="Response preview xx"]',
        content: translateMessage('Response preview message'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        title: translateMessage('Response Preview'),
        autoNext: true,
        disableBeacon: true,
        query: {
          selectedVerb: 'GET',
          selectedVersion: 'v1.0',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []
        },
        advanced: true
      },
      {
        target: '.response-preview-body',
        content: translateMessage('Response body message'),
        title: translateMessage('Response Preview'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        disableBeacon: true,
        advanced: true
      },
      {
        target: '.pivot-response *[data-content="Response headers xx"]',
        content: translateMessage('Response headers button message'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        title: translateMessage('Response Headers'),
        autoNext: true,
        disableBeacon: true,
        advanced: true
      },
      {
        target: '.response-headers-body',
        content: translateMessage('Response headers message'),
        title: translateMessage('Response headers viewer'),
        spotlightClicks: true,
        directionalHint: DirectionalHint.topLeftEdge,
        disableBeacon: true,
        advanced: true
      },
      {
        target: '.pivot-response *[data-content="Toolkit component xx"]',
        content: translateMessage('Toolkit component button message'),
        title: translateMessage('Graph toolkit'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        autoNext: true,
        disableBeacon: true,
        advanced: true,
        docsLink: toolkitComponentDocsLink
      },
      {
        target: '.toolkit-component-area',
        content: translateMessage('Toolkit component message'),
        title: translateMessage('Graph toolkit'),
        spotlightClicks: true,
        directionalHint: DirectionalHint.topCenter,
        disableBeacon: true,
        advanced: true
      },
      {
        target: '.pivot-response *[data-content="Adaptive cards xx"]',
        content: translateMessage('Adaptive cards button message'),
        title: translateMessage('Adaptive Cards'),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        autoNext: true,
        disableBeacon: true,
        expectedActionType: FETCH_ADAPTIVE_CARD_SUCCESS,
        advanced: true,
        docsLink: adaptiveCardsDocsLink
      },
      {
        target: '.adaptive-cards-response',
        content: translateMessage('Adaptive cards message'),
        title: translateMessage('Adaptive Cards'),
        spotlightClicks: true,
        directionalHint: DirectionalHint.topCenter,
        disableBeacon: true,
        advanced: true

      },
      {
        target: '.pivot-response *[data-content="Code snippets xx"]',
        content: translateMessage('Code snippets button message'),
        directionalHint: DirectionalHint.topCenter,
        title: translateMessage('Snippets'),
        spotlightClicks: true,
        autoNext: false,
        disableBeacon: true,
        expectedActionType: GET_SNIPPET_SUCCESS,
        advanced: true
      },
      {
        target: '.code-snippet-body',
        content: translateMessage('Code snippets message'),
        title: translateMessage('Snippets'),
        spotlightClicks: true,
        directionalHint: DirectionalHint.topLeftEdge,
        disableBeacon: true,
        advanced: true
      },
      {
        target: '.query-response *[data-content="Share xx"]',
        content: translateMessage('Share query message'),
        title: translateMessage('Share Query'),
        spotlightClicks: true,
        disableBeacon: true,
        advanced: true
      }
    ]
}

export const COMPONENT_INFO: ITourSteps[] = [
  {
    target: '.pivot-response *[data-content="Toolkit component xx"]',
    content: translateMessage('Toolkit component button message'),
    title: translateMessage('Graph toolkit'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content: translateMessage('Response preview message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Preview'),
    autoNext: false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response headers xx"]',
    content: translateMessage('Response headers button message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Headers'),
    autoNext: false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Adaptive cards xx"]',
    content: translateMessage('Adaptive cards button message'),
    title: translateMessage('Adaptive Cards'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Code snippets xx"]',
    content: translateMessage('Code snippets button message'),
    directionalHint: DirectionalHint.topCenter,
    title: translateMessage('Snippets'),
    spotlightClicks: true,
    autoNext: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.query-response *[data-content="Share xx"]',
    content: translateMessage('Share query message'),
    title: translateMessage('Share Query'),
    spotlightClicks: true,
    infoStep: true,
    disableBeacon: true
  }
]