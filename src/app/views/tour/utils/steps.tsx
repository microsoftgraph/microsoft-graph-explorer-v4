import { DirectionalHint } from '@fluentui/react';
import { ITourSteps } from './types';
import React from 'react';
import { key } from 'localforage';

export const SAMPLE_TOUR: ITourSteps[] = [
    {
        target: '.query-box',
        content: "Okay"
    }
]

export const BEGINNER_TOUR : ITourSteps[] = [
    {
        target:".query-box",
        content:(<div>
            Type the Graph API query here then press enter on your keyboard
        </div>),
        directionalHint: DirectionalHint.bottomCenter,
        spotlightClicks: true,
        hideCloseButton:true,
    },
    {
        target: '.pivot-response *[data-content="Response preview xx"]',
        content: (<div>
            Here is the actual response
        </div>),
        directionalHint: DirectionalHint.topCenter,
        title:'Response Preview',
        spotlightClicks: true,
        autoNext:true
    },
    {
        target:'.response-preview-body',
        content:(
            <div>
                Here is the response of the query you just ran
            </div>
        ),
        title:'Response',
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
    },
    {
        target: ".query-run-button",
        content: (<div>
            You can also click here to run the query
        </div>),
        directionalHint: DirectionalHint.bottomCenter,
        spotlightClicks: true
    },
    {
        target: ".sample-queries-navigation",
        content: (
        <div style={{textAlign: 'center', color: 'white'}} >
            <p  >Sample Queries Area </p>
            <p>Here are other queries you can run</p>

        </div>),
        placement:'right-start',
        spotlightClicks: true,
        title:'Sample Queries',
        directionalHint: DirectionalHint.rightTopEdge,
        illustrationImage:{src: './tourImages/signin.PNG'},
    },
]

export const ADVANCED_TOUR : ITourSteps[] = [
    // {
    //     target:".request-option",
    //     content:(<div>
    //         Change the request option here
    //     </div>),
    //     directionalHint: DirectionalHint.bottomCenter,
    // },
    // {
    //     target:".query-box",
    //     content:(<div>
    //         Type the Graph API query here
    //     </div>),
    //     directionalHint: DirectionalHint.bottomCenter,
    //     spotlightClicks: true
    // },
    // {
    //     target: ".query-run-button",
    //     content: (<div>
    //         Click here to run the query or press enter on your keyboard
    //     </div>),
    //     directionalHint: DirectionalHint.bottomCenter,
    //     spotlightClicks: true
    // },
    {
        target: ".sign-in-section",
        content: (
        <div style={{textAlign: 'center', color: 'white'}} >
            <p>Sign in with a microsoft account or leave it as it is</p>
        </div>),
        disableBeacon: true,
        spotlightClicks: true,
        placement:'right-end',
        title: 'Sign In',
        illustrationImage:{src: './tourImages/signin.PNG'},
        directionalHint: DirectionalHint.rightTopEdge,
    },
    {
        target: ".sample-queries-navigation",
        content: (<div>
            Have a look at some samples here to get you started
        </div>),
        title:'Sample Queries',
        directionalHint: DirectionalHint.rightTopEdge,
        spotlightClicks: true,
    },
    {
        target: '.request-pivot-tab *[data-content="Request body xx"]',
        content: (<div>
           Click here to modify request body
        </div>),
        spotlightClicks: true,
        title:'Request Body',
        directionalHint: DirectionalHint.leftTopEdge,
        autoNext: true
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
    },
    {
        target: '.request-pivot-tab *[data-content="Request headers xx"]',
        content: (<div>
            Click here to modify request headers
        </div>),
        spotlightClicks: true,
        title:'Request Headers',
        directionalHint: DirectionalHint.topAutoEdge,
        autoNext:true
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
        spotlightClicks: true
    },
    {
        target: '.request-pivot-tab *[data-content="Modify permissions (Preview) xx"]',
        content: (<div>
            Click here to view some permissions for the query you want to run
        </div>),
        title:'Permissions Tab',
        spotlightClicks: true,
        directionalHint: DirectionalHint.topAutoEdge,
        autoNext: true
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
        spotlightClicks: true
    },
    {
        target: '.request-pivot-tab *[data-content="Access token xx"]',
        content: (<div>
            Click here to view your access token. It will not be available if you are not signed in
        </div>),
        title:'Access Token',
        spotlightClicks: true,
        directionalHint: DirectionalHint.leftTopEdge,
        autoNext: true
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
    },
    {
        target: '.pivot-response *[data-content="Response preview xx"]',
        content: (<div>
            Here is the actual response
        </div>),
        directionalHint: DirectionalHint.topCenter,
        title:'Response Preview',
        spotlightClicks: true,
        autoNext:true
    },
    {
        target:'.response-preview-body',
        content:(
            <div>
                Here is the response of the query you just ran
            </div>
        ),
        title:'Response',
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
    },
    {
        target: '.pivot-response *[data-content="Response headers xx"]',
        content:(<div>
            See the response from the query you ran here
        </div>),
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        title:'Response Headers',
        autoNext:true
    },
    {
        target: '.response-headers-body',
        content:(
            <div>
                Here are the actual response headers
            </div>
        ),
        title:'Response Headers',
        spotlightClicks: true,
        directionalHint: DirectionalHint.topCenter
    },
    {
        target: '.pivot-response *[data-content="Code snippets xx"]',
        content:(<div>
            Have a look at some code snippets in different programming languages for the query you just ran
        </div>),
        directionalHint: DirectionalHint.topCenter,
        title:'Code Snippets',
        spotlightClicks: true,
        autoNext:true
    },
    {
        target: '.code-snippet-body',
        content: (
            <div>
                You can check out the different code snippets
            </div>
        ),
        title:'Snippets',
        spotlightClicks: true,
        directionalHint: DirectionalHint.topLeftEdge,
    },
    {
        target: '.pivot-response *[data-content="Toolkit component xx"]',
        content:(
        <div>
            Click here to view the response as a toolkit UI component
        </div>),
        title:'Toolkit Component',
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        autoNext: true
    },
    {
        target: '.toolkit-component-area',
        content:(
            <div>
                Here is the toolkit component.
            </div>
        ),
        title:'Toolkit Component Response',
        spotlightClicks: true,
        directionalHint: DirectionalHint.topCenter
    },
    {
        target: '.pivot-response *[data-content="Adaptive cards xx"]',
        content:(<div>
            Click here to see another UI card for the response on Adaptive Cards
        </div>),
        title:'Adaptive Cards',
        directionalHint: DirectionalHint.topCenter,
        spotlightClicks: true,
        autoNext:true
    },
    {
        target: '.adaptive-cards-response',
        content: (
            <div>
                Here is the adaptive card response
            </div>
        ),
        title:'Adaptive Card Response',
        spotlightClicks: true,
        directionalHint: DirectionalHint.topCenter
    },
    {
        target: '.settings-menu-button',
        content:(<div>
            There are more permissions for other queries you might want to run. Click here and choose 'Select permissions'
        </div>),
        title:'Settings',
        spotlightClicks: true,
        directionalHint: DirectionalHint.leftCenter,

    },
    {
        target:'.permissions-panel-body',
        content: (
            <div>
                Here is a list of all permissions
            </div>
        ),
        spotlightClicks: true,
        directionalHint: DirectionalHint.leftCenter
    }

]