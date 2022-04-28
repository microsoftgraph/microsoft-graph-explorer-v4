import { IconButton, IStackTokens, Label, Stack } from '@fluentui/react';
import React from 'react';
import { FeedbackButton } from './FeedbackButton';

export function appTitleDisplayOnFullScreen(
  classes?: any
): React.ReactNode{

  return <div style={{ display: 'flex', width: '100%' }}>
    <div className={classes.graphExplorerLabelContainer} role={'heading'} aria-level={1}>
      <>
        {displayGraphLabel(classes)}
      </>
    </div>
    <div>
      <div className={classes.feedbackButtonFullScreenDisplay}>
        <FeedbackButton/>
      </div>
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
        {displayGraphLabel(classes)}
      </div>
      <div className={classes.feedbackButtonMobileDisplay}>
        <FeedbackButton/>
      </div>
    </>
  </Stack>;
}

export function displayGraphLabel(classes: any): React.ReactNode {
  return (
    <Label className={classes.graphExplorerLabel}>
      Graph Explorer
    </Label>
  )
}
