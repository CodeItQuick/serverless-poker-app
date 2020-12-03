module.exports = function(wallaby) {
  return {
    // tell wallaby to use automatic configuration
    autoDetect: true,

    files: [
      { pattern: "src/**/*.js*", load: false },
      "!semantic/**/*",
      "!node_modules/**/*",
    ],

    tests: ["tests/**/*.spec.js"],

    testFramework: "jest",

    env: { type: "node" },
  };
};
