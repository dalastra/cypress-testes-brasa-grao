const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:8080",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 4000,
    setupNodeEvents(on, config) {
      // Configuração de eventos do Node
    },
  },
});
