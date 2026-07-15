// babel.config.js — required for NativeWind v4 + Expo SDK 54
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
  };
};

