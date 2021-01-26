import { getId, IconButton, IStackTokens, Label, Stack, TooltipHost } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export function appTitleDisplayOnFullScreen(
  classes: any,
  minimised: any,
  toggleSidebar: Function,
): React.ReactNode {

  return <div style={{ display: 'flex', width: '100%' }}>
    <TooltipHost
      content='Minimize sidebar'
      id={getId()}
      calloutProps={{ gapSpace: 0 }}
      tooltipProps={{
        onRenderContent: function renderContent() {
          return <div>
            <FormattedMessage id={'Minimize sidebar'} /></div>
        }
      }}>
      <IconButton
        iconProps={{ iconName: 'GlobalNavButton' }}
        className={classes.sidebarToggle}
        ariaLabel='Minimize sidebar'
        onClick={() => toggleSidebar()} />
    </TooltipHost>
      <div className={classes.graphExplorerLabelContainer} role={'heading'} aria-level={1}>
      {!minimised &&
        <>
          <Label className={classes.graphExplorerLabel}>
            Graph Explorer
            </Label>
        </>}
    </div>
  </div>;
}

export function appTitleDisplayOnMobileScreen(
  stackTokens: IStackTokens,
  classes: any,
  toggleSidebar: Function
): React.ReactNode {
  return <Stack horizontal={true} disableShrink={true} tokens={stackTokens}>
    <>
      <IconButton
        iconProps={{ iconName: 'GlobalNavButton' }}
        className={classes.sidebarToggle}
        title='Remove sidebar'
        ariaLabel='Remove sidebar'
        onClick={() => toggleSidebar()}
      />
        <div style={{ padding: 10 }} role={'heading'} aria-level={1}>
        <Label className={classes.graphExplorerLabel}>
          Graph Explorer
          </Label>
      </div>
    </>
  </Stack>;
}