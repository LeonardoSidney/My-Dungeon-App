module.exports = {
    presets: [
        'module:@react-native/babel-preset',
    ],

    plugins: [
        'react-native-web',
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@domain': './src/domain',
                    '@src': './src',
                },
            },
        ],
    ],
};
