import { lazy } from 'react';

export const popups = new Map<string, any>([
  [
    'share-query',
    lazy(
      () =>
        import(
          /* webpackChunkName: "share-query" */ '../../query-runner/query-input/share-query/ShareQuery'
        )
    )
  ],
  [
    'theme-chooser',
    lazy(
      () =>
        import(
          /* webpackChunkName: "theme-chooser" */ '../../main-header/settings/ThemeChooser'
        )
    )
  ],
  [
    'preview-collection',
    lazy(
      () =>
        import(
          /* webpackChunkName: "preview-collection" */ '../../sidebar/resource-explorer/collection/PreviewCollection'
        )
    )
  ],
  [
    'full-permissions',
    lazy(
      () =>
        import(
          /* webpackChunkName: "full-permissions" */ '../../query-runner/request/permissions/Permissions.Full'
        )
    )
  ]
]);

export type PopupItem =
  | 'share-query'
  | 'theme-chooser'
  | 'preview-collection'
  | 'full-permissions';
