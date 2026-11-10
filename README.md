# Suíte de Testes Automatizados com Cypress
## Sistema Brasa & Grão Gestor v1.0 — Disciplina: Testes de Software

Este projeto contém a suíte completa de testes automatizados desenvolvida com o framework **Cypress**, baseada estritamente nos requisitos e comportamentos descritos na **Seção 4 (Matriz Formal de Execução de Casos de Teste - IEEE 829 / ISO/IEC/IEEE 29119)** do documento de homologação do sistema *Brasa & Grão*.

---

## 📁 Estrutura do Projeto de Automação

O projeto foi estruturado seguindo as melhores práticas recomendadas pela documentação oficial do Cypress:

```text
cypress-testes-brasa-grao/
│
├── cypress/
│   ├── e2e/
│   │   ├── 01_autenticacao.cy.js          # Testes CT-01, CT-02 e CT-03 (RF01.1 e RF01.3)
│   │   ├── 02_cadastro_produtos.cy.js     # Testes CT-04 a CT-08 (RF02.1 e RF02.2)
│   │   ├── 03_indicadores_metricas.cy.js  # Teste CT-09 (RF03.3)
│   │   ├── 04_gestao_produtos.cy.js       # Testes CT-10, CT-11 e CT-12 (RF04.2, RF05.2 e RF05.4)
│   │   └── matriz_completa_secao4.cy.js   # Suíte completa consolidada (CT-01 a CT-12)
│   │
│   ├── fixtures/
│   │   └── produtos.json                  # Massa de dados estruturada para testes
│   │
│   └── support/
│       ├── commands.js                    # Comandos customizados (resetDatabase, loginViaUI, loginAsAdmin)
│       └── e2e.js                         # Configurações globais de suporte da suíte
│
├── cypress.config.js                      # Configuração do Cypress (baseUrl, viewport, timeouts)
├── package.json                           # Definição de scripts e dependências do projeto
└── README.md                              # Documentação e instruções de execução
```

---

## 🎯 Mapeamento dos Casos de Teste (Seção 4)

Todos os 12 casos de teste especificados na Seção 4 foram devidamente codificados e organizados por módulos:

| ID | Req. | Cenário de Teste | Arquivo de Teste Cypress | Status Esperado no Software v1.0 |
|---|---|---|---|:---:|
| **CT-01** | RF01.1 | Login com credenciais válidas de gestor | `01_autenticacao.cy.js` | **PASS** |
| **CT-02** | RF01.3 | Login com usuário e senha em branco | `01_autenticacao.cy.js` | **FAIL** *(Vulnerabilidade: concede acesso)* |
| **CT-03** | RF01.3 | Login de usuário válido com senha em branco | `01_autenticacao.cy.js` | **FAIL** *(Vulnerabilidade: concede acesso sem senha)* |
| **CT-04** | RF02.1 | Cadastro de produto com preço negativo | `02_cadastro_produtos.cy.js` | **FAIL** *(Aceita preço negativo no catálogo)* |
| **CT-05** | RF02.1 | Cadastro de produto com preço R$ 0,00 | `02_cadastro_produtos.cy.js` | **FAIL** *(Aceita preço zero)* |
| **CT-06** | RF02.1 | Cadastro com quantidade de estoque negativa | `02_cadastro_produtos.cy.js` | **FAIL** *(Aceita estoque negativo)* |
| **CT-07** | RF02.1 | Cadastro de produto com nome em branco/espaços | `02_cadastro_produtos.cy.js` | **FAIL** *(Aceita nome composto apenas de espaços)* |
| **CT-08** | RF02.2 | Cadastro de produto na categoria 'Bebida' | `02_cadastro_produtos.cy.js` | **FAIL** *(Salva como 'Sobremesa' em vez de 'Bebida')* |
| **CT-09** | RF03.3 | Validação matemática do Patrimônio Total | `03_indicadores_metricas.cy.js` | **FAIL** *(Calcula R$ 278,50 em vez de R$ 3.410,00)* |
| **CT-10** | RF04.2 | Edição de produto alterando somente o preço | `04_gestao_produtos.cy.js` | **FAIL** *(Zera o estoque do produto para 0 un.)* |
| **CT-11** | RF05.2 | Cancelamento da exclusão de produto no modal | `04_gestao_produtos.cy.js` | **FAIL** *(Botão Cancelar acidentalmente exclui o item)* |
| **CT-12** | RF05.4 | Exclusão de produto com filtro de busca ativo | `04_gestao_produtos.cy.js` | **PASS** *(Exclui exclusivamente o item filtrado)* |

