// cypress/support/commands.js

/**
 * Comando customizado para restaurar o banco de dados da aplicação
 * para o estado inicial padrão de testes via API.
 */
Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "/api/reset").then((response) => {
    expect(response.status).to.eq(200);
  });
});

/**
 * Comando customizado para realizar login na aplicação através da interface gráfica
 */
Cypress.Commands.add("loginViaUI", (username, password) => {
  cy.visit("/");
  if (username !== undefined && username !== "") {
    cy.get("#login-username").clear().type(username);
  } else {
    cy.get("#login-username").clear();
  }

  if (password !== undefined && password !== "") {
    cy.get("#login-password").clear().type(password);
  } else {
    cy.get("#login-password").clear();
  }

  cy.get('#form-login button[type="submit"]').click();
});

/**
 * Comando customizado para realizar login com credenciais de gestor padrão
 */
Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("/");
  cy.get("#login-username").clear().type("admin");
  cy.get("#login-password").clear().type("admin123");
  cy.get('#form-login button[type="submit"]').click();
  cy.get("#view-dashboard").should("be.visible");
  cy.get("#btn-logout").should("be.visible");
});
