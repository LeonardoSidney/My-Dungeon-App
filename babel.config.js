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
                    '@composition': './src/composition',
                    '@infra': './src/infrastructure',
                    '@src': './src',
                    '@test/helpers': './__helpers__',
                },
            },
        ],
    ],
};
