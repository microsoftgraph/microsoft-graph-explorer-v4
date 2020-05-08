import { IconButton, IStackTokens, Label, Stack } from 'office-ui-fabric-react';
import React from 'react';
import { Authentication } from '../authentication';

export function appTitleDisplayOnFullScreen(
    classes: any,
    minimised: any,
    toggleSidebar: Function,
    ): React.ReactNode {

    return <div style={{ display: 'flex', width: '100%' }}>
      <IconButton
        iconProps={{ iconName: 'GlobalNavButton' }}
        className={classes.sidebarToggle}
        title='Minimise sidebar'
        ariaLabel='Minimise sidebar'
        onClick={() => toggleSidebar()} />
      <div className={classes.graphExplorerLabelContainer}>
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
        <div style={{ padding: 10 }}>
          <Label className={classes.graphExplorerLabel}>
            Graph Explorer
          </Label>
        </div>
      </>
    </Stack>;
  }