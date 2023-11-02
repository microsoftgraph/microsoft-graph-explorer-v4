import { FontSizes, Label, Pivot, PivotItem } from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { setSnippetTabSuccess } from '../../../services/actions/snippet-action-creator';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';
import { translateMessage } from '../../../utils/translate-messages';
import { renderSnippets } from './snippets-helper';

function GetSnippets() {
  const dispatch: AppDispatch = useDispatch();
  const validation = useContext(ValidationContext);

  const { snippets, sampleQuery } = useAppSelector((state) => state);
  const supportedLanguages = {
    'CSharp': {
      sdkDownloadLink: 'https://aka.ms/csharpsdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'PowerShell': {
      sdkDownloadLink: 'https://aka.ms/pshellsdk',
      sdkDocLink: 'https://aka.ms/pshellsdkdocs'
    },
    'Go': {
      sdkDownloadLink: 'https://aka.ms/graphgosdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'Java': {
      sdkDownloadLink: 'https://aka.ms/graphjavasdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'JavaScript': {
      sdkDownloadLink: 'https://aka.ms/graphjssdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'PHP': {
      sdkDownloadLink: 'https://aka.ms/graphphpsdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'Python': {
      sdkDownloadLink: 'https://aka.ms/msgraphpythonsdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    },
    'CLI' : {
      sdkDownloadLink: 'https://aka.ms/msgraphclisdk',
      sdkDocLink: 'https://aka.ms/sdk-doc'
    }
  };

  const handlePivotItemClick = (pivotItem?: PivotItem) => {
    if (!pivotItem) {
      return;
    }
    telemetry.trackTabClickEvent(pivotItem.props.itemKey!, sampleQuery);
    dispatch(setSnippetTabSuccess(pivotItem.props.itemKey!));
  }

  return validation.isValid ? <Pivot
    className={'unstyled-pivot'}
    selectedKey={snippets.snippetTab}
    onLinkClick={handlePivotItemClick}
    styles={{ text: { fontSize: FontSizes.size14 } }}
    overflowBehavior='menu'
    overflowAriaLabel={translateMessage('More items')}
  >
    {renderSnippets(supportedLanguages)}
  </Pivot> : <Label style={{ marginLeft: '12px' }}>
    <FormattedMessage id={'Invalid URL'} />!
  </Label>
};

const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
export default Snippets;