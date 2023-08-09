import { Label, PivotItem } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { getSnippet } from '../../../services/actions/snippet-action-creator';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { translateMessage } from '../../../utils/translate-messages';
import { CopyButton } from '../../common/copy/CopyButton';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions/dimensions-adjustment';

interface ISnippetProps {
  language: string;
  snippetInfo: ISupportedLanguages;
}

interface ISupportedLanguages {
  [language: string]: {
    sdkDownloadLink: string;
    sdkDocLink: string;
  };
}

export function renderSnippets(supportedLanguages: ISupportedLanguages) {
  const sortedSupportedLanguages: ISupportedLanguages = {};
  Object.keys(supportedLanguages).sort().forEach(key => {
    sortedSupportedLanguages[key] = supportedLanguages[key];
  });

  return Object.keys(sortedSupportedLanguages).
    map((language: string) => (
      <PivotItem
        key={language}
        headerText={language === 'CSharp' ? 'C#' : language}
        headerButtonProps={{
          'aria-controls': `${language}-tab`
        }}
        itemKey={language}
        tabIndex={0}
        id={`${language}-tab`}
      >
        <Snippet language={language} snippetInfo={supportedLanguages} />
      </PivotItem>
    ));
}

function Snippet(props: ISnippetProps) {
  let { language } = props;
  const { sdkDownloadLink, sdkDocLink } = props.snippetInfo[language];

  /**
   * Converting language lowercase so that we won't have to call toLowerCase() in multiple places.
   *
   * Ie the monaco component expects a lowercase string for the language prop and the graphexplorerapi expects
   * a lowercase string for the param value.
   */
  language = language.toLowerCase();

  const { dimensions: { response }, snippets,
    responseAreaExpanded, sampleQuery } = useAppSelector((state) => state);
  const { data, pending: loadingState, error } = snippets;
  const snippet = (!loadingState && data) ? data[language] : null;
  const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
  const height = convertVhToPx(responseHeight, 220);
  const [snippetError, setSnippetError] = useState(error);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setSnippetError(error?.error ? error.error : error);
  }, [error])

  const handleCopy = async () => {
    trackedGenericCopy(snippet, CODE_SNIPPETS_COPY_BUTTON, sampleQuery, { Language: language });
  }

  useEffect(() => {
    dispatch(getSnippet(language));
  }, [sampleQuery.sampleUrl]);

  const setCommentSymbol = (): string => {
    return (language.trim() === 'powershell' || language.trim() === 'python') ? '#' : '//';
  }

  const trackLinkClickedEvent = (link: string, e:any) => {
    const isDocumentationLink : boolean = link.includes('doc')
    const componentName = getLanguageComponentName(isDocumentationLink, componentNames.CODE_SNIPPET_LANGUAGES);
    telemetry.trackLinkClickEvent(e.currentTarget.href, componentName);
  }
  const getLanguageComponentName = (isDocumentationLink: boolean, snippetComponentNames: object) : string => {
    const snippetComponentEntries = Object.entries(snippetComponentNames);
    const snippetLanguageEntry = snippetComponentEntries.find(
      ([key]) => language.toLocaleLowerCase() === key.toLocaleLowerCase()
    );
    const componentName = isDocumentationLink ? snippetLanguageEntry?.[1].doc : snippetLanguageEntry?.[1].sdk;
    return componentName || '' ;
  }

  const addExtraSnippetInformation = () : string => {
    const clientLibraryLink =
    // eslint-disable-next-line max-len
    `\n${setCommentSymbol()} ${translateMessage('Leverage libraries')} ${language} ${translateMessage('Client library')} ${sdkDownloadLink}\n`
    const sdkLink = `${setCommentSymbol()} ${translateMessage('SDKs documentation')} ${sdkDocLink}\n`
    return clientLibraryLink + sdkLink ;
  }

  const displayError = (): JSX.Element | null => {
    if((!loadingState && snippet) || (!loadingState && !snippetError)){
      return null;
    }
    if(
      (snippetError?.status && snippetError.status === 404) ||
      (snippetError?.status && snippetError.status === 400)
    ){
      return(
        <Label style={{ padding: 10 }}>
          <FormattedMessage id='Snippet not available' />
        </Label>
      )
    }
    else{
      return (
        <>
          {!loadingState &&
            <Label style={{ padding: 10 }}>
              <FormattedMessage id='Fetching code snippet failing' />
            </Label>
          }
        </>
      )
    }
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
            body={addExtraSnippetInformation() + snippet}
            language={language}
            readOnly={true}
            height={height}
          />
        </>
      }
      {displayError()}
    </div>
  );
}