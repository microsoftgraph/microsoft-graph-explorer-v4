import * as React from 'react';
import {
  FontSizes,
  getId,
  getTheme,
  IconButton,
  IStackStyles,
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


interface MainHeaderProps {
  minimised: boolean;
  toggleSidebar: Function;
}
const currentTheme = getTheme();
const sectionStackTokens: IStackTokens = {
  childrenGap: 0 };
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10
};
const itemAlignmentsStackStyles: IStackStyles = {
  root: {
    background: currentTheme.palette.neutralLight,
    height: 50
  }
};
const itemStyles: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex'
};

export const MainHeader: React.FunctionComponent <MainHeaderProps> = (props: MainHeaderProps) => {
  const { authToken, graphExplorerMode } = useSelector(
    (state: IRootState) => state
  );
  const tokenPresent = !!authToken.token;
  const minimised = props.minimised;

  return (
    <Stack tokens={sectionStackTokens}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        styles={itemAlignmentsStackStyles}
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
              //className={classes.sidebarToggle}
              ariaLabel={!minimised ? 'Minimize sidebar' : 'Maximize sidebar'}
              styles={{root: { position:'relative', top: '3px'}}}
              onClick={() => props.toggleSidebar()} />
          </TooltipHost>
          <Label
            style={{fontSize: FontSizes.xLarge,
              fontWeight: 600}}>
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
      <Stack style={{marginBottom:'10px'}}>
        {!tokenPresent &&
            graphExplorerMode === Mode.Complete &&
            showUnAuthenticatedText()}
      </Stack>
    </Stack>
  );
};

const showUnAuthenticatedText = (): React.ReactNode => {
  return (
    <>
      <br />
      <MessageBar messageBarType={MessageBarType.warning} isMultiline={true}>
        <FormattedMessage id='Using demo tenant' />{' '}
        <FormattedMessage id='To access your own data:' />
      </MessageBar>
    </>
  );
};
