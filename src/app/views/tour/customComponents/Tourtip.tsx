import { DefaultButton, getTheme, IButtonProps, ITheme, PrimaryButton, TeachingBubble } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ITourTooltipRenderProps } from '../utils/types'
import { tourStyles } from '../Tour.styles';
import { ADVANCED_TOUR_LENGTH, BEGINNER_TOUR_LENGTH } from '../utils/steps';
import messages from '../../../../messages';


const currentTheme: ITheme = getTheme();
const bubbleRootTheme = tourStyles(currentTheme).root;
export const TourTip = ( { tooltipProps, index, step, backProps, primaryProps, skipProps }
: ITourTooltipRenderProps ) => {
  const tourLength = step.advancedStep ? ADVANCED_TOUR_LENGTH-1 : BEGINNER_TOUR_LENGTH-1;

  const tipPrimaryButton : IButtonProps = React.useMemo(
    () => ({
      children: <FormattedMessage id={index === tourLength ? 'Close Tour' : 'Next'} />,
      onClick: primaryProps.onClick
    }),[]
  )

  const tipSecondaryButton : IButtonProps = React.useMemo(
    () => ({
      children: <FormattedMessage id={index > 0 ? 'Previous' : '' } /> ,
      onClick: backProps.onClick
    }),[]
  )

  const closeTour : IButtonProps = React.useMemo(
    () => ({
      children: <FormattedMessage id='Close Tour' />,
      onClick: skipProps.onClick
    }),[]
  )

  return(
    <div {...tooltipProps} >
      <TeachingBubble
        target={step.target}
        headline={step.title as string}
        calloutProps={{
          directionalHint: step.directionalHint,
          preventDismissOnScroll: true,
          preventDismissOnLostFocus: true,
          preventDismissOnResize: true
        }}
        hasCloseButton={true}
        onDismiss={skipProps.onClick}
        isWide={true}
        primaryButtonProps={tipPrimaryButton}
        secondaryButtonProps={ index> 0 ? tipSecondaryButton : closeTour}
        footerContent={ <span >{index} of {tourLength} </span> }
      >
        <div style={{textAlign: 'left', lineHeight:'1.5'}}>
          {step.content}
        </div>

      </TeachingBubble>
    </div>
  )

};
// styles={
//   {headline:{textAlign: 'center !important', color:'white'},
//     footer:{ display: 'flex',justifyContent: 'space-between'},
//     content:{backgroundColor:currentTheme.palette.blue}
//   }}

// footerContent={
//   <div style={{}}>

//     <span style={{float: 'left'}}>{index} of {tourLength} </span>

//     <span style={{position: 'absolute', right:'0'}}>
//       {index > 0 &&
//       <PrimaryButton {...backProps}
//         styles={{root: {  borderColor:'white' }}} >
//         <FormattedMessage id="Back" aria-label="Back"/>
//       </PrimaryButton>}

//       {continuous &&
//       <PrimaryButton {...primaryProps}
//         styles={{root: { borderColor:'white', color:'blue !important' }}} >
//         <FormattedMessage id={ index === tourLength ? 'Close Tour' : 'Next' } aria-label="Next" />
//       </PrimaryButton>}

//       {!continuous &&
//         <PrimaryButton {...closeProps} styles={{ root: { color: 'white' } }}>
//           <FormattedMessage id="Close Tour" aria-label="Close" />
//         </PrimaryButton>}
//     </span>
//   </div>
// }
// {color: currentTheme.palette.white,