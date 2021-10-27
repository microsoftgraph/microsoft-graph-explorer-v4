import { DirectionalHint, Link } from '@fluentui/react';
import { ITourSteps } from './types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FETCH_ADAPTIVE_CARD_SUCCESS, GET_SNIPPET_SUCCESS,
  PROFILE_REQUEST_SUCCESS, QUERY_GRAPH_SUCCESS, SET_SAMPLE_QUERY_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS } from '../../../services/redux-constants';
import { geLocale } from '../../../../appLocale';
import { translateMessage } from '../../../utils/translate-messages';

export const BEGINNER_TOUR : ITourSteps[] = [
  {
    target:'.query-box',
    content: translateMessage('Query box message beginner'),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    hideCloseButton:true,
    title: translateMessage('Query title'),
    autoNext: false,
    disableBeacon: true,
    expectedActionType: QUERY_GRAPH_SUCCESS,
    query:{
      selectedVerb: 'GET',
      selectedVersion: 'v1.0',
      sampleUrl: 'https://graph.microsoft.com/beta/me/',
      sampleHeaders:[]
    }
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content: translateMessage('Response preview message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Preview'),
    autoNext: true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content:translateMessage('Response body profile message'),
    title:translateMessage('API Response'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    disableBeacon: true

  },
  {
    target: '.sample-queries-navigation',
    content: translateMessage('Sample queries message'),
    spotlightClicks: true,
    title: translateMessage('Sample Queries'),
    directionalHint: DirectionalHint.rightTopEdge,
    disableBeacon: true,
    expectedActionType: QUERY_GRAPH_SUCCESS
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content: translateMessage('Response preview message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Preview'),
    autoNext: true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content: translateMessage('Response body message'),
    title: translateMessage('API Response'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    disableBeacon: true

  },
  {
    target: '.side-bar-pivot *[data-content="History xx"]',
    content: translateMessage('History button message'),
    title: translateMessage('History items'),
    spotlightClicks: true,
    directionalHint: DirectionalHint.rightCenter,
    disableBeacon: true,
    autoNext: true
  },
  {
    target: '.history-items',
    content: translateMessage('History message'),
    title: translateMessage('History items'),
    spotlightClicks: true,
    directionalHint: DirectionalHint.rightCenter,
    disableBeacon: true,
    expectedActionType: VIEW_HISTORY_ITEM_SUCCESS
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content: translateMessage('Response preview message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Preview'),
    autoNext:true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content: translateMessage('History item API response'),
    title: translateMessage('Response Preview'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    disableBeacon: true

  }
]

const devLink = `https://developer.microsoft.com/${geLocale}/office/dev-program`
const toolkitComponentDocsLink = `https://docs.microsoft.com/${geLocale}/graph/toolkit/overview`
const adaptiveCardsDocsLink=`https://docs.microsoft.com/${geLocale}/adaptive-cards/`

export const ADVANCED_TOUR : ITourSteps[] = [
  {
    target: '.sign-in-section',
    content: translateMessage('Sign in message'),
    disableBeacon: true,
    spotlightClicks: true,
    title: translateMessage('Sign in'),
    directionalHint: DirectionalHint.rightTopEdge,
    expectedActionType: PROFILE_REQUEST_SUCCESS
  },
  {
    target: '.settings-menu-button',
    content:(
      <>
        <FormattedMessage id='Sandbox message' />
        <Link href= {devLink} underline
          target='_blank' styles={{root: {color: 'white'}}}>
          <FormattedMessage id='Sandbox url mesage' />
        </Link>
      </>
    ),
    title: translateMessage('More actions'),
    spotlightClicks: true,
    directionalHint: DirectionalHint.leftCenter,
    disableBeacon: true
  },
  {
    target:'.request-option',
    content: (
      <>
        <FormattedMessage id='Request option message' />
        <span style={{fontWeight: 'bold'}}><FormattedMessage id='GET'/></span>
      </>
    ),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    title: translateMessage('HTTP request method option'),
    disableBeacon: true,
    expectedActionType: SET_SAMPLE_QUERY_SUCCESS
  },
  {
    target: '.query-version',
    content: translateMessage('Query version message'),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    title: translateMessage('Microsoft Graph API Version option'),
    disableBeacon: true,
    expectedActionType: SET_SAMPLE_QUERY_SUCCESS
  },
  {
    target:'.query-box',
    content: translateMessage('Query box message advanced'),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    title: translateMessage('Query title'),
    autoNext: false,
    disableBeacon: true,
    expectedActionType: QUERY_GRAPH_SUCCESS,
    query:{
      selectedVerb: 'GET',
      selectedVersion: 'v1.0',
      sampleUrl: 'https://graph.microsoft.com/v1.0',
      sampleHeaders:[]
    }
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content: translateMessage('Response preview message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Preview'),
    autoNext:true,
    disableBeacon: true,
    query:{
      selectedVerb: 'GET',
      selectedVersion: 'v1.0',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders:[]
    }
  },
  {
    target:'.response-preview-body',
    content: translateMessage('Response body message'),
    title: translateMessage('Response Preview'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response headers xx"]',
    content: translateMessage('Response headers button message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Headers'),
    autoNext:true,
    disableBeacon: true
  },
  {
    target: '.response-headers-body',
    content: translateMessage('Response headers message'),
    title: translateMessage('Response headers viewer'),
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Toolkit component xx"]',
    content:(
      <>
        <FormattedMessage id='Toolkit component button message' />
        <Link href={toolkitComponentDocsLink} underline
          target='_blank' styles={{root: {color: 'white'}}}>
          <FormattedMessage id='Click here to learn more' />
        </Link>
      </>
    ),
    title: translateMessage('Graph toolkit'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: true,
    disableBeacon: true
  },
  {
    target: '.toolkit-component-area',
    content: translateMessage('Toolkit component message'),
    title: translateMessage('Graph toolkit'),
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Adaptive cards xx"]',
    content:(
      <>
        <FormattedMessage id='Adaptive cards button message' />
        <Link href={adaptiveCardsDocsLink} underline
          target='_blank' styles={{root: {color: 'white'}}}>
          <FormattedMessage id='Click here to learn more'/>
        </Link>
      </>
    ),
    title: translateMessage('Adaptive Cards'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext:true,
    disableBeacon: true,
    expectedActionType: FETCH_ADAPTIVE_CARD_SUCCESS
  },
  {
    target: '.adaptive-cards-response',
    content: translateMessage('Adaptive cards message'),
    title: translateMessage('Adaptive Cards'),
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    disableBeacon: true

  },
  {
    target: '.pivot-response *[data-content="Code snippets xx"]',
    content: translateMessage('Code snippets button message'),
    directionalHint: DirectionalHint.topCenter,
    title: translateMessage('Snippets'),
    spotlightClicks: true,
    autoNext: false,
    disableBeacon: true,
    expectedActionType: GET_SNIPPET_SUCCESS
  },
  {
    target: '.code-snippet-body',
    content: translateMessage('Code snippets message'),
    title: translateMessage('Snippets'),
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    disableBeacon: true
  },
  {
    target: '.query-response *[data-content="Share xx"]',
    content: translateMessage('Share query message'),
    title: translateMessage('Share Query'),
    spotlightClicks: true,
    disableBeacon: true
  }
]

export const COMPONENT_INFO : ITourSteps[] = [
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
    autoNext:false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response headers xx"]',
    content: translateMessage('Response headers button message'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title: translateMessage('Response Headers'),
    autoNext:false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Adaptive cards xx"]',
    content: translateMessage('Adaptive cards button message'),
    title: translateMessage('Adaptive Cards'),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext:false,
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