module.exports = {
    presets: [
        'module:@react-native/babel-preset',
    ],

    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@domain': './src/domain',
                    '@application': './src/application',
                    '@adapters': './src/adapters',
                    '@infra': './src/infrastructure',
                    '@src': './src',
                },
            },
        ],
    ],
};
