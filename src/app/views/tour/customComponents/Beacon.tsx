import { Coachmark } from '@fluentui/react';
import React from 'react';
import { BeaconRenderProps } from 'react-joyride';
export const beaconComponent = ({ continuous, index, isLastStep, size, step, setTooltipRef } : BeaconRenderProps) => (
  <div>
    <Coachmark target={null}
    >
    </Coachmark>
  </div>
)