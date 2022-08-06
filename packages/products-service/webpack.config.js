const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    resolve: {
        extensions: ['.js', '.ts']
    },
    target: 'node',
    plugins: [
        new webpack.IgnorePlugin({resourceRegExp: /^pg-native$/}),
    ],
    module: {
        rules: [
            {
                test: /\.(ts?)$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, '.serverless'),
                        path.resolve(__dirname, '.webpack'),
                    ],
                ],
            },
        ],
    },
};
