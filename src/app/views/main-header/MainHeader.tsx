import * as React from 'react';
import {
  DefaultButton,
  FontSizes,
  FontWeights,
  getId,
  getTheme,
  IconButton,
  IStackTokens,
  Label,
  Stack,
  TooltipHost
} from '@fluentui/react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '../settings';
import { FeedbackButton } from '../app-sections/FeedbackButton';
import { Authentication } from '../authentication';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../types/root';
import { mainHeaderStyles } from './MainHeader.styles';
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
  const { profile } = useSelector(
    (state: IRootState) => state
  );
  const minimised = props.minimised;
  const currentTheme = getTheme();
  const itemAlignmentStackStyles = mainHeaderStyles(currentTheme).rootStyles;
  const rightItemsStyles = mainHeaderStyles(currentTheme).rightItemsStyles;
  const feedbackIconAdjustmentStyles = mainHeaderStyles(currentTheme).feedbackIconAdjustmentStyles;

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
        </Stack>

        <Stack horizontal styles={rightItemsStyles}>
          {!profile &&
            <TooltipHost
              content={
                <>
                  <FormattedMessage id='Using demo tenant' />{' '}
                  <FormattedMessage id='To access your own data:' />
                </>}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
            >
              <DefaultButton text={translateMessage('Sample Tenant')} checked={true} style={{border: 'none'}}/>
            </TooltipHost>
          }
          {profile &&
            <DefaultButton text={`${profile.tenant} Tenant`} checked={true} style={{border: 'none', cursor: 'default'}}
            />
          }
          <span style={feedbackIconAdjustmentStyles}> <FeedbackButton /> </span>
          <Settings />
          <Authentication />
        </Stack>
      </Stack>
    </Stack>
  );
};
