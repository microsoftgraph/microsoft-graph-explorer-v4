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

import { Settings} from './settings/Settings';
import { FeedbackButton } from './FeedbackButton';
import { Authentication } from '../authentication';
import { Help } from './Help';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../types/root';
import { mainHeaderStyles } from './MainHeader.styles';
import { translateMessage } from '../../utils/translate-messages';
import TenantIcon from './tenantIcon';

interface MainHeaderProps {
  minimised: boolean;
  toggleSidebar: Function;
  mobileScreen: boolean;
}
const sectionStackTokens: IStackTokens = {
  childrenGap: 0 };
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 10

};

export const MainHeader: React.FunctionComponent <MainHeaderProps> = (props: MainHeaderProps) => {
  const { profile } = useSelector(
    (state: IRootState) => state
  );
  const minimised = props.minimised;
  const mobileScreen = props.mobileScreen;
  const currentTheme = getTheme();
  const { rootStyles : itemAlignmentStackStyles, rightItemsStyles,
    feedbackIconAdjustmentStyles, tenantStyles, moreInformationStyles } = mainHeaderStyles(currentTheme);

  return (
    <Stack tokens={sectionStackTokens}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        styles={itemAlignmentStackStyles}
        tokens={itemAlignmentsStackTokens}>

        <Stack horizontal tokens={{childrenGap:5,padding: 10 }}>
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
              iconProps={{ iconName: !minimised ? 'ClosePaneMirrored': 'OpenPaneMirrored',
                style: { fontSize: '20px'} }}
              ariaLabel={!minimised ? 'Minimize sidebar' : 'Maximize sidebar'}
              onClick={() => props.toggleSidebar()} />
          </TooltipHost>
          <Label
            style={{ fontSize: mobileScreen ? FontSizes.medium : FontSizes.xLarge,
              fontWeight: FontWeights.semibold }}>
            Graph Explorer
          </Label>
        </Stack>

        <Stack horizontal styles={rightItemsStyles} >
          <TenantIcon />
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
              <DefaultButton text={translateMessage('Tenant: Sample')}
                style={tenantStyles}/>
            </TooltipHost>
          }
          {profile &&
            <DefaultButton text={`Tenant: ${profile.tenant}`} checked={true}
              style={tenantStyles}
            />
          }
          <span style={ moreInformationStyles }> <Settings /> </span>
          <span style={ moreInformationStyles }> <Help /> </span>
          <span style={ feedbackIconAdjustmentStyles }> <FeedbackButton /> </span>
          <Authentication />
        </Stack>
      </Stack>
    </Stack>
  );
};
