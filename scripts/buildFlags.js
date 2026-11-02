const BUILD_FLAG_ENVS = {
    __SEED__: 'SEED',
    __STORAGE__: 'STORAGE',
    __STREAMING__: 'STREAMING',
};

function readBuildFlags () {
    return Object.fromEntries(
        Object.entries(BUILD_FLAG_ENVS).map(([globalName, envName]) => [globalName, process.env[envName] === 'true'])
    );
}

module.exports = { readBuildFlags };
