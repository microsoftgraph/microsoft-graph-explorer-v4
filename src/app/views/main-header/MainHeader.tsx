import {
  FontIcon, getId, getTheme, IconButton, IStackTokens, Label,
  registerIcons, Stack, TooltipHost
} from '@fluentui/react';
import { FormattedMessage } from 'react-intl';

import { Settings } from './settings/Settings';
import { FeedbackButton } from './FeedbackButton';
import { Authentication } from '../authentication';
import { Help } from './Help';
import { mainHeaderStyles } from './MainHeader.styles';
import TenantIcon from './tenantIcon';
import { Mode } from '../../../types/enums';
import { useAppSelector } from '../../../store';

interface MainHeaderProps {
  minimised: boolean;
  toggleSidebar: Function;
  mobileScreen: boolean;
}
const sectionStackTokens: IStackTokens = {
  childrenGap: 0
};
const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 10
};

registerIcons({
  icons: {
    tenantIcon: <TenantIcon />
  }
});
export const MainHeader: React.FunctionComponent<MainHeaderProps> = (props: MainHeaderProps) => {
  const { profile, graphExplorerMode } = useAppSelector(
    (state) => state
  );
  const minimised = props.minimised;
  const mobileScreen = props.mobileScreen;
  const currentTheme = getTheme();
  const { rootStyles: itemAlignmentStackStyles, rightItemsStyles, graphExplorerLabelStyles,
    feedbackIconAdjustmentStyles, tenantIconStyles, moreInformationStyles,
    tenantLabelStyle, tenantContainerStyle } = mainHeaderStyles(currentTheme, mobileScreen);

  return (
    <Stack tokens={sectionStackTokens}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        styles={itemAlignmentStackStyles}
        tokens={itemAlignmentsStackTokens}>

        <Stack horizontal tokens={{ childrenGap: 5, padding: 10 }}>
          {graphExplorerMode === Mode.Complete &&

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
                iconProps={{
                  iconName:
                    !minimised && !mobileScreen ? 'ClosePaneMirrored' :
                      mobileScreen ? 'GlobalNavButton' : 'OpenPaneMirrored',
                  style: { fontSize: '20px' }
                }}
                ariaLabel={!minimised ? 'Minimize sidebar' : 'Maximize sidebar'}
                onClick={() => props.toggleSidebar()}
                name={'Minimize sidebar'}
              />
            </TooltipHost>
          }
          <h1><Label
            style={graphExplorerLabelStyles}>
            Graph Explorer
          </Label></h1>
        </Stack>

        <Stack horizontal styles={rightItemsStyles}
          tokens={{ childrenGap: mobileScreen ? 0 : 10 }}
        >
          {!mobileScreen && <FontIcon aria-label='tenant icon' iconName='tenantIcon' style={tenantIconStyles} />}
          {!profile && !mobileScreen &&
            <div style={tenantContainerStyle}>
              <TooltipHost
                content={
                  <>
                    <FormattedMessage id='Using demo tenant' />{' '}
                    <FormattedMessage id='To access your own data:' />
                  </>}
                id={getId()}
                calloutProps={{ gapSpace: 0 }}
              >
                <Label style={tenantLabelStyle}> Tenant</Label>
                <Label>Sample</Label>
              </TooltipHost>
            </div>
          }
          {profile && !mobileScreen &&
            <div style={tenantContainerStyle}>
              <Label style={tenantLabelStyle}>Tenant</Label>
              <Label>{profile.tenant}</Label>
            </div>
          }
          <span style={moreInformationStyles}> <Settings /> </span>
          <span style={moreInformationStyles}> <Help /> </span>
          <span style={feedbackIconAdjustmentStyles}> <FeedbackButton /> </span>
          <Authentication />
        </Stack>
      </Stack>
    </Stack>
  );
};
