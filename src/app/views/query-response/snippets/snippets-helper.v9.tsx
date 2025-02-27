import { getTheme, ITheme, Label, Link, PivotItem } from '@fluentui/react';
import { useEffect, useState } from 'react';

import { makeStyles, SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { SnippetError } from '../../../../types/snippets';
import { getSnippet } from '../../../services/slices/snippet.slice';
import { translateMessage } from '../../../utils/translate-messages';
import { MonacoV9 } from '../../common';
import { copyAndTrackText, trackedGenericCopy } from '../../common/copy';
import {
  convertVhToPx, getResponseEditorHeight, getResponseHeight
} from '../../common/dimensions/dimensions-adjustment';
import {  CopyButtonV9 } from '../../common/lazy-loader/component-registry';
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
  const sortedSupportedLanguages: ISupportedLanguages = {};
  const sortedKeys = Object.keys(supportedLanguages).sort((lang1, lang2) => {
    if (lang1 === 'CSharp') {
      return -1;
    }
    if (lang2 === 'CSharp') {
      return 1;
    }
    if (lang1 < lang2) {
      return -1;
    } else if (lang1 > lang2) {
      return 1;
    }
    return 0;
  });

  sortedKeys.forEach(key => {
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

  /**
   * Converting language lowercase so that we won't have to call toLowerCase() in multiple places.
  *
  * Ie the monaco component expects a lowercase string for the language prop and the graphexplorerapi expects
  * a lowercase string for the param value.
  */
  let { language } = props;
  const { sdkDownloadLink, sdkDocLink } = props.snippetInfo[language];

  const unformattedLanguage = language;
  language = language.toLowerCase();

  const response = useAppSelector(state => state.dimensions.response)
  const responseAreaExpanded = useAppSelector(state => state.responseAreaExpanded)
  const snippets = useAppSelector(state => state.snippets)
  const sampleQuery = useAppSelector(state => state.sampleQuery)


  const { data, pending: loadingState, error } = snippets;
  const snippet = (!loadingState && data) ? data[language] : '';
  const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
  const defaultHeight = convertVhToPx(responseHeight, 220);
  const [snippetError, setSnippetError] = useState<SnippetError>(error);

  const monacoHeight = getResponseEditorHeight(235);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setSnippetError(error?.error ? { ...error, error: error.error } : error);
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

  const trackLinkClickedEvent = (link: string, e: any) => {
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

  const msg = `
  ${setCommentSymbol()} ${translateMessage('Leverage libraries')} ${unformattedLanguage}
  ${translateMessage('Client library')}`

  const addExtraSnippetInformation = () : JSX.Element => {
    const currentTheme: ITheme = getTheme();
    const snippetLinkStyles = getSnippetStyles(currentTheme);
    const snippetCommentStyles = getSnippetStyles(currentTheme).snippetComments;
    return (
      <div style={snippetCommentStyles}>
        {msg}
        <Link href={sdkDownloadLink} underline styles={snippetLinkStyles}
          onClick={(e) => trackLinkClickedEvent(sdkDownloadLink, e)} target={'_blank'} rel='noreferrer noopener'>
          {sdkDownloadLink}
        </Link>
        <br />

        {setCommentSymbol()} {translateMessage('SDKs documentation')}

        <Link href={sdkDocLink} underline styles={snippetLinkStyles}
          onClick={(e) => trackLinkClickedEvent(sdkDocLink, e)} target={'_blank'} rel='noreferrer noopener'>
          {sdkDocLink}
        </Link>
      </div>
    );
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
          {translateMessage('Snippet not available' )}
        </Label>
      )
    }
    else{
      return (
        <>
          {!loadingState &&
            <Label style={{ padding: 10 }}>
              {translateMessage('Fetching code snippet failing' )}
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
          {translateMessage('Fetching code snippet' )}...
        </Label>
      }
      {!loadingState && snippet &&
        <>
          <CopyButtonV9 isIconButton={true} style={{ float: 'right', zIndex: 1 }} handleOnClick={handleCopy} />
          <MonacoV9
            body={snippet}
            language={language}
            readOnly={true}
            height={responseAreaExpanded ? defaultHeight : monacoHeight}
            extraInfoElement={addExtraSnippetInformation()}
          />
        </>
      }
      {displayError()}
    </div>
  );
}

export const SnippetV9 = (props: ISnippetProps) => {
  const dispatch = useAppDispatch();
  let { language } = props;
  // const { sdkDownloadLink, sdkDocLink } = props.snippetInfo[language];

  // const unformattedLanguage = language;
  language = language.toLowerCase();

  // const response = useAppSelector(state => state.dimensions.response)
  // const responseAreaExpanded = useAppSelector(state => state.responseAreaExpanded)
  // const sampleQuery = useAppSelector(state => state.sampleQuery)
  // console.log('sample query')
  // console.log(sampleQuery)
  const snippets = useAppSelector(state => state.snippets)
  const { data, pending: loadingState, error } = snippets;
  const [snippetsError, setSnippetError] = useState<SnippetError>(error as SnippetError)


  const snippet = (!loadingState && data) ? data[language] : '';

  const monacoHeight = getResponseEditorHeight(235);

  const handleCopy = async () => {
    copyAndTrackText(snippet, CODE_SNIPPETS_COPY_BUTTON, {Language: language})
  }

  useEffect(() => {
    dispatch(getSnippet(language));
  }, [language]);

  useEffect(()=>{
    setSnippetError(error)
  }, [error])

  // Handle the snippetsError

  return <>
    <CopyButtonV9 isIconButton={true} handleOnClick={handleCopy}></CopyButtonV9>
    <MonacoV9
      body={snippet}
      language={language}
      readOnly={true}
      height={monacoHeight}
      // height={responseAreaExpanded ? defaultHeight : monacoHeight}
      // extraInfoElement={addExtraSnippetInformation()}
    />
  </>
}

const useSnippetStyles = makeStyles({
  container: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    rowGap: '20px'
  }
})

export function renderSnippetsV9(languages: ISupportedLanguages) {
  const styles = useSnippetStyles()
  const [selectedValue, setSelectedValue] = useState<TabValue>('CSharp');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    const value = data.value as string;
    setSelectedValue(value);
  };
  return (
    <div className={styles.container}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        {Object.keys(languages).map((language: string) => (
          <Tab key={language} value={language}>
            {language === 'CSharp' ? 'C#' : language}
          </Tab>
        ))}
      </TabList>
      <div>
        {<SnippetV9 language={selectedValue as string} snippetInfo={languages} />}
      </div>
    </div>
  );
}