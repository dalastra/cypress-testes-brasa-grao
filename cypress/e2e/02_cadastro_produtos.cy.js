describe("Módulo de Produtos - Cadastro e Validações - Seção 4 (RF02.1 e RF02.2)", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.clearLocalStorage();
    cy.loginAsAdmin();
  });

  it("CT-04: Cadastro de produto com preço negativo (RF02.1)", () => {
    // Passos de Execução: Informar preço '-15.00' no formulário e tentar salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("Item Preço Negativo");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("-15.00");
    cy.get("#prod-estoque").clear().type("10");
    cy.get("#prod-descricao").type("Tentativa de preço negativo");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear operação alertando que o preço deve ser positivo
    // A gravação deve ser impedida e o produto inválido não pode figurar no catálogo
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#products-tbody").should("not.contain.text", "-15");
  });

  it("CT-05: Cadastro de produto com preço R$ 0,00 (RF02.1)", () => {
    // Passos de Execução: Informar preço '0.00' e tentar salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("Item Preço Zero");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("0.00");
    cy.get("#prod-estoque").clear().type("10");
    cy.get("#prod-descricao").type("Tentativa de preço zero");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear gravação pois o preço unitário deve ser > 0
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#products-tbody").should("not.contain.text", "Item Preço Zero");
  });

  it("CT-06: Cadastro com quantidade de estoque negativa (RF02.1)", () => {
    // Passos de Execução: Informar estoque '-10' e tentar salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("Item Estoque Negativo");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("25.00");
    cy.get("#prod-estoque").clear().type("-10");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear gravação de estoque negativo
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#products-tbody").should("not.contain.text", "-10 un.");
  });

  it("CT-07: Cadastro de produto com nome em branco/espaços (RF02.1)", () => {
    // Passos de Execução: Preencher nome apenas com '   ' (espaços) e salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("   ");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("19.90");
    cy.get("#prod-estoque").clear().type("15");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear exigindo no mínimo 3 caracteres visíveis
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#modal-product").should("have.class", "active");
  });

  it("CT-08: Cadastro de produto na categoria 'Bebida' (RF02.2)", () => {
    // Passos de Execução: Cadastrar produto com categoria 'Bebida' e conferir tabela
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    const nomeBebida = "Suco de Laranja Natural";
    cy.get("#prod-nome").type(nomeBebida);
    cy.get("#prod-categoria").select("Bebida");
    cy.get("#prod-preco").clear().type("12.50");
    cy.get("#prod-estoque").clear().type("30");
    cy.get("#prod-descricao").type("Suco natural da fruta");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Produto exibido na tabela sob a categoria 'Bebida'
    cy.get("#modal-product").should("not.have.class", "active");
    cy.contains("#products-tbody tr", nomeBebida).within(() => {
      cy.get(".badge").should("contain.text", "Bebida");
      cy.get("td").should("contain.text", "12,50");
      cy.get("td").should("contain.text", "30 un.");
    });
  });
});
