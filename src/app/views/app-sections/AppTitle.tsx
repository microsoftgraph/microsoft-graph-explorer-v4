import { getId, IconButton, IStackTokens, Label, Stack, TooltipHost } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'office-ui-fabric-react';

export function appTitleDisplayOnFullScreen(
  classes: any,
  minimised: any,
  authenticated: any,
  toggleSidebar: Function,
  permissionType: boolean,
  changeMode: Function
): React.ReactNode {

  return <div style={{ display: 'flex', width: '100%' }}>

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
        className={classes.sidebarToggle}
        ariaLabel={!minimised ? 'Minimize sidebar' : 'Maximize sidebar'}
        onClick={() => toggleSidebar()} />
    </TooltipHost>
    <div className={classes.graphExplorerLabelContainer} role={'heading'} aria-level={1}>
      {!minimised &&
        <>
          {displayGraphLabel(classes, permissionType)}
        </>}
    </div>
    <div style={{ marginTop: 15 }}>
      {

        !minimised && authenticated &&
        <>
          {permissionsModeButton(changeMode, permissionType)}
        </>
      }
    </div>
  </div>;
}

export function appTitleDisplayOnMobileScreen(
  stackTokens: IStackTokens,
  classes: any,
  minimised: any,
  authenticated: any,
  toggleSidebar: Function,
  permissionType: boolean,
  changeMode: Function
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
        {displayGraphLabel(classes, permissionType)}
      </div>
      <div style={{ marginTop: 15 }}>
        {
          !minimised && authenticated &&
          <>
            {permissionsModeButton(changeMode, permissionType)}
          </>
        }
      </div>

    </>
  </Stack>;
}

function displayGraphLabel(classes: any, permissionType: boolean): React.ReactNode {
  return (
    <Label className={classes.graphExplorerLabel}>
      Graph Explorer {permissionType ? "(as person)" : "(as app)"}
    </Label>
  )
}

function permissionsModeButton(changeMode: Function, permissionType: boolean) {
  return (
    <IconButton
      iconProps={{ iconName: 'Cat' }}
      onClick={() => changeMode(!permissionType)} />
  )
}