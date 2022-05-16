const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    publicPath: '/',
    hot: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  entry: './src/index.js',
  mode: 'development',
  resolve: {
    extensions: ['.dev.js', '.js', '.json', '.wasm'],
    fallback: {
      crypto: false,
      path: false,
      fs: false
    }
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
};
