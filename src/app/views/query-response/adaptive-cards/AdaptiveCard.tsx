import {
  FontSizes, getTheme, IStyle, ITheme, Label, Link,
  MessageBar, MessageBarType, Pivot, PivotItem, styled
} from '@fluentui/react';
import * as AdaptiveCardsAPI from 'adaptivecards';
import { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { getAdaptiveCard } from '../../../services/actions/adaptive-cards-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { CopyButton } from '../../common/copy/CopyButton';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions/dimensions-adjustment';
import { queryResponseStyles } from './../queryResponse.styles';

const AdaptiveCard = (props: any) => {
  let adaptiveCard: AdaptiveCardsAPI.AdaptiveCard | null = new AdaptiveCardsAPI.AdaptiveCard();
  const dispatch: AppDispatch = useDispatch();

  const { body, hostConfig } = props;
  const {dimensions: { response }, responseAreaExpanded,
    sampleQuery, queryRunnerStatus: queryStatus, adaptiveCard: card, theme } = useAppSelector((state) => state);
  const { data, pending } = card;

  const classes = classNames(props);
  const currentTheme: ITheme = getTheme();
  const textStyle = queryResponseStyles(currentTheme).queryResponseText.root as IStyle;

  const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
  const height = convertVhToPx(responseHeight, 220);

  useEffect(() => {
    dispatch(getAdaptiveCard(body, sampleQuery));

    if (!adaptiveCard) {
      adaptiveCard = new AdaptiveCardsAPI.AdaptiveCard();
    }

    if (hostConfig) {
      adaptiveCard.hostConfig = new AdaptiveCardsAPI.HostConfig(
        hostConfig
      );
    }

    return () => {
      adaptiveCard = null;
    }
  }, [body])


  const onPivotItemClick = (query: IQuery | undefined, item?: PivotItem) => {
    if (!item) { return; }
    const key = item.props.itemKey;
    if (key) {
      telemetry.trackTabClickEvent(key, query);
    }
  }

  if (!body) {
    return <div />;
  }

  if (body && pending) {
    return (
      <Label className={classes.emptyStateLabel}>
        <FormattedMessage id='Fetching Adaptive Card' />
        ...
      </Label>
    );
  }


  if (body && !pending) {
    if (!data || (queryStatus && !queryStatus.ok)) {
      return (
        <Label styles={{ root: textStyle }}>
          <FormattedMessage id='The Adaptive Card for this response is not available' />
          &nbsp;
          <Link
            href={'https://adaptivecards.io/designer/'}
            tabIndex={0}
            target='_blank'
            rel='noopener noreferrer'
            underline
          >
            <FormattedMessage id='Adaptive Cards designer' />
          </Link>
        </Label>
      );
    }

    try {
      adaptiveCard.parse(data.card);
      const renderedCard = adaptiveCard.render();

      if(renderedCard){
        renderedCard.style.backgroundColor = currentTheme.palette.neutralLighter;

        const applyTheme = (child: HTMLElement) => {
          if(!child){ return; }
          if(child && child.tagName === 'BUTTON'){ return; }

          child.style.color = currentTheme.palette.black;
          if (child.children.length > 0) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < child.children.length; i++) {
              applyTheme(child.children[i] as HTMLElement);
            }
          }
        }

        if(theme !== 'light'){
          applyTheme(renderedCard);
        }
      }

      const handleCopy = async () => {
        trackedGenericCopy(JSON.stringify(data.template, null, 4),
          componentNames.JSON_SCHEMA_COPY_BUTTON, sampleQuery);
      }
      return (
        <Pivot className='adaptive-pivot'
          onLinkClick={(pivotItem) => onPivotItemClick(sampleQuery, pivotItem)}
          styles={{ text: { fontSize: FontSizes.size14 } }}>
          <PivotItem
            itemKey='card'
            ariaLabel={translateMessage('card')}
            headerText={translateMessage('card')}
            className={classes.card}
            headerButtonProps={{
              'aria-controls': 'card-tab'
            }}
          >
            <div id={'card-tab'}
              ref={(n) => {
                if (n && !n.firstChild) {
                  n.appendChild(renderedCard as HTMLElement as HTMLElement);
                } else {
                  if (n && n.firstChild) {
                    n.replaceChild(renderedCard as HTMLElement as HTMLElement, n.firstChild);
                  }
                }
              }}
            />
          </PivotItem>
          <PivotItem
            itemKey='JSON-schema'
            ariaLabel={translateMessage('JSON Schema')}
            headerText={translateMessage('JSON Schema')}
            headerButtonProps={{
              'aria-controls': 'json-schema-tab'
            }}
          >
            <div id={'JSON-schema-tab'} tabIndex={0}>
              <MessageBar messageBarType={MessageBarType.info}>
                <FormattedMessage id='Get started with adaptive cards on' />
                <Link href={'https://learn.microsoft.com/en-us/adaptive-cards/templating/sdk'}
                  target='_blank'
                  rel='noopener noreferrer'
                  tabIndex={0}
                  underline
                >
                  <FormattedMessage id='Adaptive Cards Templating SDK' />
                </Link>
                <FormattedMessage id='and experiment on' />
                <Link href={'https://adaptivecards.io/designer/'}
                  target='_blank'
                  rel='noopener noreferrer'
                  tabIndex={0}
                  underline
                >
                  <FormattedMessage id='Adaptive Cards designer' />
                </Link>
              </MessageBar>
              <CopyButton
                className={classes.copyIcon}
                handleOnClick={handleCopy}
                isIconButton={true}
                style={{ float: 'right', zIndex: 1 }}
              />
              <Monaco
                language='json'
                body={data.template}
                height={height}
              />
            </div>
          </PivotItem>
        </Pivot>
      );
    } catch (err: any) {
      return <div style={{ color: 'red' }}>{err.message}</div>;
    }
  }
}

// @ts-ignore
const styledAdaptiveCard = styled(AdaptiveCard, queryResponseStyles as any);
const trackedComponent = telemetry.trackReactComponent(styledAdaptiveCard, componentNames.ADAPTIVE_CARDS_TAB);
// @ts-ignore
const IntlAdaptiveCard = injectIntl(trackedComponent);
export default IntlAdaptiveCard;
