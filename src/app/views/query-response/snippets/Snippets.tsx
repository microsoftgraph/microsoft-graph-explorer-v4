import { Pivot } from 'office-ui-fabric-react';
import React from 'react';

import { telemetry } from '../../../../telemetry';
import { CODE_SNIPPETS_TAB } from '../../../../telemetry/component-names';
import { renderSnippets } from './snippets-helper';

function GetSnippets() {
  const supportedLanguages = ['CSharp', 'JavaScript', 'Java', 'Objective-C'];

  return (
    <Pivot>
      {renderSnippets(supportedLanguages)}
    </Pivot>
  );
}
export const Snippets = telemetry.trackReactComponent(GetSnippets, CODE_SNIPPETS_TAB);
