const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: './index.web.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    resolve: {
        extensions: [
            '.web.tsx',
            '.web.ts',
            '.tsx',
            '.ts',
            '.web.js',
            '.js',
        ],

        alias: {
            'react-native$': 'react-native-web',
            '@react-native-async-storage/async-storage/lib/commonjs/index.js': '@react-native-async-storage/async-storage',
        },
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.js$/,
                include: /node_modules/,
                resolve: {
                    fullySpecified: false
                }
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],

    devServer: {
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
};
