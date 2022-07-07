import * as AdaptiveCardsAPI from 'adaptivecards';
import { Label, MessageBar, MessageBarType, Pivot, PivotItem, styled } from '@fluentui/react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { componentNames, telemetry } from '../../../../telemetry';
import { IAdaptiveCardProps } from '../../../../types/adaptivecard';
import { IQuery } from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import { getAdaptiveCard } from '../../../services/actions/adaptive-cards-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { queryResponseStyles } from './../queryResponse.styles';
import { CopyButton } from '../../common/copy/CopyButton';

class AdaptiveCard extends Component<IAdaptiveCardProps> {
  private adaptiveCard: AdaptiveCardsAPI.AdaptiveCard | null;

  constructor(props: IAdaptiveCardProps) {
    super(props);
    this.adaptiveCard = new AdaptiveCardsAPI.AdaptiveCard();
  }

  public componentDidMount() {
    const { body, sampleQuery, hostConfig } = this.props;
    this.props.actions!.getAdaptiveCard(body, sampleQuery);
    if (hostConfig) {
      this.adaptiveCard!.hostConfig = new AdaptiveCardsAPI.HostConfig(
        hostConfig
      );
    }
  }

  public componentDidUpdate(nextProps: IAdaptiveCardProps) {
    const { body, sampleQuery } = this.props;
    if (JSON.stringify(nextProps.body) !== JSON.stringify(body)) {
      // we need to update the card as our body has changed
      this.props.actions!.getAdaptiveCard(body, sampleQuery);
    }
  }

  public componentWillUnmount() {
    // setting the adaptive card reference to null so as to avoid memory leaks
    this.adaptiveCard = null;
  }

  public shouldComponentUpdate(nextProps: IAdaptiveCardProps) {

    if (JSON.stringify(this.props.body) !== JSON.stringify(nextProps.body)) {
      return true; // body has changed so card will too
    }
    if (JSON.stringify(nextProps.card.data) === JSON.stringify(this.props.card.data) ) {
      return false; // card still the same no need to re-render
    }
    return true;
  }

  public render() {
    const { data, pending } = this.props.card;
    const { body, queryStatus, sampleQuery } = this.props;
    const classes = classNames(this.props);

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
          <Label className={classes.emptyStateLabel}>
            <FormattedMessage id='The Adaptive Card for this response is not available' />
            &nbsp;
            <a
              className={classes.link}
              href={'https://adaptivecards.io/designer/'}
              tabIndex={0}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FormattedMessage id='Adaptive Cards designer' />
            </a>
          </Label>
        );
      }

      try {
        this.adaptiveCard!.parse(data.card);
        const renderedCard = this.adaptiveCard!.render();
        const handleCopy = async () =>{ trackedGenericCopy(JSON.stringify(data.template, null, 4),
          componentNames.JSON_SCHEMA_COPY_BUTTON, sampleQuery);
        }
        return (
          <Pivot className='pivot-response' onLinkClick={(pivotItem) => onPivotItemClick(sampleQuery, pivotItem)}>
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
                    n.appendChild(renderedCard as HTMLElement);
                  } else {
                    if (n && n.firstChild) {
                      n.replaceChild(renderedCard as HTMLElement, n.firstChild);
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
              <div id={'json-schema-tab'}>
                <MessageBar messageBarType={MessageBarType.info}>
                  <FormattedMessage id='Get started with adaptive cards on' />
                  <a href={'https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk'}
                    target='_blank'
                    rel='noopener noreferrer'
                    tabIndex={0}
                    className={'ms-Link'}
                  >
                    <FormattedMessage id='Adaptive Cards Templating SDK' />
                  </a>
                  <FormattedMessage id='and experiment on' />
                  <a href={'https://adaptivecards.io/designer/'}
                    target='_blank'
                    rel='noopener noreferrer'
                    tabIndex={0}
                    className={'ms-Link'}
                  >
                    <FormattedMessage id='Adaptive Cards designer' />
                  </a>
                </MessageBar>
                <CopyButton
                  className={classes.copyIcon}
                  handleOnClick={handleCopy}
                  isIconButton={true}
                />
                <Monaco
                  language='json'
                  body={data.template}
                  height={'800px'}
                />
              </div>
            </PivotItem>
          </Pivot>
        );
      } catch (err : any) {
        return <div style={{ color: 'red' }}>{err.message}</div>;
      }
    }
  }
}

function onPivotItemClick(query: IQuery | undefined, item?: PivotItem) {
  if (!item) { return; }
  const key = item.props.itemKey;
  if (key) {
    telemetry.trackTabClickEvent(key, query);
  }
}

function mapStateToProps({ adaptiveCard, sampleQuery, queryRunnerStatus }: IRootState) {
  return {
    card: adaptiveCard,
    sampleQuery,
    queryStatus: queryRunnerStatus
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      {
        getAdaptiveCard
      },
      dispatch
    )
  };
}
// @ts-ignore
const styledAdaptiveCard = styled(AdaptiveCard, queryResponseStyles as any);
const trackedComponent = telemetry.trackReactComponent(styledAdaptiveCard, componentNames.ADAPTIVE_CARDS_TAB);
// @ts-ignore
const IntlAdaptiveCard = injectIntl(trackedComponent);
export default connect(mapStateToProps, mapDispatchToProps)(IntlAdaptiveCard);
