import {
  Label, Link, makeStyles, SelectTabData, SelectTabEvent, Spinner, Tab, TabList, TabValue
} from '@fluentui/react-components';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { SnippetError } from '../../../../types/snippets';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';
import { getSnippet } from '../../../services/slices/snippet.slice';
import { translateMessage } from '../../../utils/translate-messages';
import { MonacoV9 } from '../../common';
import { copyAndTrackText } from '../../common/copy';
import { getResponseEditorHeight } from '../../common/dimensions/dimensions-adjustment';
import { CopyButtonV9 } from '../../common/lazy-loader/component-registry';

interface LanguageSnippet {
  [language:string]: {
    sdkDocLink: string,
    sdkDownloadLink: string,
  }
}

const supportedLanguages: LanguageSnippet= {
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
  'CLI': {
    sdkDownloadLink: 'https://aka.ms/msgraphclisdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  }
};

const useSnippetStyles = makeStyles({
  container: {
    margin: '0 40px'
  }
})

const setCommentSymbol = (language: string): string => {
  const lang = language.trim().toLowerCase()
  return (lang=== 'powershell' || lang === 'python') ? '#' : '//';
}

const getLanguageComponentName = (
  language: string, isDocumentationLink: boolean,
  snippetComponentNames: {[language: string]: {sdk: string, doc: string}}) : string => {
  const snippetComponentEntries = Object.entries(snippetComponentNames);
  const snippetLanguageEntry = snippetComponentEntries.find(
    ([key]) => language.toLocaleLowerCase() === key.toLocaleLowerCase()
  );
  const componentName = isDocumentationLink ? snippetLanguageEntry?.[1].doc : snippetLanguageEntry?.[1].sdk;
  return componentName || '' ;
}


const trackLinkClickedEvent = (
  link: string, language: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  const isDocumentationLink : boolean = link.includes('doc')
  const componentName = getLanguageComponentName(language, isDocumentationLink, componentNames.CODE_SNIPPET_LANGUAGES);
  telemetry.trackLinkClickEvent(e.currentTarget.href, componentName);
}

const addExtraSnippetInformation = (language: string) : JSX.Element => {
  const { sdkDownloadLink, sdkDocLink } = supportedLanguages[language];
  const paragraph = sdkDownloadLink + setCommentSymbol(language) +
    translateMessage('Leverage libraries') + language + translateMessage('Client library')
  const sdkParagraph = setCommentSymbol(language) + translateMessage('SDKs documentation')
  return (
    <div>
      <p>{paragraph}</p>
      <Link
        onClick={(e) => trackLinkClickedEvent(language, sdkDownloadLink, e)}
        href={sdkDownloadLink} inline rel='norefferer noopener' target='_blank'>{sdkDownloadLink}</Link>
      <p>{sdkParagraph}</p>
      <Link
        onClick={(e) => trackLinkClickedEvent(language, sdkDownloadLink, e)}
        href={sdkDocLink} inline rel='norefferer noopener' target='_blank'>{sdkDocLink}</Link>
    </div>
  )
}

const GetSnippets = ()=> {
  const validation = useContext(ValidationContext);
  return <div>
    {validation.isValid && <RenderSnippets />}
    {!validation.isValid && <Label weight="semibold">{translateMessage('Invalid URL')}!</Label>}
  </div>
}

const RenderSnippets = ()=>{
  const styles = useSnippetStyles()
  const [selectedLanguage, setSelectedLanguage] = useState<TabValue>('CSharp');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedLanguage(data.value);
  };
  return <div id="snippets-tablist" className={styles.container}>
    <TabList selectedValue={selectedLanguage} onTabSelect={onTabSelect}>
      {Object.keys(supportedLanguages).map((language: string) => (
        <Tab key={language} value={language}>
          {language === 'CSharp' ? 'C#' : language}
        </Tab>
      ))}
    </TabList>
    <div id="snippet-content"><SnippetContent language={selectedLanguage as string}/></div>
  </div>

}

interface SnippetContentProps {
  language: string
}

const SnippetContent = (props: SnippetContentProps)=>{
  const dispatch = useAppDispatch()
  const language = props.language.toLowerCase();
  const snippets = useAppSelector(state => state.snippets)
  const { data, pending: loadingState, error } = snippets;
  const [snippetError, setSnippetError] = useState<SnippetError>(error as SnippetError)
  const hasSnippetError= (snippetError?.status && snippetError.status === 404) ||
  (snippetError?.status && snippetError.status === 400)

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

  return <div>
    {loadingState && !hasSnippetError &&
      <Spinner labelPosition="below" label={translateMessage('Fetching code snippet' )} />}
    {!loadingState && hasSnippetError &&
      <Label weight="semibold">{translateMessage('Snippet not available' )}</Label>}
    <div>
      <CopyButtonV9 isIconButton={true} handleOnClick={handleCopy}></CopyButtonV9>
      <MonacoV9
        body={snippet}
        language={language}
        readOnly={true}
        height={monacoHeight}
        extraInfoElement={addExtraSnippetInformation(props.language)}
      />
    </div>
  </div>
}

const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
export default Snippets;