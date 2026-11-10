/**
 * SUÍTE COMPLETA DE TESTES AUTOMATIZADOS COM CYPRESS
 * Disciplina: Testes de Software
 * Projeto: Sistema Brasa & Grão Gestor v1.0
 * Referência: Seção 4 - Matriz Formal de Execução de Casos de Teste (IEEE 829 / ISO/IEC/IEEE 29119)
 * 
 * Contempla todos os 12 Casos de Teste (CT-01 a CT-12) em conformidade estrita
 * com os Requisitos Funcionais especificados na Seção 4.
 */

describe("Matriz Formal de Execução de Casos de Teste - Seção 4", () => {
  beforeEach(() => {
    // Restaura a massa de dados padrão em memória do sistema antes de cada teste
    cy.resetDatabase();
    cy.clearLocalStorage();
  });

  // =========================================================================
  // MÓDULO DE AUTENTICAÇÃO (RF01.1 e RF01.3)
  // =========================================================================

  it("CT-01 | RF01.1 - Login com credenciais válidas de gestor", () => {
    // Passos: Digitar 'admin' e 'admin123', clicar em Entrar
    cy.visit("/");
    cy.get("#login-username").clear().type("admin");
    cy.get("#login-password").clear().type("admin123");
    cy.get('#form-login button[type="submit"]').click();

    // Resultado Esperado: Acesso concedido ao painel com perfil de admin
    cy.get("#view-dashboard").should("be.visible");
    cy.get("#view-login").should("not.be.visible");
    cy.get("#user-info-bar").should("be.visible");
    cy.get("#btn-logout").should("be.visible");
  });

  it("CT-02 | RF01.3 - Login com usuário e senha em branco", () => {
    // Passos: Deixar ambos os campos vazios e clicar em Entrar
    cy.visit("/");
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

  it("CT-03 | RF01.3 - Login de usuário válido com senha em branco", () => {
    // Passos: Digitar 'admin' e deixar senha vazia, clicar em Entrar
    cy.visit("/");
    cy.get("#login-username").clear().type("admin");
    cy.get("#login-password").clear();
    cy.get('#form-login button[type="submit"]').click();

    // Resultado Esperado: Bloquear com alerta de senha obrigatória
    cy.get("#view-dashboard").should("not.be.visible");
    cy.get("#view-login").should("be.visible");
    cy.get("#login-alert")
      .should("be.visible");
  });

  // =========================================================================
  // MÓDULO DE PRODUTOS - CADASTRO E VALIDAÇÃO DE REGRAS (RF02.1 e RF02.2)
  // =========================================================================

  it("CT-04 | RF02.1 - Cadastro de produto com preço negativo", () => {
    cy.loginAsAdmin();

    // Passos: Informar preço '-15.00' no formulário e tentar salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("Item Teste Preço Negativo");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("-15.00");
    cy.get("#prod-estoque").clear().type("10");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear operação alertando que o preço deve ser positivo
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#products-tbody").should("not.contain.text", "-15");
  });

  it("CT-05 | RF02.1 - Cadastro de produto com preço R$ 0,00", () => {
    cy.loginAsAdmin();

    // Passos: Informar preço '0.00' e tentar salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("Item Teste Gratuito");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("0.00");
    cy.get("#prod-estoque").clear().type("10");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear gravação pois o preço unitário deve ser > 0
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#products-tbody").should("not.contain.text", "Item Teste Gratuito");
  });

  it("CT-06 | RF02.1 - Cadastro com quantidade de estoque negativa", () => {
    cy.loginAsAdmin();

    // Passos: Informar estoque '-10' e tentar salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("Item Teste Estoque Negativo");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("25.00");
    cy.get("#prod-estoque").clear().type("-10");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear gravação de estoque negativo
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#products-tbody").should("not.contain.text", "-10 un.");
  });

  it("CT-07 | RF02.1 - Cadastro de produto com nome em branco/espaços", () => {
    cy.loginAsAdmin();

    // Passos: Preencher nome apenas com '   ' (espaços) e salvar
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    cy.get("#prod-nome").type("   ");
    cy.get("#prod-categoria").select("Lanche");
    cy.get("#prod-preco").clear().type("20.00");
    cy.get("#prod-estoque").clear().type("5");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Bloquear exigindo no mínimo 3 caracteres visíveis
    cy.get("#dash-alert").should("have.class", "alert-danger");
    cy.get("#modal-product").should("have.class", "active");
  });

  it("CT-08 | RF02.2 - Cadastro de produto na categoria 'Bebida'", () => {
    cy.loginAsAdmin();

    // Passos: Cadastrar produto com categoria 'Bebida' e conferir tabela
    cy.get("#btn-open-create").click();
    cy.get("#modal-product").should("have.class", "active");

    const nomeProduto = "Suco de Laranja Natural";
    cy.get("#prod-nome").type(nomeProduto);
    cy.get("#prod-categoria").select("Bebida");
    cy.get("#prod-preco").clear().type("12.50");
    cy.get("#prod-estoque").clear().type("30");
    cy.get("#prod-descricao").type("Suco 100% fruta fresca");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Produto exibido na tabela sob a categoria 'Bebida'
    cy.get("#modal-product").should("not.have.class", "active");
    cy.contains("#products-tbody tr", nomeProduto).within(() => {
      cy.get(".badge").should("contain.text", "Bebida");
      cy.get("td").should("contain.text", "12,50");
      cy.get("td").should("contain.text", "30 un.");
    });
  });

  // =========================================================================
  // MÓDULO DE INDICADORES / MÉTRICAS (RF03.3)
  // =========================================================================

  it("CT-09 | RF03.3 - Validação matemática do Patrimônio Total", () => {
    cy.loginAsAdmin();

    // Passos: Comparar card com a soma manual de (Preço × Estoque)
    // Base padrão:
    // 1. Hambúrguer: R$ 32,50 × 40 = R$ 1.300,00
    // 2. Cheeseburger: R$ 44,00 × 25 = R$ 1.100,00
    // 3. Refrigerante: R$ 8,00 × 100 = R$ 800,00
    // 4. Pudim: R$ 14,00 × 15 = R$ 210,00
    // Total esperado: 1300 + 1100 + 800 + 210 = R$ 3.410,00

    // Resultado Esperado: Card exibir o valor contábil exato (soma de P × Q)
    cy.get("#stat-valor-total")
      .should("not.have.text", "R$ 0,00")
      .and("have.text", "R$ 3.410,00");
  });

  // =========================================================================
  // MÓDULO DE PRODUTOS - EDIÇÃO E EXCLUSÃO (RF04.2, RF05.2 e RF05.4)
  // =========================================================================

  it("CT-10 | RF04.2 - Edição de produto alterando somente o preço", () => {
    cy.loginAsAdmin();

    // Passos: Editar item com estoque 40, alterar preço e salvar
    // O item 'Hambúrguer Clássico Artesanal' possui estoque inicial de 40 unidades
    cy.contains("#products-tbody tr", "Hambúrguer Clássico Artesanal").within(() => {
      cy.get("td").should("contain.text", "40 un.");
      cy.get(".btn-edit").click();
    });

    cy.get("#modal-product").should("have.class", "active");
    cy.get("#prod-estoque").should("have.value", "40");

    // Altera somente o preço mantendo intacto o estoque de 40
    cy.get("#prod-preco").clear().type("35.00");
    cy.get("#btn-save-prod").click();

    // Resultado Esperado: Preço alterado e estoque de 40 mantido intacto
    cy.get("#modal-product").should("not.have.class", "active");
    cy.contains("#products-tbody tr", "Hambúrguer Clássico Artesanal").within(() => {
      cy.get("td").should("contain.text", "35,00");
      cy.get("td").should("contain.text", "40 un.");
    });
  });

  it("CT-11 | RF05.2 - Cancelamento da exclusão de produto no modal", () => {
    cy.loginAsAdmin();

    // Passos: Clicar em Excluir e em seguida no botão 'Cancelar'
    cy.contains("#products-tbody tr", "Pudim de Leite Condensado").within(() => {
      cy.get(".btn-delete").click();
    });

    cy.get("#modal-confirm-delete").should("have.class", "active");
    cy.get("#delete-prompt-msg").should("contain.text", "Pudim de Leite Condensado");

    // Clica no botão 'Cancelar' do modal de confirmação
    cy.get("#btn-cancel-delete").click();

    // Resultado Esperado: Modal fechar sem excluir nenhum produto
    cy.get("#modal-confirm-delete").should("not.have.class", "active");
    // Alerta de sucesso de exclusão não deve ocorrer
    cy.get("#dash-alert").should("not.contain.text", "removido");
    // O produto deve permanecer intacto na tabela de produtos
    cy.contains("#products-tbody tr", "Pudim de Leite Condensado").should("be.visible");
    cy.get("#stat-total-itens").should("have.text", "4");
  });

  it("CT-12 | RF05.4 - Exclusão de produto com filtro de busca ativo", () => {
    cy.loginAsAdmin();

    // Passos: Filtrar por item específico e clicar em Excluir na linha
    const itemFiltrado = "Refrigerante Cola 350ml";
    cy.get("#input-search").clear().type("Refrigerante");

    // Valida que apenas o item filtrado está visível
    cy.get("#products-tbody tr").should("have.length", 1);
    cy.contains("#products-tbody tr", itemFiltrado).within(() => {
      cy.get(".btn-delete").click();
    });

    // Confirma a exclusão no modal
    cy.get("#modal-confirm-delete").should("have.class", "active");
    cy.get("#btn-confirm-delete").click();
    cy.get("#modal-confirm-delete").should("not.have.class", "active");

    // Remove o filtro de busca para visualizar o catálogo completo
    cy.get("#input-search").clear();

    // Resultado Esperado: Excluir exclusivamente o item filtrado da linha
    cy.get("#products-tbody").should("not.contain.text", itemFiltrado);
    cy.contains("#products-tbody tr", "Hambúrguer Clássico Artesanal").should("exist");
    cy.contains("#products-tbody tr", "Cheeseburger Duplo Bacon").should("exist");
    cy.contains("#products-tbody tr", "Pudim de Leite Condensado").should("exist");
    cy.get("#stat-total-itens").should("have.text", "3");
  });
});
