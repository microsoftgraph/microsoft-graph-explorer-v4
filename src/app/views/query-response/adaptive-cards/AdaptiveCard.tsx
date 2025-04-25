import {
  Label,
  Link,
  makeStyles,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue,
  Spinner
} from '@fluentui/react-components';
import * as AdaptiveCardsAPI from 'adaptivecards';
import { useEffect, useState, useRef } from 'react';

import MarkdownIt from 'markdown-it';
import { useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { IAdaptiveCardContent } from '../../../../types/adaptivecard';
import { IQuery } from '../../../../types/query-runner';
import { translateMessage } from '../../../utils/translate-messages';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { CopyButton } from '../../common/copy-button';
import { getAdaptiveCard } from './adaptive-cards.util';

export interface AdaptiveCardResponse {
  data?: IAdaptiveCardContent;
  error?: string;
}

interface AdaptiveCardProps {
  body: string;
  hostConfig: object;
}

interface RenderCardJSONProps {
  handleCopy: () => void;
  template: object;
  renderedCard: HTMLElement;
  sampleQuery: IQuery;
}

const adaptiveCardStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '500px'
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  scrollableCard: {
    maxHeight: '350px',
    overflowY: 'auto',
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff'
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    minHeight: '150px'
  }
});

const AdaptiveCard = (props: AdaptiveCardProps) => {
  const styles = adaptiveCardStyles();
  // Use a ref for the AdaptiveCard instance to avoid re-creation
  const adaptiveCardRef = useRef<AdaptiveCardsAPI.AdaptiveCard | null>(null);
  const [cardContent, setCardContent] = useState<AdaptiveCardResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const { body, hostConfig } = props;
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const queryStatus = useAppSelector((state) => state.queryRunnerStatus);

  useEffect(() => {
    // Initialize Adaptive Card instance only once or if hostConfig changes
    if (!adaptiveCardRef.current) {
      adaptiveCardRef.current = new AdaptiveCardsAPI.AdaptiveCard();
    }
    if (hostConfig && adaptiveCardRef.current) {
      adaptiveCardRef.current.hostConfig = new AdaptiveCardsAPI.HostConfig(hostConfig);
    }
  }, [hostConfig]);

  useEffect(() => {
    setErrorInfo(null);
    setCardContent(undefined);

    if (!body || !sampleQuery?.sampleUrl) {
      setIsLoading(false);
      return;
    }

    // Don't proceed if the query itself failed
    if (queryStatus && !queryStatus.ok) {
      setErrorInfo(translateMessage('The Adaptive Card for this response is not available'));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    // Use a timeout to allow UI to update before potentially blocking work
    const timerId = setTimeout(() => {
      try {
        const content = getAdaptiveCard(body, sampleQuery);
        if (content) {
          setCardContent({ data: content });
          setErrorInfo(null);
        } else {
          setErrorInfo(translateMessage('The Adaptive Card for this response is not available'));
          setCardContent(undefined);
        }
      } catch (err: unknown) {
        const error = err as Error;
        setErrorInfo(error.message || 'An unknown error occurred generating the card.');
        setCardContent({ error: error.message });
      } finally {
        setIsLoading(false);
      }
    }, 0);


    return () => {
      clearTimeout(timerId); // Clear timeout if dependencies change before it runs
      setIsLoading(false); // Ensure loading is reset if effect cleans up early
    };

  }, [body, sampleQuery, queryStatus?.ok]);


  // Render Loading State
  if (isLoading) {
    return (
      <div className={styles.centered}>
        <Spinner label={translateMessage('Loading Adaptive Card...')} />
      </div>
    );
  }

  // Render Error State (from generation or query failure)
  if (errorInfo) {
    return (
      <div className={styles.centered}>
        <Label weight='semibold'>
          {errorInfo}
          &nbsp;
          <Link href={'https://adaptivecards.io/designer/'} target='_blank' rel='noopener noreferrer' inline>
            {translateMessage('Adaptive Cards designer')}
          </Link>
        </Label>
      </div>
    );
  }

  // Render "Not Available" if no data and no error (e.g., initial state or unexpected condition)
  if (!cardContent?.data) {
    return (
      <div className={styles.centered}>
        <Label weight='semibold'>
          {translateMessage('The Adaptive Card for this response is not available')}
           &nbsp;
          <Link
            href={'https://adaptivecards.io/designer/'}
            tabIndex={0}
            target='_blank'
            rel='noopener noreferrer'
            inline
          >
            {translateMessage('Adaptive Cards designer')}
          </Link>
        </Label>
      </div>
    );
  }

  try {
    const currentAdaptiveCard = adaptiveCardRef.current;
    if (!currentAdaptiveCard) {
      throw new Error('Adaptive Card instance is not available.');
    }

    AdaptiveCardsAPI.AdaptiveCard.onProcessMarkdown = (text, result) => {
      const md = new MarkdownIt();
      result.outputHtml = md.render(text);
      result.didProcess = true;
    };

    // Ensure cardContent.data.card is a valid object before parsing
    if (!cardContent.data.card || typeof cardContent.data.card !== 'object') {
      throw new Error('Invalid card data structure received after expansion.');
    }

    currentAdaptiveCard.parse(cardContent.data.card);
    const renderedCard = currentAdaptiveCard.render();

    if (!renderedCard) {
      throw new Error('Failed to render the Adaptive Card element.');
    }

    const handleCopy = async () => {
      // Stringify the original template object for the copy button
      const templateString = JSON.stringify(cardContent!.data?.template, null, 4);
      trackedGenericCopy(
        templateString,
        componentNames.JSON_SCHEMA_COPY_BUTTON,
        sampleQuery
      );
    };

    // Pass the original template object to RenderCardAndJson
    const templateForMonaco = cardContent.data.template;

    return (
      <RenderCardAndJson
        handleCopy={handleCopy}
        renderedCard={renderedCard}
        template={templateForMonaco}
        sampleQuery={sampleQuery}
      />
    );
  } catch (err: unknown) {
    const error = err as Error;
    return (
      <MessageBar intent='error'>
        <MessageBarBody>
          <MessageBarTitle>{translateMessage('Adaptive card rendering error')}</MessageBarTitle>
          {error.message}
        </MessageBarBody>
      </MessageBar>
    );
  }
};

const RenderCardAndJson = (props: RenderCardJSONProps) => {
  const styles = adaptiveCardStyles();
  const { handleCopy, template, renderedCard, sampleQuery } = props;
  const [tabSelected, setTabSelected] = useState<TabValue>('card');
  const handleTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    const value = data.value as string;
    setTabSelected(value);
    telemetry.trackTabClickEvent(value, sampleQuery);
  };
  return (
    <div className={styles.container}>
      <TabList selectedValue={tabSelected} onTabSelect={handleTabSelect}>
        <Tab value='card'>{translateMessage('card')}</Tab>
        <Tab value='JSON-schema'>{translateMessage('JSON Schema')}</Tab>
      </TabList>
      <div>
        {tabSelected === 'card' && (
          <RenderCard
            sampleQuery={sampleQuery}
            handleCopy={handleCopy}
            template={template}
            renderedCard={renderedCard}
          />
        )}
        {tabSelected === 'JSON-schema' && (
          <RenderJSONSchema
            sampleQuery={sampleQuery}
            renderedCard={renderedCard}
            template={template}
            handleCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
};

const RenderCard = (props: RenderCardJSONProps) => {
  const styles = adaptiveCardStyles();
  const { renderedCard } = props;
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = cardContainerRef.current;
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      if (renderedCard) {
        container.appendChild(renderedCard);
      }
    }
  }, [renderedCard]);

  return (
    <div className={styles.cardContainer}>
      <div
        id={'card-tab'}
        className={styles.scrollableCard}
        ref={cardContainerRef}
      />
    </div>
  );
};

