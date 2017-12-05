const path = require('path');
const UglifyJS = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  target: 'node',

  entry: {
    login: './static/login.js'
  },

  output: {
    path: path.resolve('/dist',__dirname),
    filename: 'dist/[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /.css$/,
        loader: ['style-loader','css-loader']
      },

      {
        test: [/.jsx$/,/.js$/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['env','react']],
            compact: true
          }
        }
      },

    ]
  },

  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        output: {
          comments: false
        }
    }),

   new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify('production')
        },
    })
  ]


}
