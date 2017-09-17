import * as webpack from 'webpack';
import * as path from 'path';

// const CleanWebpackPlugin: any = require('clean-webpack-plugin');
const UglifyJSPlugin: any = require('uglifyjs-webpack-plugin');
const BabiliPlugin: any = require('babili-webpack-plugin');

const TSCONFIG_FILENAME = path.resolve(__dirname, 'tsconfig.json');

const ENV = process.env.ENV === 'DEV' ? 'DEV' : 'PROD';

const config: webpack.Configuration = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.ts',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: TSCONFIG_FILENAME,
              useBabel: true,
              babelOptions: {
                presets: ['es2015']
              },
              useCache: true
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          configFile: 'tslint.json',
          emitErrors: true,
          failOnHint: true,
          typeCheck: false,
          fix: false,
          tsConfigFile: TSCONFIG_FILENAME
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new BabiliPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  devtool: ENV === 'DEV' ? 'source-map' : undefined,
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules')
    ]
  }
};

export default config;
