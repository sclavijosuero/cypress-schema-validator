const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  // Both configurations work (env or expose) but env will override expose
  // env: {
  //   disableSchemaValidation: false,
  //   enableMismatchesOnUI: 'true,
  //   generateReport: 'json'
  // },
  // expose: {
    // disableSchemaValidation: false,
    // enableMismatchesOnUI: true,
  //   generateReport: 'json'
  // },

  // New config option for cypress-schema-validator v2.0.0
  reportsFolder: 'cypress/reports',

  viewportWidth: 1920,
  viewportHeight: 1080,
  
  retries: {
    openMode: 0,
    runMode: 0,
  },

  watchForFileChanges: false,
  
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'https://sclavijosuero.github.io/',
  },
});
