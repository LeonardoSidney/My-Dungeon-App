const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { readBuildFlags } = require('./scripts/buildFlags');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    cacheVersion: JSON.stringify(readBuildFlags()),
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
