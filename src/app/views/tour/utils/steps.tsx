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
    autoNext: true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message'/>
    ),
    title:<FormattedMessage id='Response'/>,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    advancedStep: false,
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
    advancedStep: false,
    disableBeacon: true
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
    target: '.settings-menu-button',
    content:(
      <FormattedMessage id='Sandbox message' />
    ),
    title:<FormattedMessage id='More actions'/>,
    spotlightClicks: true,
    directionalHint: DirectionalHint.leftCenter,
    advancedStep: true,
    disableBeacon: true
  },
  {
    target:'.request-option',
    content:(
      <FormattedMessage id='Request option message'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    advancedStep: true,
    title: <FormattedMessage id='HTTP request method option' />,
    disableBeacon: true
  },
  {
    target: '.query-version',
    content: (
      <FormattedMessage id='Query version message'/>
    ),
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    advancedStep: true,
    title: <FormattedMessage id='Microsoft Graph API Version option' />,
    disableBeacon: true

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
    autoNext: true,
    disableBeacon: true
  },
  {
    target:'.response-preview-body',
    content:(
      <FormattedMessage id='Response body message' />
    ),
    title:<FormattedMessage id='Response Preview'/>,
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    advancedStep: true,
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
    advancedStep: true,
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
    advancedStep: true,
    disableBeacon: true
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
    advancedStep: true,
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
    advancedStep: true,
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
    autoNext:true,
    advancedStep: true,
    disableBeacon: true
  },
  {
    target: '.adaptive-cards-response',
    content: (
      <FormattedMessage id='Adaptive cards message'/>
    ),
    title:<FormattedMessage id='Adaptive Cards' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topCenter,
    advancedStep: true,
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
    advancedStep: true,
    disableBeacon: true
  },
  {
    target: '.code-snippet-body',
    content: (
      <FormattedMessage id='Code snippets message'/>
    ),
    title:<FormattedMessage id='Snippets' />,
    spotlightClicks: true,
    directionalHint: DirectionalHint.topLeftEdge,
    advancedStep: true,
    disableBeacon: true
  },
  {
    target: '.query-response *[data-content="Share xx"]',
    content: (
      <FormattedMessage id='Share query message'/>
    ),
    title: <FormattedMessage id='Share Query'/>,
    spotlightClicks: true,
    advancedStep: true,
    disableBeacon: true
  },
  {
    target: '.settings-menu-button',
    content:(
      <FormattedMessage id='Settings button message' />
    ),
    title:<FormattedMessage id='More actions'/>,
    spotlightClicks: true,
    directionalHint: DirectionalHint.leftCenter,
    advancedStep: true,
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
    advancedStep: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.pivot-response *[data-content="Response preview xx"]',
    content:(
      <FormattedMessage id='Response headers button message' />
    ),
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    title:<FormattedMessage id='Response Headers'/>,
    autoNext:false,
    advancedStep: true,
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
    advancedStep: true,
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
    advancedStep: true,
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
    advancedStep: true,
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
    advancedStep: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.request-pivot-tab *[data-content="Request body xx"]',
    content: (<div>
           Click here to modify request body
    </div>),
    spotlightClicks: true,
    title:'Request Body',
    directionalHint: DirectionalHint.leftTopEdge,
    autoNext: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.request-body-area',
    content: (
      <div>
                Modify the request body here
      </div>
    ),
    title:'Modify Body',
    directionalHint: DirectionalHint.topCenter,
    spotlightClicks: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.request-pivot-tab *[data-content="Request headers xx"]',
    content: (<div>
            Click here to modify request headers
    </div>),
    spotlightClicks: true,
    title:'Request Headers',
    directionalHint: DirectionalHint.topAutoEdge,
    autoNext:true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.request-headers-body',
    content: (
      <div>
                Modify request headers here
      </div>
    ),
    title:'Modify Headers',
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.request-pivot-tab *[data-content="Modify permissions (Preview) xx"]',
    content: (<div>
            Click here to view some permissions for the query you want to run
    </div>),
    title:'Permissions Tab',
    spotlightClicks: true,
    directionalHint: DirectionalHint.topAutoEdge,
    autoNext: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.request-permissions-body',
    content: (
      <div>
                Consent to any permission you want
      </div>
    ),
    title:'Permissions',
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.request-pivot-tab *[data-content="Access token xx"]',
    content: (<div>
            Click here to view your access token. It will not be available if you are not signed in
    </div>),
    title:'Access Token',
    spotlightClicks: true,
    directionalHint: DirectionalHint.leftTopEdge,
    autoNext: true,
    infoStep: true,
    disableBeacon: true
  },
  {
    target: '.access-token-body',
    content: (
      <div>
                Here is your access token
      </div>
    ),
    title:'Access Token',
    directionalHint: DirectionalHint.bottomCenter,
    spotlightClicks: true,
    infoStep: true,
    disableBeacon: true
  }

]

export const ADVANCED_TOUR_LENGTH = ADVANCED_TOUR.length
export const BEGINNER_TOUR_LENGTH = BEGINNER_TOUR.length
export const COMPONENT_INFO_LENGTH = COMPONENT_INFO.length