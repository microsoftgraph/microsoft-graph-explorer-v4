import * as React from 'react';
import {
  FontSizes, getTheme, IStackStyles, IStackTokens, Label, MessageBar, MessageBarType, Stack
} from '@fluentui/react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '../settings';
import { FeedbackButton } from '../app-sections/FeedbackButton';
import { Authentication } from '../authentication';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../types/root';
import { Mode } from '../../../types/enums';


const currentTheme = getTheme();
const sectionStackTokens: IStackTokens = {
  childrenGap: 0 };
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10
};
const itemAlignmentsStackStyles: IStackStyles = {
  root: {
    background: currentTheme.palette.themeTertiary,
    height: 50
  }
};
const itemStyles: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex'
};

export const MainHeader: React.FunctionComponent = () => {
  const { authToken, graphExplorerMode } = useSelector(
    (state: IRootState) => state
  );
  const tokenPresent = !!authToken.token;


  return (
    <Stack tokens={sectionStackTokens}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        styles={itemAlignmentsStackStyles}
        tokens={itemAlignmentsStackTokens}>
        <Stack>
          <Label
            style={{fontSize: FontSizes.xLarge,
              fontWeight: 600}}>
          Graph Explorer
          </Label>
        </Stack>
        <Stack >
          <span style={itemStyles}>
            <FeedbackButton />
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
