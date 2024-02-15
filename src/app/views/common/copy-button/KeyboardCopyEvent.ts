import { eventTypes, telemetry } from '../../../../telemetry';
import { KEYBOARD_COPY_TABS } from '../../../../telemetry/component-names';

interface IComponentList {
  [key: string]: string;
}
export const KeyboardCopyEvent = () => {
  const componentList: IComponentList = KEYBOARD_COPY_TABS;
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      const targets = event.composedPath();
      const componentName = getComponentName(targets);
      trackCopyEvent(componentName);
    }
  });

  const getComponentName = (targets: EventTarget[]): string => {
    const targetIds = targets.map((target: EventTarget) => {
      return getTargetId(target);
    });
    const filteredTargetIds = targetIds.filter((value) => value !== null)!;
    const componentName = Object.keys(componentList).find(key => filteredTargetIds.includes(key));
    return componentName ?? '';
  }

  const getTargetId = (target: EventTarget) => {
    if(target && target instanceof Element) {
      return target.getAttribute('id');
    }
  }

  const trackCopyEvent = (componentName: string) => {
    if(!componentName) { return; }
    telemetry.trackEvent(eventTypes.KEYBOARD_COPY_EVENT,
      {
        ComponentName: (KEYBOARD_COPY_TABS as IComponentList)[componentName],
        trigger: 'Keyboard'
      });
  }
}