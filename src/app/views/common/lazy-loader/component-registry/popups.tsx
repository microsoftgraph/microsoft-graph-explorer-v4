import { lazy } from 'react';

export const popups = new Map<string, any>([
  ['share-query', lazy(() => import('../../../query-runner/query-input/share-query/ShareQuery'))],
  ['theme-chooser', lazy(() => import('../../../main-header/settings/ThemeChooser'))],
  ['preview-collection', lazy(() => import('../../../sidebar/resource-explorer/collection/PreviewCollection'))],
  ['full-permissions', lazy(() => import('../../../query-runner/request/permissions/Permissions.Full'))],
  ['collection-permissions', lazy(() => import('../../../sidebar/resource-explorer/collection/CollectionPermissions'))],
  ['manifest-description', lazy(() => import('../../../sidebar/resource-explorer/collection/ManifestDescription'))]
]);

export type PopupItem =
  'share-query' |
  'theme-chooser' |
  'preview-collection' |
  'full-permissions' |
  'collection-permissions' |
  'manifest-description';