import { DirectionalHint } from '@fluentui/react';
import { ITourSteps } from './types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const SAMPLE_TOUR: ITourSteps[] = [
  {
    target: '.query-response *[data-content="Share xx"]',
    content: (
      <FormattedMessage id='Query response'/>
    )
  }
]

export const BEGINNER_TOUR : ITourSteps[] = [
  {
    target:'.query-box',
    content:(
      <FormattedMessage id='Query box message beginner'/>
    ),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    hideCloseButton:true,
    title:<FormattedMessage id='Query'/>,
    advancedStep: false,
    autoNext: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message'/>
    ),
    title:<FormattedMessage id='Response'/>,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    advancedStep: false
  },
  {
    target: '.pivot-response *[data-content="Code snippets xx"]',
    content:(
      <FormattedMessage id='Code snippets button message'/>
    ),
    directionalHint: DirectionalHint.topCenter,
    title:<FormattedMessage id='Snippets'/>,
    spotlightClicks: true,
    autoNext: true,
    advancedStep: false
  },
  {
    target: '.code-snippet-body',
    content: (
      <FormattedMessage id='Code snippets message'/>
    ),
    title:<FormattedMessage id='Snippets'/>,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    advancedStep: false

  },
  {
    target: '.sample-queries-navigation',
    content: (
      <FormattedMessage id='Sample queries message'/>),
    placement:'right-start',
    spotlightClicks: true,
    title:<FormattedMessage id='Sample Queries'/>,
    directionalHint: DirectionalHint.rightTopEdge,
    advancedStep: false
  }
]

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
    advancedStep: true
  },
  {
    target:'.request-option',
    content:(
      <FormattedMessage id='Request option message'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    advancedStep: true,
    title: <FormattedMessage id='HTTP request method option' />
  },
  {
    target: '.query-version',
    content: (
      <FormattedMessage id='Query version message'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    advancedStep: true,
    title: <FormattedMessage id='Microsoft Graph API Version option' />

  },
  {
    target:'.query-box',
    content:(
      <FormattedMessage id='Query box message advanced' />
    ),
    directionalHint: DirectionalHint.leftBottomEdge,
    spotlightClicks: true,
    title:<FormattedMessage id='Query'/>,
    advancedStep: true,
    autoNext: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message' />
    ),
    title:<FormattedMessage id='Response Preview'/>,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    advancedStep: true

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
    advancedStep: true
  },
  {
    target: '.response-headers-body',
    content:(
      <FormattedMessage id='Response headers message'/>
    ),
    title:<FormattedMessage id='Response headers viewer' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    advancedStep: true

  },
  {
    target: '.pivot-response *[data-content="Toolkit component xx"]',
    content:(
      <FormattedMessage id='Toolkit component button message' />
    ),
    title:<FormattedMessage id='Graph toolkit' />,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: true,
    advancedStep: true
  },
  {
    target: '.toolkit-component-area',
    content:(
      <FormattedMessage id='Toolkit component message' />
    ),
    title:<FormattedMessage id='Graph toolkit' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    advancedStep: true

  },
  {
    target: '.pivot-response *[data-content="Adaptive cards xx"]',
    content:(
      <FormattedMessage id='Adaptive cards button message'/>
    ),
    title:<FormattedMessage id='Adaptive Cards' />,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext:true,
    advancedStep: true
  },
  {
    target: '.adaptive-cards-response',
    content: (
      <FormattedMessage id='Adaptive cards message'/>
    ),
    title:<FormattedMessage id='Adaptive Cards' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    advancedStep: true

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
    advancedStep: true
  },
  {
    target: '.code-snippet-body',
    content: (
      <FormattedMessage id='Code snippets message'/>
    ),
    title:<FormattedMessage id='Snippets' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    advancedStep: true

  },
  {
    target: '.query-response *[data-content="Share xx"]',
    content: (
      <FormattedMessage id='Share query message'/>
    ),
    title: <FormattedMessage id='Share Query'/>,
    spotlightClicks: true,
    advancedStep: true
  },
  {
    target: '.settings-menu-button',
    content:(
      <FormattedMessage id='Settings button message' />
    ),
    title:<FormattedMessage id='Settings'/>,
    spotlightClicks: true,
    directionalHint: DirectionalHint.leftCenter,
    advancedStep: true

  }
]

export const ADVANCED_TOUR_LENGTH = ADVANCED_TOUR.length
export const BEGINNER_TOUR_LENGTH = BEGINNER_TOUR.length