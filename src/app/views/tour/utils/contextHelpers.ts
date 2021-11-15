import { ContextualMenuItemType } from '@fluentui/react';
import { ITour } from '../../../../types/tour';
import { getTourSteps } from './blob-steps/getSteps';
import { componentToTargetMap } from './mapToComponent';
import { ITourContextMenu } from './types'


export const getTargetStepIndex = (target: string, tour: ITour): number => {
  const { tourSteps, beginner } = tour;
  const advancedTour = getTourSteps(tourSteps, beginner)

  if (!target) {
    return -1;
  }
  for (let i = 0; i < advancedTour.length; i++) {
    if (advancedTour[i].target.toString() === target) {
      return i;
    }
  }
  return -1;
}

export const findTarget = (itemKeyString: string): string => {
  for (const key of componentToTargetMap) {
    if (key.componentName.toString() === itemKeyString) {
      return key.target;
    }
  }
  return '';
}

export const contextMenuItems: ITourContextMenu[] = [
  {
    key: 'tour',
    itemType: ContextualMenuItemType.Normal,
    text: 'start tour here'
  }
]
