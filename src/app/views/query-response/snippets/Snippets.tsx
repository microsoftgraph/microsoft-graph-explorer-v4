import {
  Label,
  Link,
  makeStyles,
  SelectTabData,
  SelectTabEvent,
  Spinner,
  Tab,
  TabList,
  Text
} from '@fluentui/react-components';
import { useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';
import { getSnippet, setSnippetTabSuccess } from '../../../services/slices/snippet.slice';
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
  }
};

const useSnippetStyles = makeStyles({
  container: {
    margin: '0 auto',
    paddingTop: '5px',
    paddingLeft: '5px',
    maxHeight: '100vh',
    overflowY: 'hidden',
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
    height: '60vh'
  },
  copyButton: {
    marginLeft: 'auto'
  },
  snippetContent: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
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

const ExtraSnippetInformation: React.FC<{ language: string }> = ({ language }) => {
  const styles = useSnippetStyles();
  const langKey = Object.keys(supportedLanguages).find(
    (key) => key.toLowerCase() === language.toLowerCase()
  );

  if (!langKey) {
    return null;
  }

  const { sdkDownloadLink, sdkDocLink } = supportedLanguages[langKey];
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
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector(state => state.snippets.snippetTab);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    const newLang = data.value as string;
    dispatch(setSnippetTabSuccess(newLang));
    dispatch(getSnippet(newLang.toLowerCase()));
    telemetry.trackTabClickEvent(newLang);
  };
  return (
    <div id='snippets-tablist' className={styles.container}>
      <TabList selectedValue={selectedLanguage} onTabSelect={onTabSelect}>
        <Tab key='CSharp' value='CSharp'>C#</Tab>
        {/*The rest should be sorted in alphabetical order to match docs */}
        {Object.keys(supportedLanguages)
          .filter(lang => lang !== 'CSharp')
          .sort((a, b) => a.localeCompare(b))
          .map(language => (
            <Tab key={language} value={language}>{language}</Tab>
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
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const snippetTab = useAppSelector((state) => state.snippets.snippetTab);
  const { data, pending: loadingState, error } = snippets;
  const hasSnippetError =
    (error?.status && error.status === 404) ||
    (error?.status && error.status === 400);

  const snippet = !loadingState && data ? data[language.toLowerCase()] : '';

  const handleCopy = async () => {
    copyAndTrackText(snippet, CODE_SNIPPETS_COPY_BUTTON, {
      Language: language
    });
  };

  useEffect(() => {
    if (snippetTab) {
      dispatch(getSnippet(snippetTab.toLowerCase()));
    }
  }, [snippetTab]);

  useEffect(() => {
    if (sampleQuery && snippetTab) {
      dispatch(getSnippet(snippetTab.toLowerCase()));
    }
  }, [sampleQuery]);

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
          extraInfoElement={<ExtraSnippetInformation language={props.language} />}
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
