import { DirectionalHint, Link } from '@fluentui/react';
import { ITourSteps } from './types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FETCH_ADAPTIVE_CARD_SUCCESS, GET_SNIPPET_SUCCESS,
  PROFILE_REQUEST_SUCCESS, QUERY_GRAPH_SUCCESS, SET_SAMPLE_QUERY_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS } from '../../../services/redux-constants';
import { geLocale } from '../../../../appLocale';

export const BEGINNER_TOUR : ITourSteps[] = [
  {
    target:'.query-box',
    content:(
      <FormattedMessage id='Query box message beginner'/>
    ),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    hideCloseButton:true,
    title:<FormattedMessage id='Query title'/>,
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
    content:(
      <FormattedMessage id='Response preview message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Preview'/>,
    autoNext: true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body profile message'/>
    ),
    title:<FormattedMessage id='API Response'/>,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    disableBeacon: true

  },
  {
    target: '.sample-queries-navigation',
    content: (
      <FormattedMessage id='Sample queries message'/>),
    placement:'right-start',
    spotlightClicks: true,
    title:<FormattedMessage id='Sample Queries'/>,
    directionalHint: DirectionalHint.rightTopEdge,
    disableBeacon: true,
    expectedActionType: QUERY_GRAPH_SUCCESS
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content:(
      <FormattedMessage id='Response preview message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Preview'/>,
    autoNext: true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message'/>
    ),
    title:<FormattedMessage id='API Response'/>,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    disableBeacon: true

  },
  {
    target: '.side-bar-pivot *[data-content="History xx"]',
    content:(
      <FormattedMessage id='History button message' />
    ),
    title:<FormattedMessage id='History items'/>,
    spotlightClicks: true,
    directionalHint: DirectionalHint.rightCenter,
    disableBeacon: true,
    autoNext: true
  },
  {
    target: '.history-items',
    content:(
      <FormattedMessage id='History message' />
    ),
    title:<FormattedMessage id='History items'/>,
    spotlightClicks: true,
    directionalHint: DirectionalHint.rightCenter,
    disableBeacon: true,
    expectedActionType: VIEW_HISTORY_ITEM_SUCCESS
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content:(
      <FormattedMessage id='Response preview message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Preview'/>,
    autoNext:true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='History item API response' />
    ),
    title:<FormattedMessage id='Response Preview'/>,
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
    content: (
      <FormattedMessage id='Sign in message'/>
    ),
    disableBeacon: true,
    spotlightClicks: true,
    placement:'right-end',
    title: <FormattedMessage id='Sign in'/>,
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
    title:<FormattedMessage id='More actions'/>,
    spotlightClicks: true,
    directionalHint: DirectionalHint.leftCenter,
    disableBeacon: true
  },
  {
    target:'.request-option',
    content:(
      <FormattedMessage id='Request option message'/>
    ),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    title: <FormattedMessage id='HTTP request method option' />,
    disableBeacon: true,
    expectedActionType: SET_SAMPLE_QUERY_SUCCESS
  },
  {
    target: '.query-version',
    content: (
      <FormattedMessage id='Query version message'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    title: <FormattedMessage id='Microsoft Graph API Version option' />,
    disableBeacon: true,
    expectedActionType: SET_SAMPLE_QUERY_SUCCESS
  },
  {
    target:'.query-box',
    content:(
      <FormattedMessage id='Query box message advanced' />
    ),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    title:<FormattedMessage id='Query title'/>,
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
    content:(
      <FormattedMessage id='Response preview message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Preview'/>,
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
    content:(
      <FormattedMessage id='Response body message' />
    ),
    title:<FormattedMessage id='Response Preview'/>,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response headers xx"]',
    content:(
      <FormattedMessage id='Response headers button message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Headers'/>,
    autoNext:true,
    disableBeacon: true
  },
  {
    target: '.response-headers-body',
    content:(
      <FormattedMessage id='Response headers message'/>
    ),
    title:<FormattedMessage id='Response headers viewer' />,
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
          <FormattedMessage id='Toolkit component docs' />
        </Link>
      </>
    ),
    title:<FormattedMessage id='Graph toolkit' />,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: true,
    disableBeacon: true
  },
  {
    target: '.toolkit-component-area',
    content:(
      <FormattedMessage id='Toolkit component message' />
    ),
    title:<FormattedMessage id='Graph toolkit' />,
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
          <FormattedMessage id='Adaptive cards docs'/>
        </Link>
      </>
    ),
    title:( <FormattedMessage id='Adaptive Cards'/> ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext:true,
    disableBeacon: true,
    expectedActionType: FETCH_ADAPTIVE_CARD_SUCCESS
  },
  {
    target: '.adaptive-cards-response',
    content: (
      <FormattedMessage id='Adaptive cards message'/>
    ),
    title:<FormattedMessage id='Adaptive Cards' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    disableBeacon: true

  },
  {
    target: '.pivot-response *[data-content="Code snippets xx"]',
    content:(
      <FormattedMessage id='Code snippets button message'/>
    ),
    directionalHint: DirectionalHint.topCenter,
    title:<FormattedMessage id='Snippets' />,
    spotlightClicks: true,
    autoNext: false,
    disableBeacon: true,
    expectedActionType: GET_SNIPPET_SUCCESS
  },
  {
    target: '.code-snippet-body',
    content: (
      <FormattedMessage id='Code snippets message'/>
    ),
    title:<FormattedMessage id='Snippets' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    disableBeacon: true
  },
  {
    target: '.query-response *[data-content="Share xx"]',
    content: (
      <FormattedMessage id='Share query message'/>
    ),
    title: <FormattedMessage id='Share Query'/>,
    spotlightClicks: true,
    disableBeacon: true
  }
]

export const COMPONENT_INFO : ITourSteps[] = [
  {
    target: '.pivot-response *[data-content="Toolkit component xx"]',
    content:(
      <FormattedMessage id='Toolkit component button message' />
    ),
    title:<FormattedMessage id='Graph toolkit' />,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content:(
      <FormattedMessage id='Response preview message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Preview'/>,
    autoNext:false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response headers xx"]',
    content:(
      <FormattedMessage id='Response headers button message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Headers'/>,
    autoNext:false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Adaptive cards xx"]',
    content:(
      <FormattedMessage id='Adaptive cards button message'/>
    ),
    title:<FormattedMessage id='Adaptive Cards' />,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext:false,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Code snippets xx"]',
    content:(
      <FormattedMessage id='Code snippets button message'/>
    ),
    directionalHint: DirectionalHint.topCenter,
    title:<FormattedMessage id='Snippets' />,
    spotlightClicks: true,
    autoNext: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.query-response *[data-content="Share xx"]',
    content: (
      <FormattedMessage id='Share query message'/>
    ),
    title: <FormattedMessage id='Share Query'/>,
    spotlightClicks: true,
    infoStep: true,
    disableBeacon: true
  }
]