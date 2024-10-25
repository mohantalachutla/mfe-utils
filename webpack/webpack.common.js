const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    bundle: path.resolve(__dirname, '..', './src/index.js'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'], //extensions to resolve
    modules: [path.resolve(__dirname, 'src'), 'node_modules'], // to specify external modules
    // fallback: {},
    // alias: {},
    // enforceExtension: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  target: 'node14',
}
