import { lazy } from 'react';

const ShareQuery = lazy(() => import('../../query-runner/query-input/share-query/ShareQuery'));

export const popups = new Map<string, any>([
  ['share-query', ShareQuery]
]);

export type PopupItem = keyof typeof popups;