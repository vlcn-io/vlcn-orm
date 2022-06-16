import HtmlWebpackPlugin from 'html-webpack-plugin';
import ResolveTypeScriptPlugin from 'resolve-typescript-plugin';

export default {
  devServer: {
    publicPath: '/',
    hot: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  entry: './src/index.tsx',
  mode: 'development',
  resolve: {
    plugins: [new ResolveTypeScriptPlugin()],
    extensions: ['.dev.js', '.js', '.json', '.wasm', 'ts', 'tsx'],
    fallback: {
      crypto: false,
      path: false,
      fs: false,
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  module: {
    rules: [
      {
        test: /\.sql$/i,
        use: 'raw-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
