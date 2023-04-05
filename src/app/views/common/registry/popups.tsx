import { lazy } from 'react';


export const popups = new Map<string, any>([
  ['share-query', lazy(() => import('../../query-runner/query-input/share-query/ShareQuery'))],
  ['theme-chooser', lazy(() => import('../../main-header/settings/ThemeChooser'))]
]);

export type PopupItem = 'share-query' | 'theme-chooser';
