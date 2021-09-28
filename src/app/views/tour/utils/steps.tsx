import { DirectionalHint } from '@fluentui/react';
import { ITourSteps } from './types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const SAMPLE_TOUR: ITourSteps[] = [
  {
    target: '.query-box',
    content: 'Okay'
  }
]

export const BEGINNER_TOUR : ITourSteps[] = [
  {
    target:'.query-box',
    content:(
      <FormattedMessage id='Query box message beginner'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    hideCloseButton:true,
    title:'Query Box',
    autoNext: true
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content: (
      <FormattedMessage id='Response preview message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    title:'Response Preview',
    spotlightClicks: true,
    autoNext: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message'/>
    ),
    title:'Response',
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true
  },
  {
    target: '.query-run-button',
    content: (
      <FormattedMessage id='Query button message' />
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message'/>
    ),
    title:'Response',
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true
  },
  {
    target: '.sample-queries-navigation',
    content: (
      <FormattedMessage id='Sample queries message'/>),
    placement:'right-start',
    spotlightClicks: true,
    title:'Sample Queries',
    directionalHint: DirectionalHint.rightTopEdge
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message'/>
    ),
    title:'Response',
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true
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
    title: 'Sign In',
    illustrationImage:{src: './tourImages/signin.PNG'},
    directionalHint: DirectionalHint.rightTopEdge,
    autoNext: false
  },
  {
    target:'.request-option',
    content:(
      <FormattedMessage id='Request option message'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    autoNext: false
  },
  {
    target: '.query-version',
    content: (
      <FormattedMessage id='Query version message'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    autoNext: false
  },
  {
    target:'.query-box',
    content:(
      <FormattedMessage id='Query box message advanced' />
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    title:'Query Box',
    autoNext: true
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content: (
      <FormattedMessage id='Response preview message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    title:'Response Preview',
    spotlightClicks: true,
    autoNext: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message' />
    ),
    title:'Response',
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: false
  },
  {
    target: '.pivot-response *[data-content="Response headers xx"]',
    content:(
      <FormattedMessage id='Response headers button message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:'Response Headers',
    autoNext:true
  },
  {
    target: '.response-headers-body',
    content:(
      <FormattedMessage id='Response headers message'/>
    ),
    title:'Response Headers',
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    autoNext: false
  },
  {
    target: '.pivot-response *[data-content="Toolkit component xx"]',
    content:(
      <FormattedMessage id='Toolkit component button message' />
    ),
    title:'Toolkit Component',
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext: true
  },
  {
    target: '.toolkit-component-area',
    content:(
      <FormattedMessage id='Toolkit component message' />
    ),
    title:'Toolkit Component Response',
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    autoNext: false
  },
  {
    target: '.pivot-response *[data-content="Adaptive cards xx"]',
    content:(
      <FormattedMessage id='Adaptive cards button message'/>
    ),
    title:'Adaptive Cards',
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    autoNext:true
  },
  {
    target: '.adaptive-cards-response',
    content: (
      <FormattedMessage id='Adaptive cards message'/>
    ),
    title:'Adaptive Card Response',
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    autoNext: false
  },
  {
    target: '.pivot-response *[data-content="Code snippets xx"]',
    content:(
      <FormattedMessage id='Code snippets button message'/>
    ),
    directionalHint: DirectionalHint.topCenter,
    title:'Code Snippets',
    spotlightClicks: true,
    autoNext: true
  },
  {
    target: '.code-snippet-body',
    content: (
      <FormattedMessage id='Code snippets message'/>
    ),
    title:'Snippets',
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    autoNext: false
  },
  {
    target: '.settings-menu-button',
    content:(
      <FormattedMessage id='Settings button message' />
    ),
    title:'Settings',
    spotlightClicks: true,
    directionalHint: DirectionalHint.leftCenter,
    autoNext: false
  }
]