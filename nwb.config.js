const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactImageMosaic',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    extra: {
      plugins: [
        new CopyWebpackPlugin([
          { from: 'demo/assets/', to: 'assets/' }
        ])
      ]
    }
  }
}
