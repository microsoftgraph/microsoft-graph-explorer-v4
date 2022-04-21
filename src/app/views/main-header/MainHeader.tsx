import * as React from 'react';
import {
  FontSizes, getTheme, IStackStyles, IStackTokens, Label, Stack
} from '@fluentui/react';

import { Settings } from '../settings';
import { FeedbackButton } from '../app-sections/FeedbackButton';

const currentTheme = getTheme();
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10
};
const itemAlignmentsStackStyles: IStackStyles = {
  root: {
    background: currentTheme.palette.themeTertiary,
    height: 50,
    marginBottom: 10
  }
};
const itemStyles: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex'
};

export const MainHeader: React.FunctionComponent = () => {

  return (
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
        </span>
        <span style={itemStyles}></span>
      </Stack>


    </Stack>
  );
};
