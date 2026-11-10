describe("Módulo de Produtos - Edição e Exclusão - Seção 4 (RF04.2, RF05.2 e RF05.4)", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.clearLocalStorage();
    cy.loginAsAdmin();
  });

  it("CT-10: Edição de produto alterando somente o preço (RF04.2)", () => {
    // Passos de Execução: Editar item com estoque 40, alterar preço e salvar
    // O item 1 (Hambúrguer Clássico Artesanal) possui estoque inicial de 40 unidades
    cy.contains("#products-tbody tr", "Hambúrguer Clássico Artesanal").within(() => {
      cy.get("td").should("contain.text", "40 un.");
      cy.get(".btn-edit").click();
    });

    // Modal de edição abre carregando os dados do item
    cy.get("#modal-product").should("have.class", "active");
    cy.get("#prod-estoque").should("have.value", "40");

    // Altera somente o preço (para 35.00) mantendo o estoque intacto
    cy.get("#prod-preco").clear().type("35.00");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Preço alterado e estoque de 40 mantido intacto
    cy.get("#modal-product").should("not.have.class", "active");
    cy.contains("#products-tbody tr", "Hambúrguer Clássico Artesanal").within(() => {
      cy.get("td").should("contain.text", "35,00");
      cy.get("td").should("contain.text", "40 un."); // O estoque deve ser preservado intacto (não zerado)
    });
  });

  it("CT-11: Cancelamento da exclusão de produto no modal (RF05.2)", () => {
    // Passos de Execução: Clicar em Excluir e em seguida no botão 'Cancelar'
    cy.contains("#products-tbody tr", "Pudim de Leite Condensado").within(() => {
      cy.get(".btn-delete").click();
    });

    // Modal de confirmação é exibido
    cy.get("#modal-confirm-delete").should("have.class", "active");
    cy.get("#delete-prompt-msg").should("contain.text", "Pudim de Leite Condensado");

    // Clica no botão Cancelar
    cy.get("#btn-cancel-delete").click();

    // Resultado Esperado: Modal fechar sem excluir nenhum produto
    cy.get("#modal-confirm-delete").should("not.have.class", "active");
    cy.get("#dash-alert").should("not.contain.text", "removido");
    cy.contains("#products-tbody tr", "Pudim de Leite Condensado").should("be.visible");
    cy.get("#stat-total-itens").should("have.text", "4");
  });

  it("CT-12: Exclusão de produto com filtro de busca ativo (RF05.4)", () => {
    // Passos de Execução: Filtrar por item específico e clicar em Excluir na linha
    const itemFiltrado = "Refrigerante Cola 350ml";
    cy.get("#input-search").clear().type("Refrigerante");

    // Garante que a listagem foi filtrada exibindo apenas o item buscado
    cy.get("#products-tbody tr").should("have.length", 1);
    cy.contains("#products-tbody tr", itemFiltrado).within(() => {
      cy.get(".btn-delete").click();
    });

    // Modal de confirmação é aberto e a exclusão é confirmada
    cy.get("#modal-confirm-delete").should("have.class", "active");
    cy.get("#btn-confirm-delete").click();
    cy.get("#modal-confirm-delete").should("not.have.class", "active");

    // Limpa o filtro de busca para visualizar todo o catálogo
    cy.get("#input-search").clear();

    // Resultado Esperado: Excluir exclusivamente o item filtrado da linha
    cy.get("#products-tbody").should("not.contain.text", itemFiltrado);
    cy.contains("#products-tbody tr", "Hambúrguer Clássico Artesanal").should("exist");
    cy.contains("#products-tbody tr", "Cheeseburger Duplo Bacon").should("exist");
    cy.contains("#products-tbody tr", "Pudim de Leite Condensado").should("exist");
    cy.get("#stat-total-itens").should("have.text", "3");
  });
});
