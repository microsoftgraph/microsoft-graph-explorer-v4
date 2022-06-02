import * as React from 'react';
import {
  DefaultButton,
  getId,
  getTheme,
  IconButton,
  IStackTokens,
  Label,
  registerIcons,
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
import { useEllipsisDetector } from '../../custom-hooks/ellipsis-detector';

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

registerIcons({
  icons: {
    tenantIcon: <TenantIcon />
  }
});
export const MainHeader: React.FunctionComponent <MainHeaderProps> = (props: MainHeaderProps) => {
  const { profile } = useSelector(
    (state: IRootState) => state
  );
  const minimised = props.minimised;
  const mobileScreen = props.mobileScreen;
  const theme = getTheme();
  const showTooltipContent : boolean = useEllipsisDetector('tenantLabel');

  const { rootStyles : itemAlignmentStackStyles, rightItemsStyles, graphExplorerLabelStyles,
    feedbackIconAdjustmentStyles, tenantStyles, moreInformationStyles } =
    mainHeaderStyles({theme, mobileScreen, showTooltipContent});

  const renderLabel = (tenantLabel: string): JSX.Element => {
    return (
      <span style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: '150px'
      }}
      className='tenantLabel'
      key={tenantLabel}
      >
        {`Tenant: ${'Verylooooooooooooooooooooooooooooooooooooooong'}`}
      </span>)
  }

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
            style={graphExplorerLabelStyles}>
            Graph Explorer
          </Label>
        </Stack>

        <Stack horizontal styles={rightItemsStyles} >
          {!profile && !mobileScreen &&
            <TooltipHost
              content={
                <>
                  <FormattedMessage id='Using demo tenant' />{' '}
                  <FormattedMessage id='To access your own data:' />
                </>}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
            >
              <DefaultButton iconProps={{ iconName: 'tenantIcon'}} text={translateMessage('Tenant: Sample')}
                style={tenantStyles}/>
            </TooltipHost>
          }
          {profile && !mobileScreen &&
          <TooltipHost
            id={getId()}
            calloutProps={{ gapSpace: 0 }}
            content={showTooltipContent ? 'Verylooooooooooooooooooooooooooooooooooooooong' : ''}
          >
            <DefaultButton  iconProps={{ iconName: 'tenantIcon'}}
              onRenderText={() => renderLabel(profile.tenant)}
              checked={true}
              style={tenantStyles}
            />
          </TooltipHost>
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
