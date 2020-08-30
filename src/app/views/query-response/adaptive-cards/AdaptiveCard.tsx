import * as AdaptiveCardsAPI from 'adaptivecards';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAdaptiveCardProps } from '../../../../types/adaptivecard';
import { getAdaptiveCard } from '../../../services/actions/adaptive-cards-action-creator';
import { Monaco } from '../../common';

class AdaptiveCard extends Component<IAdaptiveCardProps> {
  private adaptiveCard: AdaptiveCardsAPI.AdaptiveCard;
  constructor(props: IAdaptiveCardProps) {
    super(props);
    this.adaptiveCard = new AdaptiveCardsAPI.AdaptiveCard();
  }

  public componentDidMount() {
    const { body , sampleQuery, hostConfig } = this.props;
    this.props.actions!.getAdaptiveCard(body, sampleQuery);
    if (hostConfig) {
      this.adaptiveCard.hostConfig = new AdaptiveCardsAPI.HostConfig(hostConfig);
    }
  }

  public componentDidUpdate(nextProps: IAdaptiveCardProps) {
    const { body , sampleQuery } = this.props;
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
    if (JSON.stringify(nextProps.card.data) === JSON.stringify(this.props.card.data)) {
      return false; // card still the same no need to re-render
    }
    return true;
  }

  public render() {
    const { data , pending } = this.props.card;
    const {
      intl: { messages },
    }: any = this.props;

    if (pending) {
      return (<Monaco
        body={`${messages['Fetching Adaptive Card']} ...`}
      />);
    }

    if (data) {
      try {
        this.adaptiveCard.parse(data);
        const renderedCard = this.adaptiveCard.render();
        return <div style={{minHeight: '500px', maxHeight: '800px', overflowY : 'auto' }} ref={(n) => {
          if (n && n.firstChild === null) {
            n.appendChild(renderedCard);
          } else {
            if (n && n.firstChild !== null) {
              n.replaceChild(renderedCard, n.firstChild);
            }
          }
        }}/>;
      } catch (err) {
        return <div style={{ color: 'red' }}>{err.message}</div>;
      }
    } else {
        return (<Monaco
          body={data === null ? `${messages['The Adaptive Card for this response is not available']}` : ''}
        />);
    }
  }
}

function mapStateToProps(state: any) {
  return {
    card: state.adaptiveCard,
    sampleQuery: state.sampleQuery
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators({
      getAdaptiveCard
    }, dispatch),
  };
}

// @ts-ignore
const IntlAdaptiveCard = injectIntl(AdaptiveCard);
export default connect(mapStateToProps, mapDispatchToProps)(IntlAdaptiveCard);
