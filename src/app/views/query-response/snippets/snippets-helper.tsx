import { Label, PivotItem } from '@fluentui/react';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { getSnippet } from '../../../services/actions/snippet-action-creator';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';

import { convertVhToPx, getResponseHeight } from '../../common/dimensions/dimensions-adjustment';
import { IRootState } from '../../../../types/root';
import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { CopyButton } from '../../common/copy/CopyButton';
import { translateMessage } from '../../../utils/translate-messages';

interface ISnippetProps {
  language: string;
  sdkLink: string;
}

interface ISupportedLanguages{
  [key: string]: string;
}

export function renderSnippets(supportedLanguages: ISupportedLanguages) {
  return Object.keys(supportedLanguages).map((language: string) => (
    <PivotItem
      key={language}
      headerText={language}
      headerButtonProps={{
        'aria-controls': `${language}-tab`
      }}
    >
      <Snippet language={language} sdkLink={supportedLanguages[language]} />
    </PivotItem>
  ));
}

function Snippet(props: ISnippetProps) {
  let { language } = props;
  const { sdkLink } = props;

  /**
   * Converting language lowercase so that we won't have to call toLowerCase() in multiple places.
   *
   * Ie the monaco component expects a lowercase string for the language prop and the graphexplorerapi expects
   * a lowercase string for the param value.
   */
  language = language.toLowerCase();

  const sampleQuery = useSelector((state: IRootState) => state.sampleQuery, shallowEqual);
  const { dimensions: { response }, snippets, responseAreaExpanded } = useSelector((state: IRootState) => state);
  const { data, pending: loadingState } = snippets;
  const snippet = (!loadingState && data) ? data[language] : null;

  const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
  const height = convertVhToPx(responseHeight, 140);

  const dispatch = useDispatch();

  const handleCopy = async () => {
    trackedGenericCopy(snippet, CODE_SNIPPETS_COPY_BUTTON, sampleQuery, { Language: language });
  }

  useEffect(() => {
    dispatch(getSnippet(language));
  }, [sampleQuery.sampleUrl]);

  const setCommentSymbol = (): string => {
    return language.trim() === 'powershell' ? '#' : '//';
  }

  const setSnippetText = (): string => {
    // eslint-disable-next-line max-len
    return (`${setCommentSymbol()} ${translateMessage('Leverage our libraries')} ${language} ${translateMessage('Client library')}${sdkLink}\r
${setCommentSymbol()} ${translateMessage('SDKs documentation')}\r\r${snippet}`);
  }

  return (
    <div style={{ display: 'block' }} id={`${language}-tab`}>
      {loadingState &&
        <Label style={{ padding: 10 }}>
          <FormattedMessage id='Fetching code snippet' />...
        </Label>
      }
      {!loadingState && snippet &&
        <>
          <CopyButton isIconButton={true} style={{ float: 'right', zIndex: 1 }} handleOnClick={handleCopy} />
          <Monaco
            body={setSnippetText()}
            language={language}
            readOnly={true}
            height={height}
          />
        </>
      }
      {!loadingState && !snippet &&
        <Label style={{ padding: 10 }}>
          <FormattedMessage id='Snippet not available' />
        </Label>
      }
    </div>
  );
}
