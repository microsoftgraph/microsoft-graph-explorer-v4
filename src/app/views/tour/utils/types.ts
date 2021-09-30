import { DirectionalHint, IImageProps } from '@fluentui/react';
import { Step, TooltipRenderProps } from 'react-joyride';

export interface ITourSteps extends Step {
  illustrationImage?: IImageProps;
  directionalHint?: DirectionalHint;
  autoNext?: boolean;
  advancedStep?: boolean;

}

export interface ITourTooltipRenderProps extends TooltipRenderProps {
  directionalHint: DirectionalHint;
  step: ITourSteps;

}