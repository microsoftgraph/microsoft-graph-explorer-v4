import { getTheme, ITheme, PrimaryButton, TeachingBubble, TeachingBubbleContent } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ITourTooltipRenderProps } from '../utils/types'
import { tourStyles } from '../Tour.styles';

const currentTheme: ITheme = getTheme();
const bubbleRootTheme = tourStyles(currentTheme).root;
export const TourTip = (
  { tooltipProps, continuous, index, step, backProps, closeProps, primaryProps, skipProps }
  : ITourTooltipRenderProps ) => (
  <div {...tooltipProps} >
    <TeachingBubbleContent
      styles={
        {headline:{textAlign: 'center !important', color:'white'},
          footer:{justifyContent: 'right'},
          root:{color:'blue !important'},
          body:{color:'blue !important'},
          content:{backgroundColor:currentTheme.palette.blue}
        }}
      target={step.target}
      headline={step.title as string}
      calloutProps={{directionalHint: step.directionalHint }}
      hasCloseButton={true}
      onDismiss={skipProps.onClick}
      isWide={true}
      footerContent={
        <div style={{display:'contents', width: '100%'}}>
          <>
            {continuous &&
              <span style={{float: 'left'}} ></span>}

            {continuous &&
              <PrimaryButton {...primaryProps}
                styles={{
                  root: { float:'right !important', borderColor:'white', textColor:'blue !important' }}} >
                <FormattedMessage id="Next" aria-label="Next" />
              </PrimaryButton>}

            {index > 0 &&
              <PrimaryButton {...backProps}
                styles={{root: { float: 'right !important', borderColor:'white' }}} >
                <FormattedMessage id="Back" aria-label="Back"/>
              </PrimaryButton>}

            {!continuous &&
              <PrimaryButton {...closeProps}
                styles={{ root: { color: 'white' } }}>
                <FormattedMessage id="Close Tour" aria-label="Close" />
              </PrimaryButton>}
          </>
        </div>
      }
    >
      <div style={{color: currentTheme.palette.white, textAlign: 'left', lineHeight:'1.5'}}>
        {step.content}
      </div>

    </TeachingBubbleContent>


  </div>
);