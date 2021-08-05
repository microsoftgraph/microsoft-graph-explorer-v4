import * as AdaptiveCardsAPI from 'adaptivecards';
import { IconButton, Label, MessageBar, MessageBarType, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { componentNames, telemetry } from '../../../../telemetry';
import { IAdaptiveCardProps } from '../../../../types/adaptivecard';
import { IRootState } from '../../../../types/root';
import { getAdaptiveCard } from '../../../services/actions/adaptive-cards-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { queryResponseStyles } from './../queryResponse.styles';

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
    if (
      JSON.stringify(nextProps.card.data) === JSON.stringify(this.props.card.data)
    ) {
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
        return (
          <div>
            <div className={classes.container}>
              <div className={classes.column}>
                <MessageBar messageBarType={MessageBarType.info}>
                  <FormattedMessage id='Get started with adaptive cards on' />
                  <a href={'https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk'}
                    target='_blank'
                    rel='noopener noreferrer'
                    tabIndex={0}
                    className={classes.link}
                  >
                    <FormattedMessage id='Adaptive Cards Templating SDK' />
                  </a>
                  <FormattedMessage id='and experiment on' />
                  <a href={'https://adaptivecards.io/designer/'}
                    target='_blank'
                    rel='noopener noreferrer'
                    tabIndex={0}
                    className={classes.link}
                  >
                    <FormattedMessage id='Adaptive Cards designer' />
                  </a>
                </MessageBar>
              </div>
              <div className={classes.columnicon} >
                <IconButton className={classes.copyIcon}
                  ariaLabel={translateMessage('Copy')}
                  iconProps={{
                    iconName: 'copy',
                  }}
                  onClick={async () =>
                    trackedGenericCopy(
                      JSON.stringify(data.template, null, 4),
                      componentNames.JSON_SCHEMA_COPY_BUTTON,
                      sampleQuery)}
                />
              </div>
            </div>
            <div className={classes.container}>
              <div className={classes.column}
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
              <div className={classes.monacoColumn}>
                <Monaco
                  language='json'
                  body={data.template}
                  height={'800px'}
                />
              </div>
            </div>
          </div>
        );
      } catch (err) {
        return <div style={{ color: 'red' }}>{err.message}</div>;
      }
    }
  }
}

function mapStateToProps({ adaptiveCard, sampleQuery, queryRunnerStatus }: IRootState) {
  return {
    card: adaptiveCard,
    sampleQuery,
    queryStatus: queryRunnerStatus,
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      {
        getAdaptiveCard,
      },
      dispatch
    ),
  };
}
// @ts-ignore
const styledAdaptiveCard = styled(AdaptiveCard, queryResponseStyles as any);
const trackedComponent = telemetry.trackReactComponent(styledAdaptiveCard, componentNames.ADAPTIVE_CARDS_TAB);
// @ts-ignore
const IntlAdaptiveCard = injectIntl(trackedComponent);
export default connect(mapStateToProps, mapDispatchToProps)(IntlAdaptiveCard);
