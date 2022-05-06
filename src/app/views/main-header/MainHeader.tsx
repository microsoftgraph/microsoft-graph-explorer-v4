import * as React from 'react';
import {
  FontSizes,
  FontWeights,
  getId,
  getTheme,
  IconButton,
  IStackTokens,
  Label,
  MessageBar,
  MessageBarType,
  Stack,
  TooltipHost
} from '@fluentui/react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '../settings';
import { FeedbackButton } from '../app-sections/FeedbackButton';
import { Authentication } from '../authentication';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../types/root';
import { Mode } from '../../../types/enums';
import { mainHeaderStyles } from './MainHeader.styles';
import { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';


interface MainHeaderProps {
  minimised: boolean;
  toggleSidebar: Function;
}
const sectionStackTokens: IStackTokens = {
  childrenGap: 0 };
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10
};

export const MainHeader: React.FunctionComponent <MainHeaderProps> = (props: MainHeaderProps) => {
  const { authToken, graphExplorerMode } = useSelector(
    (state: IRootState) => state
  );
  const [displayMessage, setDisplayMessage] = useState(true);
  const tokenPresent = !!authToken.token;
  const minimised = props.minimised;
  const currentTheme = getTheme();
  const itemAlignmentStackStyles = mainHeaderStyles(currentTheme, authToken).rootStyles;
  const itemStyles = mainHeaderStyles(currentTheme).authenticationItemStyles;

  const showUnAuthenticatedText = (): React.ReactNode => {
    return (
      <>
        <br />
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={true}
          onDismiss={() => setDisplayMessage(false)}
          dismissButtonAriaLabel={translateMessage('Close')}
        >
          <FormattedMessage id='Using demo tenant' />{' '}
          <FormattedMessage id='To access your own data:' />
        </MessageBar>
      </>
    );
  };

  return (
    <Stack tokens={sectionStackTokens}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        styles={itemAlignmentStackStyles}
        tokens={itemAlignmentsStackTokens}>

        <Stack horizontal>
          <TooltipHost
            content={!minimised ? 'Minimize sidebar' : 'Maximize sidebar'}
            id={getId()}
            calloutProps={{ gapSpace: 0 }}
            tooltipProps={{
              onRenderContent: function renderContent() {
                return <div>
                  <FormattedMessage id={!minimised ? 'Minimize sidebar' : 'Maximize sidebar'} /></div>
              }
            }}>
            <IconButton
              iconProps={{ iconName: 'GlobalNavButton' }}
              ariaLabel={!minimised ? 'Minimize sidebar' : 'Maximize sidebar'}
              onClick={() => props.toggleSidebar()} />
          </TooltipHost>
          <Label
            style={{ fontSize: FontSizes.xLarge, fontWeight: FontWeights.semibold }}>
            Graph Explorer
          </Label>
          <FeedbackButton />
        </Stack>

        <Stack >
          <span style={itemStyles}>
            <Settings />
            <Authentication />
          </span>
          <span style={itemStyles}></span>
        </Stack>

      </Stack>
      <Stack style={{marginBottom:'7px'}}>
        {!tokenPresent && displayMessage &&
            graphExplorerMode === Mode.Complete &&
            showUnAuthenticatedText()}
      </Stack>
    </Stack>
  );
};

