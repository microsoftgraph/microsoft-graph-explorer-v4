import {
  Label,
  Link,
  makeStyles,
  SelectTabData,
  SelectTabEvent,
  Spinner,
  Tab,
  TabList,
  TabValue,
  Text
} from '@fluentui/react-components';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';
import { getSnippet } from '../../../services/slices/snippet.slice';
import { translateMessage } from '../../../utils/translate-messages';
import { Monaco } from '../../common';
import { copyAndTrackText } from '../../common/copy';
import { CopyButton } from '../../common/lazy-loader/component-registry';

interface LanguageSnippet {
  [language: string]: {
    sdkDocLink: string;
    sdkDownloadLink: string;
  };
}

const supportedLanguages: LanguageSnippet = {
  CSharp: {
    sdkDownloadLink: 'https://aka.ms/csharpsdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  },
  PowerShell: {
    sdkDownloadLink: 'https://aka.ms/pshellsdk',
    sdkDocLink: 'https://aka.ms/pshellsdkdocs'
  },
  Go: {
    sdkDownloadLink: 'https://aka.ms/graphgosdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  },
  Java: {
    sdkDownloadLink: 'https://aka.ms/graphjavasdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  },
  JavaScript: {
    sdkDownloadLink: 'https://aka.ms/graphjssdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  },
  PHP: {
    sdkDownloadLink: 'https://aka.ms/graphphpsdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  },
  Python: {
    sdkDownloadLink: 'https://aka.ms/msgraphpythonsdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  },
  CLI: {
    sdkDownloadLink: 'https://aka.ms/msgraphclisdk',
    sdkDocLink: 'https://aka.ms/sdk-doc'
  }
};

const useSnippetStyles = makeStyles({
  container: {
    margin: '0 auto',
    maxHeight: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  extraInformation: {
    color: 'rgb(0, 128, 0)',
    marginLeft: '28px'
  },
  codeContainerLayout: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    height: '30vh',
    overflowY: 'auto'
  },
  copyButton: {
    marginLeft: 'auto'
  },
  snippetContent: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: 'calc(100vh-120px)'
  }
});

const setCommentSymbol = (language: string): string => {
  const lang = language.trim().toLowerCase();
  return lang === 'powershell' || lang === 'python' ? '# ' : '// ';
};

const getLanguageComponentName = (
  language: string,
  isDocumentationLink: boolean,
  snippetComponentNames: { [language: string]: { sdk: string; doc: string } }
): string => {
  const snippetComponentEntries = Object.entries(snippetComponentNames);
  const snippetLanguageEntry = snippetComponentEntries.find(
    ([key]) => language.toLocaleLowerCase() === key.toLocaleLowerCase()
  );
  const componentName = isDocumentationLink
    ? snippetLanguageEntry?.[1].doc
    : snippetLanguageEntry?.[1].sdk;
  return componentName || '';
};

const trackLinkClickedEvent = (
  link: string,
  language: string,
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  const isDocumentationLink: boolean = link.includes('doc');
  const componentName = getLanguageComponentName(
    language,
    isDocumentationLink,
    componentNames.CODE_SNIPPET_LANGUAGES
  );
  telemetry.trackLinkClickEvent(e.currentTarget.href, componentName);
};

const addExtraSnippetInformation = (language: string): JSX.Element => {
  const styles = useSnippetStyles();
  const { sdkDownloadLink, sdkDocLink } = supportedLanguages[language];
  const libParagraph =
    setCommentSymbol(language) +
    translateMessage('Leverage libraries') +
    translateMessage('Client library') +
    ' ';
  const sdkParagraph =
    setCommentSymbol(language) + translateMessage('SDKs documentation') + ' ';
  return (
    <div id='extra-info' className={styles.extraInformation}>
      <Text font='monospace' weight='medium'>
        {libParagraph}
        <Link
          onClick={(e) => trackLinkClickedEvent(language, sdkDownloadLink, e)}
          href={sdkDownloadLink}
          inline
          rel='noreferrer noopener'
          target='_blank'
        >
          {sdkDownloadLink}
        </Link>
      </Text>
      <br />
      <Text font='monospace' weight='medium'>
        {sdkParagraph}
        <Link
          onClick={(e) => trackLinkClickedEvent(language, sdkDocLink, e)}
          href={sdkDocLink}
          inline
          rel='noreferrer noopener'
          target='_blank'
        >
          {sdkDocLink}
        </Link>
      </Text>
    </div>
  );
};

const GetSnippets = () => {
  const validation = useContext(ValidationContext);
  return (
    <div>
      {validation.isValid && <RenderSnippets />}
      {!validation.isValid && (
        <Label weight='semibold'>{translateMessage('Invalid URL')}!</Label>
      )}
    </div>
  );
};

const RenderSnippets = () => {
  const styles = useSnippetStyles();
  const [selectedLanguage, setSelectedLanguage] = useState<TabValue>('CSharp');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedLanguage(data.value);
  };
  return (
    <div id='snippets-tablist' className={styles.container}>
      <TabList selectedValue={selectedLanguage} onTabSelect={onTabSelect}>
        {Object.keys(supportedLanguages).map((language: string) => (
          <Tab key={language} value={language}>
            {language === 'CSharp' ? 'C#' : language}
          </Tab>
        ))}
      </TabList>
      <div id='snippet-content'>
        <SnippetContent language={selectedLanguage as string} />
      </div>
    </div>
  );
};

interface SnippetContentProps {
  language: string;
}

const SnippetContent: React.FC<SnippetContentProps> = (
  props: SnippetContentProps
) => {
  const dispatch = useAppDispatch();
  const language = props.language.toLowerCase();
  const snippets = useAppSelector((state) => state.snippets);
  const { data, pending: loadingState, error } = snippets;
  const hasSnippetError =
    (error?.status && error.status === 404) ||
    (error?.status && error.status === 400);

  const snippet = !loadingState && data ? data[language] : '';

  const handleCopy = async () => {
    copyAndTrackText(snippet, CODE_SNIPPETS_COPY_BUTTON, {
      Language: language
    });
  };

  useEffect(() => {
    dispatch(getSnippet(language));
  }, [language, dispatch]);

  const showSpinner = loadingState && !hasSnippetError;
  const notAvailable = !loadingState && hasSnippetError;
  const styles = useSnippetStyles();

  return (
    <div className={styles.snippetContent}>
      {showSpinner && (
        <Spinner
          labelPosition='below'
          label={translateMessage('Fetching code snippet')}
        />
      )}
      {notAvailable && (
        <Label weight='semibold'>
          {translateMessage('Snippet not available')}!
        </Label>
      )}
      <div className={styles.codeContainerLayout}>
        <div className={styles.copyButton}><CopyButton isIconButton={true} handleOnClick={handleCopy} /></div>
        <Monaco
          body={snippet}
          language={language}
          readOnly={true}
          extraInfoElement={addExtraSnippetInformation(props.language)}
        />
      </div>
    </div>
  );
};

const Snippets = telemetry.trackReactComponent(
  GetSnippets,
  componentNames.CODE_SNIPPETS_TAB
);
export default Snippets;
