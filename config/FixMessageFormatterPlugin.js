class FixMessageFormatterPlugin {
  /** @type {import('webpack').WebpackPluginFunction} */
  apply = compiler => {
    compiler.hooks.compilation.tap('FixMessageFormatterPlugin', compilation => {
      compilation.hooks.statsFactory.tap('FixMessageFormatterPlugin', stats => {
        stats.hooks.result
          .for('error')
          .tap('FixMessageFormatterPlugin', (obj, data, ctx) =>
            formatError(obj, 'ERROR'),
          );

        stats.hooks.result
          .for('warning')
          .tap('FixMessageFormatterPlugin', (obj, data, ctx) =>
            formatError(obj, 'WARNING'),
          );
      });
    });
  };
}

function formatError(obj, prefix = '') {
  const moduleName = obj.moduleName;
  const location = obj.loc;

  if (moduleName) {
    prefix = (prefix + ` in ${moduleName}`).trim();

    if (location) {
      prefix = (prefix + `:${location}`).trim();
    }
  }

  return `${prefix ? prefix + '\n' : ''}${obj.message}`;
}

module.exports = FixMessageFormatterPlugin;