import { FontSizes, Pivot, PivotItem } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { ApplicationState } from '../../../../types/root';
import { setSnippetTabSuccess } from '../../../services/actions/snippet-action-creator';
import { renderSnippets } from './snippets-helper';

function GetSnippets() {
  const dispatch: AppDispatch = useDispatch();
  const { snippets } = useSelector((state: ApplicationState) => state);
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
