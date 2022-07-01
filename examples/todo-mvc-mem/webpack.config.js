import HtmlWebpackPlugin from 'html-webpack-plugin';
import ResolveTypeScriptPlugin from 'resolve-typescript-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  devServer: {
    static: {
      directory: path.resolve(__dirname),
      publicPath: '/',
    },
    allowedHosts: 'all',
    hot: true,
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
