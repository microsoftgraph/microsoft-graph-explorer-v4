import {
  FontIcon, getId, getTheme, IconButton, IStackTokens, Label,
  registerIcons, Stack, Toggle, TooltipHost
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
import { translateMessage } from '../../utils/translate-messages';
import { AppOnlyToken, switchToAppOnlyCalls } from '../../services/actions/app-only-switch-action-creator';
import { useDispatch } from 'react-redux';
import { copyFromClipboard } from '../common/copy';

interface MainHeaderProps {
  toggleSidebar: Function;
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
  const { profile, graphExplorerMode, sidebarProperties } = useAppSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  const mobileScreen = !!sidebarProperties.mobileScreen;
  const showSidebar = !!sidebarProperties.showSidebar;
  const minimised = !mobileScreen && !showSidebar;

  const currentTheme = getTheme();
  const { rootStyles: itemAlignmentStackStyles, rightItemsStyles, graphExplorerLabelStyles,
    feedbackIconAdjustmentStyles, tenantIconStyles, moreInformationStyles,
    tenantLabelStyle, tenantContainerStyle } = mainHeaderStyles(currentTheme, mobileScreen);

  const switchToAppOnly = async (_event: React.MouseEvent<HTMLElement>, checked?: boolean | undefined) => {
    // write logic to open vs code extension to retrieve token

    const accessToken = await copyFromClipboard();
    console.log('HEre is the token ', accessToken);

    const appOnlyToken: AppOnlyToken = {
      isAppOnly: checked ? checked : false,
      accessToken

    }
    dispatch(switchToAppOnlyCalls(appOnlyToken));
  }

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
          <Toggle label='App only'
            onChange={switchToAppOnly}
            onText={translateMessage('On')}
            offText={translateMessage('Off')}
            inlineLabel
            styles={{ text: { position: 'relative', top: '4px' } }}
          />
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
