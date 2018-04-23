const path = require('path');

module.exports = {
  entry: './src/main.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        use: "source-map-loader"
      },
      {
        enforce: 'pre',
        test: /\.ts?$/,
        use: "source-map-loader"
      },
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader', 
          // options: {inline: true},
        }
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};