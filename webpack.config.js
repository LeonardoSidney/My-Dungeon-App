const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION_MODE = 'production';
const DEVELOPMENT_MODE = 'development';

module.exports = (env, argv) => {
    const mode = argv.mode ?? DEVELOPMENT_MODE;
    const isDevelopment = mode !== PRODUCTION_MODE;
    const devtool = isDevelopment ? 'eval-source-map' : false;
    const isStorageLogEnabled = process.env.STORAGE === 'true';
    const isStreamingLogEnabled = process.env.STREAMING === 'true';

    return {
        mode,
        entry: './index.web.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            clean: true,
            publicPath: '/',
        },
        devtool,
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
                '@presentation': path.resolve(__dirname, 'src/presentation'),
                '@adapters': path.resolve(__dirname, 'src/adapters'),
                '@composition': path.resolve(__dirname, 'src/composition'),
                '@infra': path.resolve(__dirname, 'src/infrastructure'),
                '@src': path.resolve(__dirname, 'src'),
                '@test/helpers': path.resolve(__dirname, '__helpers__'),
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
                {
                    test: /\.(png|jpe?g|gif|webp|svg|avif)$/,
                    type: 'asset',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
            new webpack.DefinePlugin({
                __DEV__: JSON.stringify(isDevelopment),
                __STORAGE__: JSON.stringify(isStorageLogEnabled),
                __STREAMING__: JSON.stringify(isStreamingLogEnabled),
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
};
