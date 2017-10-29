import * as webpack from 'webpack';
import * as path from 'path';
const nodeExternals: any = require('webpack-node-externals');
const MinifyPlugin: any = require('babel-minify-webpack-plugin');
import {CheckerPlugin} from 'awesome-typescript-loader';

const TSCONFIG_FILENAME = path.resolve(__dirname, 'tsconfig.json');

const ENV = process.env.ENV === 'DEV' ? 'DEV' : 'PROD';

const config: webpack.Configuration = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.ts',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: [nodeExternals()],
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
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new MinifyPlugin({
      mangle: {
        topLevel: true
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        screw_ie8: true,
        sequences: true,
        properties: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        negate_iife: true,
        hoist_funs: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      comments: false
    }),
    new webpack.optimize.AggressiveMergingPlugin({})
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
