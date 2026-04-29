// Import tests for style utility files to cover their module-level statements

describe('Style modules', () => {
  it('searchBoxStyles exports a function', () => {
    const { searchBoxStyles } = require('./utils/searchbox.styles');
    expect(typeof searchBoxStyles).toBe('function');
    expect(searchBoxStyles()).toHaveProperty('root');
  });

  it('shareQueryStyles exports a function', () => {
    const { shareQueryStyles } = require('./views/query-runner/query-input/share-query/ShareQuery.styles');
    expect(typeof shareQueryStyles).toBe('function');
    expect(shareQueryStyles()).toHaveProperty('iconButton');
  });

  it('useSuggestionStyles is defined', () => {
    const { useSuggestionStyles } = require(
      './views/query-runner/query-input/auto-complete/suggestion-list/SuggestionsList.styles'
    );
    expect(useSuggestionStyles).toBeDefined();
  });

  it('useHistoryStyles is defined', () => {
    const { useHistoryStyles } = require('./views/sidebar/history/History.styles');
    expect(useHistoryStyles).toBeDefined();
  });

  it('useHeaderStyles is defined', () => {
    const { useHeaderStyles } = require('./views/query-runner/request/headers/Headers.styles');
    expect(useHeaderStyles).toBeDefined();
  });

  it('pathStyles default export is defined', () => {
    const pathStyles = require('./views/sidebar/resource-explorer/collection/Paths.styles').default;
    expect(pathStyles).toBeDefined();
  });

  it('useStyles from SampleQueries.styles is defined', () => {
    const { useStyles } = require('./views/sidebar/sample-queries/SampleQueries.styles');
    expect(useStyles).toBeDefined();
  });

  it('permissionStyles default export is defined', () => {
    const permissionStyles = require('./views/query-runner/request/permissions/Permission.styles').default;
    expect(permissionStyles).toBeDefined();
  });
});
