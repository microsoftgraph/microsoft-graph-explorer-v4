import { Pivot, PivotItem } from '@fluentui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { componentNames, telemetry } from '../../../../telemetry';
import { IRootState } from '../../../../types/root';
import { setSnippetTabSuccess } from '../../../services/actions/snippet-action-creator';
import { renderSnippets } from './snippets-helper';

function GetSnippets() {
  const dispatch = useDispatch();
  const { snippets } =  useSelector((state: IRootState) => state);
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

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    dispatch(setSnippetTabSuccess(pivotItem.props.itemKey!))
  }

  return <Pivot
    className={'pivot-response'}
    selectedKey={snippets.snippetTab}
    onLinkClick={handlePivotItemClick}
  >
    {renderSnippets(supportedLanguages)}
  </Pivot>;
}
export const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