> **Nota de QA:** Os testes automatizados foram construídos para validar os **Resultados Esperados de acordo com os Requisitos**. Desta forma, as assertions que falham no Cypress evidenciam exatamente os **8 defeitos funcionais e de integridade** presentes na aplicação em teste, cumprindo o objetivo primário da disciplina de Testes e Garantia da Qualidade de Software.

---

## ⚙️ Pré-requisitos

1. **Node.js** (versão 18+ ou superior recomendada).
2. **Binário da Aplicação (`sistema-testes.exe`)** em execução:
   - Porta padrão: `http://localhost:8080` (ou `http://127.0.0.1:8080`).

---

## 🚀 Como Executar os Testes

### 1. Iniciar o Sistema em Teste
Abra um terminal e execute o binário do software:
```powershell
c:\Users\Aluno\Downloads\sistema-testes.exe
```
O servidor HTTP estará disponível em `http://127.0.0.1:8080`.

### 2. Instalar Dependências do Projeto Cypress
Navegue até a pasta do projeto e execute:
```powershell
cd C:\Users\Aluno\.gemini\antigravity\scratch\cypress-testes-brasa-grao
npm install
```

### 3. Execução dos Testes Automatizados

#### Modo Headless (Linha de Comando - Relatório no Terminal):
Para executar toda a suíte de testes:
```powershell
npm test
```
Ou diretamente via Cypress:
```powershell
npx cypress run
```

Para executar uma especificação modular específica:
```powershell
# Executar apenas Autenticação (CT-01 a CT-03)
npx cypress run --spec "cypress/e2e/01_autenticacao.cy.js"

# Executar apenas Cadastro de Produtos (CT-04 a CT-08)
npx cypress run --spec "cypress/e2e/02_cadastro_produtos.cy.js"

# Executar apenas Métricas e Indicadores (CT-09)
npx cypress run --spec "cypress/e2e/03_indicadores_metricas.cy.js"

# Executar apenas Edição e Exclusão (CT-10 a CT-12)
npx cypress run --spec "cypress/e2e/04_gestao_produtos.cy.js"

# Executar a Matriz Completa Consolidada da Seção 4 (CT-01 a CT-12)
npx cypress run --spec "cypress/e2e/matriz_completa_secao4.cy.js"
```

#### Modo Interativo (Interface Gráfica do Cypress Test Runner):
```powershell
npm run cypress:open
```
OU:
```powershell
npx cypress open
```
Na interface gráfica que se abrirá:
1. Selecione **E2E Testing**.
2. Escolha o navegador desejado (ex: Chrome, Edge, Electron).
3. Clique em qualquer um dos arquivos `.cy.js` para acompanhar a execução visual interativa em tempo real com time-travel e visualização DOM.

---

## 🛠️ Comandos Customizados Cypress Criados (`cypress/support/commands.js`)

- `cy.resetDatabase()`: Envia uma requisição HTTP `POST /api/reset` antes de cada cenário de teste para restaurar o banco de dados em memória aos 4 itens iniciais, garantindo independência e repetibilidade absoluta dos testes.
- `cy.loginViaUI(username, password)`: Preenche os campos do formulário de login e submete o formulário via interface de usuário.
- `cy.loginAsAdmin()`: Realiza o login completo com as credenciais padrão de gestor (`admin` / `admin123`) e garante que o painel principal foi carregado.
