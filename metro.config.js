// metro.config.js — required for NativeWind v4 CSS interop
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// ─── Force Metro to always resolve these packages from the project root ───────
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const sharedModules = [
    'react',
    'react-native',
    'react-native-safe-area-context',
    'react-native-screens',
    'scheduler',
    'react-native-reanimated',
    'react-native-css-interop',
    'react-native-worklets',
  ];

  // If a module explicitly requests a package from our shared list (or a submodule of it)
  if (
    sharedModules.includes(moduleName) ||
    sharedModules.some((name) => moduleName.startsWith(`${name}/`))
  ) {
    // We override the originModulePath so Metro's Node resolver starts searching
    // from the project root instead of deep inside nativewind's node_modules.
    const rootContext = {
      ...context,
      originModulePath: path.join(projectRoot, 'index.ts'),
    };
    return context.resolveRequest(rootContext, moduleName, platform);
  }

  // Pass everything else through normally
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
