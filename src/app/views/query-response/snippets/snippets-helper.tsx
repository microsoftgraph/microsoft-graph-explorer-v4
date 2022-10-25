import { getTheme, ITheme, Label, Link, PivotItem } from '@fluentui/react';
import React, { useEffect } from 'react';
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
import { getSnippetStyles } from './Snippets.styles';

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
  return Object.keys(supportedLanguages).map((language: string) => (
    <PivotItem
      key={language}
      headerText={language}
      headerButtonProps={{
        'aria-controls': `${language}-tab`
      }}
      itemKey={language}
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
  const { data, pending: loadingState } = snippets;
  const snippet = (!loadingState && data) ? data[language] : null;

  const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
  const height = convertVhToPx(responseHeight, 140);

  const dispatch: AppDispatch = useDispatch();

  const handleCopy = async () => {
    trackedGenericCopy(snippet, CODE_SNIPPETS_COPY_BUTTON, sampleQuery, { Language: language });
  }

  useEffect(() => {
    dispatch(getSnippet(language));
  }, [sampleQuery.sampleUrl]);

  const setCommentSymbol = (): string => {
    return language.trim() === 'powershell' ? '#' : '//';
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

  const addExtraSnippetInformation = () : JSX.Element => {
    const currentTheme: ITheme = getTheme();
    const snippetLinkStyles = getSnippetStyles(currentTheme);
    const snippetCommentStyles = getSnippetStyles(currentTheme).snippetComments;
    return (
      <div style={snippetCommentStyles}>

        {setCommentSymbol()} {translateMessage('Leverage libraries')} {language} {translateMessage('Client library')}

        <Link  href={sdkDownloadLink} underline={true} styles={snippetLinkStyles}
          onClick={(e) => trackLinkClickedEvent(sdkDownloadLink, e)} target={'_blank'} rel='noreferrer noopener'>
          {sdkDownloadLink}
        </Link>
        <br />

        {setCommentSymbol()} {translateMessage('SDKs documentation')}

        <Link href={sdkDocLink} underline={true} styles={snippetLinkStyles}
          onClick={(e) => trackLinkClickedEvent(sdkDocLink, e)} target={'_blank'} rel='noreferrer noopener'>
          {sdkDocLink}
        </Link>
      </div>
    );
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
            body={snippet}
            language={language}
            readOnly={true}
            height={height}
            extraInfoElement={addExtraSnippetInformation()}
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