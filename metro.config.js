// metro.config.js — required for NativeWind v4 CSS interop
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Block Metro from resolving react-native inside nativewind's node_modules
config.resolver.blockList = [
  ...Array.from(config.resolver.blockList || []),
  /node_modules[/\\]nativewind[/\\]node_modules[/\\]react-native[/\\].*/
];

module.exports = withNativeWind(config, { input: './global.css' });
