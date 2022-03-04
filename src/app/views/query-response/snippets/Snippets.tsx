import { Pivot } from '@fluentui/react';
import React from 'react';

import { componentNames, telemetry } from '../../../../telemetry';
import { renderSnippets } from './snippets-helper';

function GetSnippets() {
  const supportedLanguages = {
    'CSharp': 'https://www.nuget.org/packages/Microsoft.Graph/',
    'JavaScript': 'https://www.npmjs.com/package/@microsoft/microsoft-graph-client',
    'Java': 'https://search.maven.org/artifact/com.microsoft.graph/microsoft-graph-core',
    // eslint-disable-next-line max-len
    'Objective-C': 'https://docs.microsoft.com/en-us/graph/sdks/sdk-installation#install-the-microsoft-graph-objective-c-sdk-using-cocoapods',
    'Go': 'go',
    // eslint-disable-next-line max-len
    'PowerShell': 'https://docs.microsoft.com/en-us/graph/powershell/installation#:~:text=Install%20the%20Microsoft%20Graph%20PowerShell%20SDK'
  };

  return <Pivot>{renderSnippets(supportedLanguages)}</Pivot>;
}
export const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
