const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './index.web.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
        publicPath: '/',
    },
    devtool: 'eval-source-map',
    cache: {
        type: 'filesystem',
    },
    resolve: {
        extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
        symlinks: false,
        alias: {
            'react-native$': 'react-native-web',

            '@react-native-async-storage/async-storage/lib/commonjs/index.js':
                '@react-native-async-storage/async-storage',

            '@domain': path.resolve(__dirname, 'src/domain'),
            '@application': path.resolve(__dirname, 'src/application'),
            '@adapters': path.resolve(__dirname, 'src/adapters'),
            '@infra': path.resolve(__dirname, 'src/infrastructure'),
            '@src': path.resolve(__dirname, 'src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                    },
                },
            },
            {
                test: /\.m?js$/,
                include: /node_modules/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
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
        allowedHosts: 'all',
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        static: {
            watch: {
                ignored: ['**/node_modules/**', '**/.git/**'],
            },
        },
    },
    watchOptions: {
        ignored: /node_modules/,
    },
};
