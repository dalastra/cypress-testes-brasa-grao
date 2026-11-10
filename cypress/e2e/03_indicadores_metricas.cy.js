describe("Módulo de Indicadores / Métricas - Seção 4 (RF03.1 a RF03.3)", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.clearLocalStorage();
    cy.loginAsAdmin();
  });

  it("CT-09: Validação matemática do Patrimônio Total (RF03.3)", () => {
    // Passos de Execução: Comparar card com a soma manual de (Preço × Estoque)
    // Na base padrão de dados em memória inicial:
    // 1. Hambúrguer: R$ 32,50 × 40 un. = R$ 1.300,00
    // 2. Cheeseburger: R$ 44,00 × 25 un. = R$ 1.100,00
    // 3. Refrigerante: R$ 8,00 × 100 un. = R$ 800,00
    // 4. Pudim: R$ 14,00 × 15 un. = R$ 210,00
    // Total exato esperado: 1300 + 1100 + 800 + 210 = R$ 3.410,00

    // Aguarda o carregamento das métricas da API
    cy.get("#stat-valor-total")
      .should("not.have.text", "R$ 0,00")
      // Resultado Esperado: Card exibir o valor contábil exato (soma de P × Q)
      .and("have.text", "R$ 3.410,00");
  });
});
