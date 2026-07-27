module.exports = {
    root: true,
    extends: '@react-native',
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single']
    },
    overrides: [
        {
            files: ['*.tsx'],
            rules: {
                indent: ['error', 2]
            }
        }
    ]
};
