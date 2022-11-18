const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@primary-color": "#3a92cc",
      "@layout-header-background": "#1d4661",
    },
  })(config, env);
  return config;
};
