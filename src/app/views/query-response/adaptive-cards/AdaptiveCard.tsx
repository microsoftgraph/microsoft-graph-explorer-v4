import { getTheme, ITheme } from '@fluentui/react';
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
  TabValue
} from '@fluentui/react-components';
import * as AdaptiveCardsAPI from 'adaptivecards';
import { useEffect, useState } from 'react';

import MarkdownIt from 'markdown-it';
import { useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { IAdaptiveCardContent } from '../../../../types/adaptivecard';
import { IQuery } from '../../../../types/query-runner';
import { translateMessage } from '../../../utils/translate-messages';
import { MonacoV9 } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { CopyButtonV9 } from '../../common/copy-button';
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
  template: string;
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
  }
});

const AdaptiveCard = (props: AdaptiveCardProps) => {
  let adaptiveCard: AdaptiveCardsAPI.AdaptiveCard | null =
    new AdaptiveCardsAPI.AdaptiveCard();
  const [cardContent, setCardContent] = useState<
    AdaptiveCardResponse | undefined
  >(undefined);

  const { body, hostConfig } = props;
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const theme = useAppSelector((state) => state.theme);
  const queryStatus = useAppSelector((state) => state.queryRunnerStatus);

  const currentTheme: ITheme = getTheme();

  useEffect(() => {
    try {
      const content = getAdaptiveCard(body, sampleQuery);
      setCardContent({
        data: content
      });
    } catch (err: unknown) {
      const error = err as Error;
      setCardContent({
        error: error.message
      });
    }

    if (!adaptiveCard) {
      adaptiveCard = new AdaptiveCardsAPI.AdaptiveCard();
    }

    if (hostConfig) {
      adaptiveCard.hostConfig = new AdaptiveCardsAPI.HostConfig(hostConfig);
    }

    return () => {
      adaptiveCard = null;
    };
  }, [body]);

  if (!body) {
    return <div />;
  }

  if (body) {
    if (!cardContent?.data || (queryStatus && !queryStatus.ok)) {
      return (
        <Label weight='semibold'>
          {translateMessage(
            'The Adaptive Card for this response is not available'
          )}
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
      );
    }

    try {
      AdaptiveCardsAPI.AdaptiveCard.onProcessMarkdown = (
        text: string,
        result: AdaptiveCardsAPI.IMarkdownProcessingResult
      ) => {
        const md = new MarkdownIt();
        result.outputHtml = md.render(text);
        result.didProcess = true;
      };
      adaptiveCard.parse(cardContent!.data.card);
      const renderedCard = adaptiveCard.render();

      if (renderedCard) {
        renderedCard.style.backgroundColor =
          currentTheme.palette.neutralLighter;

        const applyTheme = (child: HTMLElement) => {
          if (!child) {
            return;
          }
          if (child && child.tagName === 'BUTTON') {
            return;
          }

          child.style.color = currentTheme.palette.black;
          if (child.children.length > 0) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < child.children.length; i++) {
              applyTheme(child.children[i] as HTMLElement);
            }
          }
        };

        if (theme !== 'light') {
          applyTheme(renderedCard);
        }
      }

      const handleCopy = async () => {
        trackedGenericCopy(
          JSON.stringify(cardContent!.data?.template, null, 4),
          componentNames.JSON_SCHEMA_COPY_BUTTON,
          sampleQuery
        );
      };

      return (
        <RenderCardAndJson
          handleCopy={handleCopy}
          renderedCard={renderedCard as HTMLElement}
          template={cardContent!.data?.template as string}
          sampleQuery={sampleQuery}
        />
      );
    } catch (err: unknown) {
      const error = err as Error;
      return (
        <MessageBar intent='error'>
          <MessageBarBody>
            <MessageBarTitle>Adaptive card rendering error</MessageBarTitle>
            {error.message}
          </MessageBarBody>
        </MessageBar>
      );
    }
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
  return (
    <div className={styles.cardContainer}>
      <div
        id={'card-tab'}
        className={styles.scrollableCard}
        ref={(n) => {
          if (n && !n.firstChild) {
            n.appendChild(renderedCard);
          } else {
            if (n && n.firstChild) {
              n.replaceChild(renderedCard, n.firstChild);
            }
          }
        }}
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
        <CopyButtonV9 handleOnClick={handleCopy} isIconButton={true} />
        <MonacoV9
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
