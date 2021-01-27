import { getTheme } from '@uifabric/styling/lib/styles/theme';
import * as AdaptiveCardsAPI from 'adaptivecards';
import { Label } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { telemetry } from '../../../../telemetry';
import { ADAPTIVE_CARDS_TAB } from '../../../../telemetry/component-names';
import { IAdaptiveCardProps } from '../../../../types/adaptivecard';
import { getAdaptiveCard } from '../../../services/actions/adaptive-cards-action-creator';
import { queryResponseStyles } from './../queryResponse.styles';

class AdaptiveCard extends Component<IAdaptiveCardProps> {
  private adaptiveCard: AdaptiveCardsAPI.AdaptiveCard;

  constructor(props: IAdaptiveCardProps) {
    super(props);
    this.adaptiveCard = new AdaptiveCardsAPI.AdaptiveCard();
  }

  public componentDidMount() {
    const { body, sampleQuery, hostConfig } = this.props;
    this.props.actions!.getAdaptiveCard(body, sampleQuery);
    if (hostConfig) {
      this.adaptiveCard.hostConfig = new AdaptiveCardsAPI.HostConfig(
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
    // Remove all references
    delete this.adaptiveCard;
  }

  public shouldComponentUpdate(nextProps: IAdaptiveCardProps) {
    if (JSON.stringify(this.props.body) !== JSON.stringify(nextProps.body)) {
      return true; // body has changed so card will too
    }
    if (
      JSON.stringify(nextProps.card.data) ===
      JSON.stringify(this.props.card.data)
    ) {
      return false; // card still the same no need to re-render
    }
    return true;
  }

  public render() {
    const currentTheme = getTheme();
    const labelStyles = queryResponseStyles(currentTheme).emptyStateLabel;
    const link = queryResponseStyles(currentTheme).link;
    const { data, pending } = this.props.card;
    const { body, queryStatus } = this.props;

    if (!body) {
      return <div />;
    }

    if (body && pending) {
      return (
        <Label style={labelStyles}>
          <FormattedMessage id='Fetching Adaptive Card' />
          ...
        </Label>
      );
    }

    if (body && !pending) {
      if (!data || (queryStatus && !queryStatus.ok)) {
        return (
          <Label style={labelStyles}>
            <FormattedMessage id='The Adaptive Card for this response is not available' />
            &nbsp;
            <a
              style={link}
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
    }

    try {
      this.adaptiveCard.parse(data);
      const renderedCard = this.adaptiveCard.render();
      return (
        <div
          style={{
            minHeight: '500px',
            maxHeight: '800px',
            overflowY: 'auto',
          }}
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
      );
    } catch (err) {
      return <div style={{ color: 'red' }}>{err.message}</div>;
    }
  }
}

function mapStateToProps(state: any) {
  return {
    card: state.adaptiveCard,
    sampleQuery: state.sampleQuery,
    queryStatus: state.queryRunnerStatus,
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
const trackedComponent = telemetry.trackReactComponent(AdaptiveCard, ADAPTIVE_CARDS_TAB);
// @ts-ignore
const IntlAdaptiveCard = injectIntl(trackedComponent);
export default connect(mapStateToProps, mapDispatchToProps)(IntlAdaptiveCard);
