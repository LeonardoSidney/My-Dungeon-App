module.exports = {
    root: true,
    extends: '@react-native',
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        quotes: ['error', 'single'],
        'space-before-function-paren': ['error', 'always']
    },
    overrides: [
        {
            files: ['*.tsx'],
            rules: {
                indent: ['error', 2, { SwitchCase: 1 }]
            }
        }
    ]
};
