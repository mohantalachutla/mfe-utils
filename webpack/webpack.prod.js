const path = require('path')

module.exports = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '..', 'lib'),
    filename: '[name].js',
    assetModuleFilename: '[name][ext]',
  },
  devtool: 'source-map',
}
