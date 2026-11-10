// cypress/support/e2e.js
import "./commands";

// Ignora exceções não capturadas da aplicação se houver alguma
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
