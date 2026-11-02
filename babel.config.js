const { readBuildFlags } = require('./scripts/buildFlags');

const METRO_CALLER = 'metro';

function createDefineBuildFlagsPlugin (buildFlags) {
    return ({ types }) => ({
        visitor: {
            Identifier (path) {
                const name = path.node.name;
                if (!(name in buildFlags) || !path.isReferencedIdentifier() || path.scope.hasBinding(name)) {
                    return;
                }

                path.replaceWith(types.booleanLiteral(buildFlags[name]));
            },
        },
    });
}

module.exports = api => {
    const buildFlags = JSON.parse(api.cache.using(() => JSON.stringify(readBuildFlags())));
    const isMetro = api.caller(caller => caller?.name === METRO_CALLER);
    const metroPlugins = isMetro ? [createDefineBuildFlagsPlugin(buildFlags)] : [];

    return {
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
                        '@presentation': './src/presentation',
                        '@adapters': './src/adapters',
                        '@composition': './src/composition',
                        '@infra': './src/infrastructure',
                        '@src': './src',
                        '@test/helpers': './__helpers__',
                    },
                },
            ],
            ...metroPlugins,
        ],
    };
};
