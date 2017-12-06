const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    target: 'node',

    entry: {
        login: './static/login.js'
    },

    plugins: [
      new CleanWebpackPlugin(['dist'])
    ],

    output: {
        path: path.resolve('/dist', __dirname),
        filename: 'dist/[name].bundle.js'
    },

    module: {
        rules: [
            {
                test: /.css$/,
                loader: ['style-loader', 'css-loader']
            },

            {
                test: [/.jsx$/, /.js$/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['env', 'react']],
                        compact: true
                    }
                }
            },

        ]
    },
    devtool: 'source-map',
}