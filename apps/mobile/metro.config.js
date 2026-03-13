const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const workspaceNodeModules = path.resolve(workspaceRoot, 'node_modules');
const pnpmStoreRoot = path.resolve(workspaceNodeModules, '.pnpm');
const mobilePackageJson = require('./package.json');

const workspacePackageDirs = Object.keys(mobilePackageJson.dependencies ?? {})
  .filter((name) => name.startsWith('@issue-tracker/'))
  .map((name) => path.resolve(workspaceRoot, 'packages', name.split('/')[1]))
  .filter((directory) => fs.existsSync(directory));

const config = {
  // Only watch shared workspace packages plus pnpm's real package store.
  watchFolders: [pnpmStoreRoot, ...workspacePackageDirs],
  resolver: {
    enableGlobalPackages: true,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      workspaceNodeModules,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
