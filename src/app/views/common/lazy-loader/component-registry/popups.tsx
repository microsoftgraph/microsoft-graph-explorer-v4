import { lazy } from 'react';

export const popups = new Map<string, any>([
  ['share-query', lazy(() => import('../../../query-runner/query-input/share-query/ShareQuery'))],
  ['theme-chooser', lazy(() => import('../../../main-header/settings/ThemeChooserV9'))],
  ['preview-collection', lazy(() => import('../../../sidebar/resource-explorer/collection/APICollection'))],
  ['full-permissions', lazy(() => import('../../../query-runner/request/permissions/Permissions.FullV9'))],
  ['collection-permissions', lazy(() => import('../../../sidebar/resource-explorer/collection/CollectionPermissions'))],
  ['edit-collection-panel', lazy(() => import('../../../sidebar/resource-explorer/collection/EditCollectionPanel'))],
  ['edit-scope-panel', lazy(() => import('../../../sidebar/resource-explorer/collection/EditScopePanel'))]

]);

export type PopupItem =
  'share-query' |
  'theme-chooser' |
  'preview-collection' |
  'full-permissions' |
  'collection-permissions' |
  'edit-collection-panel' |
  'edit-scope-panel'