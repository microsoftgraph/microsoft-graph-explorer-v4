import { DirectionalHint, IImageProps } from '@fluentui/react';
import { Step, TooltipRenderProps } from 'react-joyride';

export interface ITourSteps extends Step {
  illustrationImage?: IImageProps;
  directionalHint?: DirectionalHint;
  autoNext?: boolean;
  advancedStep?: boolean;
  infoStep?: boolean
  expectedActionType?: string;
}

export interface ITourTooltipRenderProps extends TooltipRenderProps {
  directionalHint: DirectionalHint;
  step: ITourSteps;

}