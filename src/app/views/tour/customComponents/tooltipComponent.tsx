import { Coachmark, DefaultButton, IButtonProps, PrimaryButton, TeachingBubble } from '@fluentui/react';
import { title } from 'process';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ITourTooltipRenderProps } from '../tourUtils/types'

const primaryButton = (props: any) : JSX.Element => {
    return(
        <PrimaryButton>
            Stuff
        </PrimaryButton>
    )
}
const secondaryButton : IButtonProps = {
    children: 'Previous'
}

export const tooltip = ( { tooltipProps, continuous, index, step, backProps, closeProps, primaryProps, skipProps } : ITourTooltipRenderProps ) => {
    const { onClick } = primaryProps;
    return(
        <div {...tooltipProps} >
            <TeachingBubble
                styles={{headline:{textAlign: 'center !important', color:'white'}, footer:{justifyContent: 'right'}}}
                target={step.target}
                headline={step.title as string}
                calloutProps={{directionalHint: step.directionalHint }}
                hasCloseButton={true}
                footerContent={
                    <div style={{display:'contents', width: '100%', background:'yellow'}}>
                        <div style={{}}>
                            {continuous &&
                            <DefaultButton {...skipProps} styles={{root: { float:'left !important', borderColor:'black', justifyContent:'left' }}}>
                                {index}
                            </DefaultButton>}

                            {continuous &&
                            <PrimaryButton {...primaryProps} styles={{root: { float:'right !important', borderColor:'white', textColor:'blue !important' }}} >
                                <FormattedMessage id="Next" aria-label="Next" />
                            </PrimaryButton>}

                            {index > 0 &&
                            <DefaultButton {...backProps} styles={{root: { float: 'right !important', borderColor:'white' }}} >
                                <FormattedMessage id="Back" aria-label="Back"/>
                            </DefaultButton>}

                            {!continuous &&
                            <PrimaryButton {...closeProps} styles={{ root: { color: 'white' } }}>
                                <FormattedMessage id="Close Tour" aria-label="Close" />
                            </PrimaryButton>}
                        </div>
                    </div>
                }
            >
                {step.content}

            </TeachingBubble>

        </div>
    )
};