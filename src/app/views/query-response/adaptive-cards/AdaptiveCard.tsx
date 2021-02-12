import { getTheme } from '@uifabric/styling/lib/styles/theme';
import * as AdaptiveCardsAPI from 'adaptivecards';
import { IconButton, Label, MessageBar, MessageBarType, Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { componentNames, telemetry } from '../../../../telemetry';
import { IAdaptiveCardProps } from '../../../../types/adaptivecard';
import { getAdaptiveCard } from '../../../services/actions/adaptive-cards-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { Monaco } from '../../common';
import { genericCopy } from '../../common/copy';
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
    this.adaptiveCard = new AdaptiveCardsAPI.AdaptiveCard();
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
    const currentTheme = getTheme();
    const labelStyles = queryResponseStyles(currentTheme).emptyStateLabel;
    const link = queryResponseStyles(currentTheme).link;
    const cardStyles: any = queryResponseStyles(currentTheme).card;
    const copyIcon: any = queryResponseStyles(currentTheme).copyIcon;
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
        <Pivot className='pivot-response'>
          <PivotItem
            key='card'
            ariaLabel={translateMessage('card')}
            headerText={'Card'}
            style={cardStyles}
          >
            <div
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
          </PivotItem>
          <PivotItem
            key='templateJSON'
            ariaLabel={translateMessage('JSON Schema')}
            headerText={'JSON Schema'}
          >
            <MessageBar messageBarType={MessageBarType.info}>
              <FormattedMessage id='Get started with adaptive cards on' />
              <a href={'https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk'}
                target='_blank'
                rel='noopener noreferrer'
                tabIndex={0}
              >
                <FormattedMessage id='Adaptive Cards Templating SDK' />
              </a>
            </MessageBar>
            <IconButton style={copyIcon}
              iconProps={{
                iconName: 'copy',
              }}
              onClick={async () => genericCopy(JSON.stringify(data, null, 4))}
            />
            <Monaco
              language='json'
              body={data}
              height={'800px'}
            />
          </PivotItem>
        </Pivot>
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
const trackedComponent = telemetry.trackReactComponent(AdaptiveCard, componentNames.ADAPTIVE_CARDS_TAB);
// @ts-ignore
const IntlAdaptiveCard = injectIntl(trackedComponent);
export default connect(mapStateToProps, mapDispatchToProps)(IntlAdaptiveCard);
