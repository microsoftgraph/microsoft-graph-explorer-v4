import { Pivot, PivotItem } from '@fluentui/react';
import React, { useState } from 'react';

import { componentNames, telemetry } from '../../../../telemetry';
import { renderSnippets } from './snippets-helper';

interface ISnippetProps {
  currentTab: string;
  setCurrentTab: Function;
}

function GetSnippets(props?: ISnippetProps) {
  const supportedLanguages = {
    'CSharp': {
      sdkDownloadLink: 'https://aka.ms/csharpsdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'JavaScript': {
      sdkDownloadLink: 'https://aka.ms/graphjssdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'Java': {
      sdkDownloadLink: 'https://aka.ms/graphjavasdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'Go': {
      sdkDownloadLink: 'https://aka.ms/graphgosdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'PowerShell': {
      sdkDownloadLink: 'https://aka.ms/pshellsdk',
      sdkDocLink: 'https://aka.ms/pshellsdkdocs'
    },
    'PHP': {
      sdkDownloadLink: 'https://aka.ms/graphphpsdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    }
  };

  // const currentTab = React.useRef<string>('CSharp');
  // const [currentTab, setCur/rentTab] = useState<string>('CSharp');
  console.log('Here is the current tab ', props!.currentTab);

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    //
    if (!pivotItem) {
      return;
    }
    console.log(pivotItem.props.itemKey);
    // currentTab.current = pivotItem.props.itemKey!;
    props!.setCurrentTab(pivotItem.props.itemKey!);
  }

  return <Pivot
    className={'pivot-response'}
    selectedKey={props!.currentTab}
    onLinkClick={handlePivotItemClick}
  >
    {renderSnippets(supportedLanguages)}
  </Pivot>;
}
export const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
