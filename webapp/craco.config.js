const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#D4380D' },
            modifyVars: { '@primary-color': '#0F4C81' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};