import { Pivot } from '@fluentui/react';
import React from 'react';

import { componentNames, telemetry } from '../../../../telemetry';
import { renderSnippets } from './snippets-helper';

function GetSnippets() {
  const supportedLanguages = {
    'CSharp': 'https://aka.ms/csharpsdk',
    'JavaScript': 'https://aka.ms/graphjssdk',
    'Java': 'https://aka.ms/graphjavasdk',
    'Objective-C': 'https://aka.ms/objective-c-sdk',
    'Go': 'https://aka.ms/graphgosdk',
    'PowerShell': 'https://aka.ms/pshellsdk'
  };

  return <Pivot>{renderSnippets(supportedLanguages)}</Pivot>;
}
export const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
