const METRO_CALLER = 'metro';
const BUILD_FLAG_ENVS = {
    __STORAGE__: 'STORAGE',
    __STREAMING__: 'STREAMING',
};

function readBuildFlags () {
    return Object.fromEntries(
        Object.entries(BUILD_FLAG_ENVS).map(([globalName, envName]) => [globalName, process.env[envName] === 'true'])
    );
}

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
