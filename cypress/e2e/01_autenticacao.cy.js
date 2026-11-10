describe("Módulo de Autenticação - Seção 4 (RF01.1 a RF01.4)", () => {
  beforeEach(() => {
    // Restaura a base de dados em memória e limpa a sessão local antes de cada teste
    cy.resetDatabase();
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("CT-01: Login com credenciais válidas de gestor (RF01.1)", () => {
    // Passos de Execução: Digitar 'admin' e 'admin123', clicar em Entrar
    cy.get("#login-username").clear().type("admin");
    cy.get("#login-password").clear().type("admin123");
    cy.get('#form-login button[type="submit"]').click();

    // Resultado Esperado: Acesso concedido ao painel com perfil de admin
    cy.get("#view-dashboard").should("be.visible");
    cy.get("#view-login").should("not.be.visible");
    cy.get("#user-info-bar").should("be.visible");
    cy.get("#btn-logout").should("be.visible");
  });

  it("CT-02: Login com usuário e senha em branco (RF01.3)", () => {
    // Passos de Execução: Deixar ambos os campos vazios e clicar em Entrar
    cy.get("#login-username").clear();
    cy.get("#login-password").clear();
    cy.get('#form-login button[type="submit"]').click();

    // Resultado Esperado: Bloquear acesso e exibir mensagem de erro amigável
    cy.get("#view-dashboard").should("not.be.visible");
    cy.get("#view-login").should("be.visible");
    cy.get("#login-alert")
      .should("be.visible")
      .and("not.be.empty");
  });

  it("CT-03: Login de usuário válido com senha em branco (RF01.3)", () => {
    // Passos de Execução: Digitar 'admin' e deixar senha vazia, clicar em Entrar
    cy.get("#login-username").clear().type("admin");
    cy.get("#login-password").clear();
    cy.get('#form-login button[type="submit"]').click();

    // Resultado Esperado: Bloquear com alerta de senha obrigatória
    cy.get("#view-dashboard").should("not.be.visible");
    cy.get("#view-login").should("be.visible");
    cy.get("#login-alert")
      .should("be.visible");
  });
});
