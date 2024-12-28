module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-react-native',  // React Native preset
      '@babel/preset-typescript',   // TypeScript preset
      '@babel/preset-env',          // Modern JavaScript
      '@babel/preset-react',        // JSX support
    ],
    plugins: [
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object',
      '@babel/plugin-transform-class-properties',
      'react-native-reanimated/plugin', // Reanimated plugin for React Native
    ],
  };
};
