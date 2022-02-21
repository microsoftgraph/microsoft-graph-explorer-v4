import { getId, IconButton, IStackTokens, Label, Stack, TooltipHost } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FeedbackButton } from './FeedbackButton';

export function appTitleDisplayOnFullScreen(
  classes: any,
  minimised: any,
  toggleSidebar: Function,
): React.ReactNode{

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
        styles={{root: { position:'relative', top: '17px'}}}
        onClick={() => toggleSidebar()} />
    </TooltipHost>
    <div className={classes.graphExplorerLabelContainer} role={'heading'} aria-level={1}>
      {!minimised &&
        <>
          {displayGraphLabel(classes)}
        </>}
    </div>
    <div>
      {!minimised &&
      <div style={{position: 'relative', top: '5px'}}>
        <FeedbackButton/>
      </div>
      }
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
      <div style={{position:'absolute', top: '-1px', right: '15px'}}>
        <FeedbackButton/>
      </div>
    </>
  </Stack>;
}

function displayGraphLabel(classes: any): React.ReactNode {
  return (
    <Label className={classes.graphExplorerLabel}>
      Graph Explorer
    </Label>
  )
}
