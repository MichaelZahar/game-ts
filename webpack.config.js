module.exports = {
  devtool: 'source-map',
  entry: './src/client/scripts/main.ts',
  output: {
    filename: './src/client/bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'babel-loader!ts-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
}
