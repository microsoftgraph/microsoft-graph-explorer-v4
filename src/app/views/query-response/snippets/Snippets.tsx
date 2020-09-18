import { IconButton, Pivot } from 'office-ui-fabric-react';
import React from 'react';

import { telemetry } from '../../../../telemetry';
import { renderSnippets } from './snippets-helper';

export function Snippets() {
  const supportedLanguages = ['CSharp', 'JavaScript', 'Java', 'Objective-C'];

  return (
    <Pivot>
      {renderSnippets(supportedLanguages)}
    </Pivot>
  );
}
export default telemetry.trackReactComponent(Snippets);
