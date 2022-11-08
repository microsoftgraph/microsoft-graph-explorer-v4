import { FontSizes, Pivot, PivotItem } from '@fluentui/react';
import { useDispatch } from 'react-redux';
import React from 'react';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { setSnippetTabSuccess } from '../../../services/actions/snippet-action-creator';
import { renderSnippets } from './snippets-helper';
function GetSnippets() {
  const dispatch: AppDispatch = useDispatch();
  const { snippets } = useAppSelector((state) => state);
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
    }
  };

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    dispatch(setSnippetTabSuccess(pivotItem.props.itemKey!))
  }

  return <Pivot
    className={'unstyled-pivot'}
    selectedKey={snippets.snippetTab}
    onLinkClick={handlePivotItemClick}
    styles={{ text: { fontSize: FontSizes.size14 } }}
  >
    {renderSnippets(supportedLanguages)}
  </Pivot>;
}
export const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
