import { Pivot } from 'office-ui-fabric-react';
import React from 'react';

import { componentNames, telemetry } from '../../../../telemetry';
import { renderSnippets } from './snippets-helper';

function GetSnippets() {
  const supportedLanguages = ['CSharp', 'JavaScript', 'Java', 'Objective-C'];

  return (
    <Pivot>
      {renderSnippets(supportedLanguages)}
    </Pivot>
  );
}
export const Snippets = telemetry.trackReactComponent(GetSnippets, componentNames.CODE_SNIPPETS_TAB);
