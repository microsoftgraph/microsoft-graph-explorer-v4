import { ContextualMenuItemType } from '@fluentui/react';
import { componentToTargetMap } from './mapToComponent';
import { ADVANCED_TOUR, COMPONENT_INFO } from './steps';

export const getTargetStepIndex = (target: string, menuType: string): number => {
  const tourStep = menuType === 'info' ? COMPONENT_INFO : ADVANCED_TOUR;
  if (target === '') {
    return -1;
  }
  for (let i = 0; i < tourStep.length; i++) {
    if (tourStep[i].target.toString() === target) {
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

export const contextMenuItems = [
  {
    key: 'tour',
    itemType: ContextualMenuItemType.Normal,
    text: 'start tour here'
  }
]
