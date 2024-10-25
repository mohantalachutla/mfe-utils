module.exports = {
  mode: 'development',
  devServer: {
    static: false,
    hot: true,
    // open: true,
    port: 9000,
  },
  devtool: 'eval-cheap-source-map',
  stats: 'errors-warnings',
}
