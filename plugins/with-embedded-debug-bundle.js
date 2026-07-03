const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Ensures debug builds embed the JS bundle so the APK works without Metro.
 * Sets `debuggableVariants = []` in android/app/build.gradle.
 */
function withEmbeddedDebugBundle(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      return config;
    }

    const buildGradle = config.modResults.contents;

    // If already set, keep as-is
    if (/debuggableVariants\s*=\s*\[\s*\]/.test(buildGradle)) {
      return config;
    }

    // Replace the default commented block with an explicit empty list
    config.modResults.contents = buildGradle.replace(
      /\/\* Variants \*\/[\s\S]*?\/\/ debuggableVariants = \["liteDebug", "prodDebug"\]/,
      '/* Variants */\n    //   The list of variants that are debuggable. For those we\'re going to\n    //   skip the bundling of the JS bundle and the assets. Empty means bundle all variants.\n    debuggableVariants = []'
    );

    return config;
  });
}

module.exports = withEmbeddedDebugBundle;