const RenderJSONSchema = (props: RenderCardJSONProps) => {
  const { handleCopy, template } = props;
  const styles = adaptiveCardStyles();

  return (
    <div>
      <MessageBar intent='info'>
        <MessageBarBody>
          <MessageBarTitle>
            {translateMessage('Adaptive Cards Templating SDK')}
          </MessageBarTitle>
          {translateMessage('Get started with adaptive cards on')}
          <Link
            href={
              'https://learn.microsoft.com/en-us/adaptive-cards/templating/sdk'
            }
            target='_blank'
            rel='noopener noreferrer'
            tabIndex={0}
            inline
          >
            {translateMessage('Adaptive Cards Templating SDK')}
          </Link>
          &nbsp;
          {translateMessage('and experiment on')}&nbsp;
          <Link
            href={'https://adaptivecards.io/designer/'}
            target='_blank'
            rel='noopener noreferrer'
            tabIndex={0}
            inline
          >
            {translateMessage('Adaptive Cards designer')}
          </Link>
        </MessageBarBody>
      </MessageBar>
      <div className={styles.editorContainer}>
        <CopyButton handleOnClick={handleCopy} isIconButton={true} />
        <Monaco
          body={template}
          language='json'
          readOnly={true}
        />
      </div>
    </div>
  );
};

const trackedComponent = telemetry.trackReactComponent(
  AdaptiveCard,
  componentNames.ADAPTIVE_CARDS_TAB
);
export default trackedComponent;
