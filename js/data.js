/*
 * ============================================================
 *  DADOS DO PORTFÓLIO — edite só este arquivo.
 * ============================================================
 *  - Textos em dois idiomas: L("português", "english"). O site em
 *    português usa o primeiro, o de /en/ usa o segundo. Texto sem L()
 *    (nomes, tecnologias, links) vale para os dois.
 *  - Campos de link vazios ("") escondem o botão correspondente.
 *  - Itens com `exemplo: true` aparecem com o selo "exemplo".
 */
function revelar(codigo) {
  try { return atob(codigo).split("").reverse().join(""); } catch (e) { return ""; }
}
function L(pt, en) { return { pt: pt, en: en }; }

window.PORTFOLIO = {
  perfil: {
    nome: "Alex Matias",
    usuario: "alex-matias",
    cargo: L("Desenvolvedor de Software .NET", ".NET Software Developer"),
    local: L("Divinópolis, MG · Brasil", "Divinópolis, MG · Brazil"),
    // Frases que se alternam no topo da página ("desenvolvo ..." / "I build ...")
    funcoes: L(
      ["sistemas de gestão", "aplicações desktop em C#", "APIs em .NET", "integrações entre sistemas", "software para o comércio"],
      ["business management systems", "desktop apps in C#", ".NET APIs", "system integrations", "software for retail"]
    ),
    frase: L(
      "Eu transformo o balcão de uma loja em software: pedido, estoque, orçamento em PDF e mensagem no WhatsApp.",
      "I turn a shop counter into software: orders, inventory, PDF quotes and WhatsApp messages."
    ),
    sobre: L([
      "Sou desenvolvedor de software .NET com 4 anos de experiência no desenvolvimento, modernização e integração de sistemas corporativos, com foco em regras de negócio, dados e performance.",
      "Hoje trabalho na CartSys, no ERP desktop usado por cartórios de Protesto, RTD/PJ, Registro de Imóveis e Notas. Antes, passei quase três anos na indústria, sustentando sistemas legados críticos e automatizando processos de fábrica em C#.",
      "Por conta própria, desenvolvo sistemas de gestão para pequenos comércios: oficinas, lojas de suprimentos de impressão e lojas de roupas. Cada sistema nasce de um anterior, que vira base para o próximo, com a infraestrutura comum reaproveitada e o que é específico de cada ramo separado.",
      "Trabalho principalmente com C# e .NET (Windows Forms, WPF, .NET Framework 4.8 e .NET 8), Entity Framework / EF Core, SQL Server, MySQL, PostgreSQL e SQLite, além de APIs em camadas (Domain, Application, Infrastructure).",
    ], [
      "I'm a .NET software developer with 4 years of experience building, modernizing and integrating business systems, focused on business rules, data and performance.",
      "Today I work at CartSys on the desktop ERP used by Brazilian notary and registry offices (protests, deeds, real estate and corporate registries). Before that, I spent almost three years in manufacturing, maintaining critical legacy systems and automating factory processes in C#.",
      "On my own, I build management systems for small businesses: auto repair shops, printer supply stores and clothing stores. Each system grows out of the previous one, reusing the shared infrastructure and keeping what is specific to each business separate.",
      "I work mainly with C# and .NET (Windows Forms, WPF, .NET Framework 4.8 and .NET 8), Entity Framework / EF Core, SQL Server, MySQL, PostgreSQL and SQLite, as well as layered APIs (Domain, Application, Infrastructure).",
    ]),
    // Aparece no topo, abaixo do cargo. Vazio ("") esconde.
    disponibilidade: L(
      "Disponível para projetos freelance e aberto a novas oportunidades",
      "Available for freelance projects and open to new opportunities"
    ),
    // Resultados com número, em destaque no "Quem sou eu" (os mesmos da experiência)
    resultados: [
      {
        valor: "−75%",
        texto: L("no tempo de resposta de um sistema legado: de 40s para 10s", "response time of a legacy system: from 40s to 10s"),
        onde: "Condumig · VB6 + MySQL",
      },
      {
        valor: "−25%",
        texto: L("no cálculo de custas de 1.608 títulos: de 7min20s para 5min30s", "fee calculation for 1,608 records: from 7m20s to 5m30s"),
        onde: "CartSys · Entity Framework",
      },
      {
        valor: "−10%+",
        texto: L("de desperdício de materiais, com indicadores de BI por máquina", "material waste, with per-machine BI dashboards"),
        onde: "Condumig · MySQL + QlikView",
      },
    ],
    stack: [
      "C#",
      ".NET 8 / .NET Framework 4.8",
      "Windows Forms · WPF",
      "Entity Framework / EF Core",
      "ASP.NET Core Web API",
      "SQL Server · MySQL · Firebird",
      "PostgreSQL · SQLite",
      "DevExpress",
      "REST APIs · JWT",
      "Docker",
      "Git & GitHub",
      L("WiX / instaladores .msi", "WiX / .msi installers"),
    ],
  },

  // E-mail e WhatsApp ficam codificados (base64 do texto ao contrário) para robôs que
  // varrem o código atrás de contatos não acharem. Para gerar um valor novo:
  //   node tools/codificar.js "seu@email.com"
  contato: {
    email: revelar("bW9jLmxpYW1nQDI2MW1hLnNhaXRhbXhlbGE="),
    // Endereço apelido do FormSubmit (chega no e-mail de ativação). Se preenchido, é usado
    // no envio do formulário no lugar do e-mail, que assim não aparece na requisição.
    formsubmitId: "e8db717fac99061a0f23110ebd649f74",
    github: "https://github.com/alex-m-silva",
    linkedin: "https://www.linkedin.com/in/alex-matias-silva",
    instagram: "", // vazio: não aparece no site
    // Currículo em PDF (só em português). Vazio: some o botão do topo, do contato e da paleta
    curriculo: "/assets/curriculo/Alex-Matias-CV.pdf",
    whatsapp: revelar("ODE5MTE0ODg5NzM1NQ=="), // só números com DDI e DDD
    // Texto que já vem escrito ao abrir o WhatsApp
    whatsappMensagem: L(
      "Olá, Alex! Vi seu portfólio e gostaria de conversar sobre um projeto.",
      "Hi Alex! I saw your portfolio and would like to talk about a project."
    ),
  },

  // Experiência: cada item vira um "commit" no git log. `fim` vazio = emprego atual.
  experiencia: [
    {
      cargo: L("Desenvolvedor de Software", "Software Developer"),
      empresa: "CartSys Software",
      inicio: "2026-03",
      fim: "",
      local: "Divinópolis, MG",
      resumo: L(
        "Desenvolvimento e evolução do Cartsys, ERP desktop para os setores registral e notarial, usado por cartórios de Protesto, RTD/PJ, Registro de Imóveis e Notas, com módulos Financeiro e NFS-e. Uma solução com mais de 75 projetos em C#.",
        "Development of Cartsys, a desktop ERP for Brazilian notary and registry offices (protests, deeds, real estate and corporate registries), with Finance and electronic service invoice (NFS-e) modules. A solution with more than 75 C# projects."
      ),
      destaques: L([
        "Integração bancária via API REST (Unicred): emissão, consulta, baixa, pagamento, alteração de vencimento e impressão de boletos em lote, com autenticação por token e tratamento de falhas HTTP",
        "Redução de 25% no cálculo de custas de 1.608 títulos (de 7min20s para 5min30s), eliminando consultas N+1 e otimizando o Entity Framework",
        "Banco em nuvem via VPN: rotinas críticas em lote com carga em blocos, cache de dados de referência, auditoria agrupada e inserts multi-row, reduzindo as idas ao banco sem alterar resultados",
        "Livro eletrônico com assinatura digital: PDF/A, hash SHA-256 e assinatura CMS com certificado digital",
        "NFS-e: sincronização com provedores municipais e nacional, sem reemissão e sem ajuste manual no banco",
        "Relatório unificado do CNJ integrando SQL Server e Firebird",
        "Modernização visual para DevExpress WXI em centenas de formulários",
      ], [
        "Banking integration through a REST API (Unicred): issuing, querying, settling, paying, rescheduling and batch-printing bank slips, with token authentication and HTTP failure handling",
        "25% faster fee calculation for 1,608 records (from 7m20s to 5m30s) by removing N+1 queries and tuning Entity Framework",
        "Cloud database over VPN: critical batch routines with chunked loading, reference data caching, grouped audit logs and multi-row inserts, cutting database round trips without changing results",
        "Digitally signed electronic ledger: PDF/A, SHA-256 hashing and CMS signatures with a digital certificate",
        "Electronic service invoices (NFS-e): synchronization with municipal and national providers, with no reissuing and no manual database fixes",
        "Unified report for the National Council of Justice (CNJ) combining SQL Server and Firebird",
        "Visual modernization to DevExpress WXI across hundreds of forms",
      ]),
      stack: ["C#", ".NET Framework", "WinForms", "DevExpress", "Entity Framework", "LINQ", "SQL Server", "Firebird", "REST APIs", "SVN"],
    },
    {
      cargo: L("Desenvolvedor de Software", "Software Developer"),
      empresa: "Condumig",
      inicio: "2023-05",
      fim: "2026-03",
      local: "Divinópolis, MG",
      resumo: L(
        "Sustentação de sistemas legados críticos e desenvolvimento de soluções modernas em C#, com foco em automação de processos industriais, confiabilidade operacional e qualidade de dados.",
        "Maintenance of critical legacy systems and development of modern C# solutions, focused on industrial process automation, operational reliability and data quality."
      ),
      destaques: L([
        "Tempo de resposta 75% menor (de 40s para 10s) em sistema legado VB6 do módulo de engenharia, com normalização de banco, criação de índices e reescrita de queries no MySQL",
        "Automação do fluxo de impressão e controle industrial em .NET 4.8, WinForms, Entity Framework e MySQL, eliminando processos manuais",
        "Mais de 10% de redução no desperdício de materiais, com ferramentas de BI por máquina integrando MySQL e Progress para o QlikView e o Grafeno",
        "Cálculo do Ticket Alimentação em .NET 8: processa relatórios do iPonto via EPPlus e aplica as regras de assiduidade (faixas de 80% a 100%), sem conferência manual",
        "\"Fiscal digital\" de pesagem: monitora em tempo real as oscilações de peso das bobinas e avisa os gestores pelo Telegram em caso de suspeita de fraude",
        "Rotinas de integração em .NET 8, EF Core e MySQL para extrair dados do Progress (Datasul), alimentando relatórios financeiros e regras de cobrança",
        "Estabilidade e evolução dos sistemas legados de Fábrica, Estoque e Administrativo em VB6",
      ], [
        "75% faster response time (from 40s to 10s) in a legacy VB6 engineering system, through database normalization, new indexes and rewritten MySQL queries",
        "Automated the printing and industrial control workflow with .NET 4.8, WinForms, Entity Framework and MySQL, removing manual steps",
        "Over 10% less material waste with per-machine BI tools connecting MySQL and Progress to QlikView and Grafeno",
        "Meal allowance calculation in .NET 8: reads time-clock reports with EPPlus and applies the attendance rules (80% to 100% tiers) with no manual checking",
        "A \"digital inspector\" for weighing: monitors coil weight changes in real time and alerts managers on Telegram when fraud is suspected",
        "Integration routines in .NET 8, EF Core and MySQL extracting data from Progress (Datasul) for financial reports and billing rules",
        "Stability and evolution of the legacy Factory, Inventory and Administrative systems in VB6",
      ]),
      stack: ["C#", ".NET Framework 4.8", ".NET 8", "EF Core", "MySQL", "Progress (Datasul)", "WinForms", "Docker", "Arduino", "Git"],
    },
    {
      cargo: "Freelancer",
      empresa: "Fiverr",
      inicio: "2023-11",
      fim: "2023-12",
      local: L("Remoto", "Remote"),
      resumo: L(
        "Aplicação em C# e WinForms que recebia textos e os formatava automaticamente de acordo com as necessidades específicas do cliente.",
        "A C# and WinForms application that took in text and automatically formatted it to the client's specific needs."
      ),
      destaques: [],
      stack: ["C#", "WinForms"],
    },
    {
      cargo: L("Desenvolvedor de Software", "Software Developer"),
      empresa: "Petrarca Software",
      inicio: "2022-07",
      fim: "2023-02",
      local: "Divinópolis, MG",
      resumo: L(
        "Modernização do sistema de gestão da empresa, com novos módulos em C# e manutenção do legado em VB.NET.",
        "Modernization of the company's management system, with new C# modules and maintenance of the VB.NET legacy code."
      ),
      destaques: L([
        "Novos módulos em C# .NET com WPF (MVVM), Entity Framework e SQL Server, com separação de responsabilidades",
        "Conversão de bibliotecas críticas de VB.NET para C#, melhorando performance e legibilidade",
        "Reimplementação do módulo de relatórios gerenciais com Crystal Reports",
      ], [
        "New C# .NET modules with WPF (MVVM), Entity Framework and SQL Server, with clear separation of concerns",
        "Ported critical libraries from VB.NET to C#, improving performance and readability",
        "Rebuilt the management reports module with Crystal Reports",
      ]),
      stack: ["C#", ".NET Framework 4.5.2", "WPF", "MVVM", "SQL Server", "VB.NET", "Crystal Reports", "Bitbucket"],
    },
  ],

  formacao: [
    {
      curso: L("Ciência da Computação · Bacharelado", "Bachelor's in Computer Science"),
      instituicao: "Faculdade Pitágoras",
      inicio: "2023-02",
      fim: "2026-06",
    },
  ],

  // Certificados: viram "tags" de versão na página. Os títulos ficam como foram emitidos.
  // `data` é o mês de conclusão ("AAAA-MM"); `categoria` vira o filtro no topo da seção.
  certificados: (function () {
    var ARQ = L("arquitetura & backend", "architecture & backend");
    var WEB = "web, cloud & devops";
    var FUND = L("fundamentos & POO", "fundamentals & OOP");
    var UI = L("interface & relatórios", "UI & reports");
    return [
      // --- Arquitetura, backend .NET, segurança e banco de dados ---
      { titulo: "Introdução ao ASP.NET Core Identity", emissor: "balta.io", data: "2025-10", categoria: ARQ, skills: [".NET", "ASP.NET Core Identity", L("Autenticação", "Authentication")], url: "https://balta.io/certificates/4c903784-850c-4948-8809-459e1a35b9fd" },
      { titulo: "Segurança em APIs ASP.NET com JWT e Bearer Authentication", emissor: "balta.io", data: "2025-06", categoria: ARQ, skills: [".NET", "JWT", "Bearer Authentication", L("Segurança em APIs", "API security")], url: "https://balta.io/certificates/e2fe40e9-1c73-4d35-afa7-29199ea870ff" },
      { titulo: "Fundamentos dos Microsserviços", emissor: "balta.io", data: "2025-06", categoria: ARQ, skills: [L("Microsserviços", "Microservices"), ".NET"], url: "https://balta.io/certificates/314a383b-d260-417f-9874-420fceb9764e" },
      { titulo: "Fundamentos do Event-Driven Architecture", emissor: "balta.io", data: "2025-06", categoria: ARQ, skills: ["Event-Driven Architecture", ".NET"], url: "https://balta.io/certificates/b6614f6d-c6f2-46b6-ae6e-b6abd488a778" },
      { titulo: "Aplicações Mult-Tenant com Entity Framework Core", emissor: "balta.io", data: "2025-06", categoria: ARQ, skills: [".NET", "Multi-Tenant", "Entity Framework Core"], url: "https://balta.io/certificates/b5a2db85-205c-4c06-8502-ad607879f08e" },
      { titulo: "Dominando Injeção de Dependência", emissor: "balta.io", data: "2025-06", categoria: ARQ, skills: [".NET", L("Injeção de dependência", "Dependency injection")], url: "https://balta.io/certificates/9f73b59a-63cb-49b4-b4c0-ab2aea57db94" },
      { titulo: "Modelando Domínios Ricos", emissor: "balta.io", data: "2025-05", categoria: ARQ, skills: [L("Domínios Ricos", "Rich domains"), "DDD"], url: "https://balta.io/certificates/09a27615-177a-4102-b9a4-b4ce390063c2" },
      { titulo: "Refatorando para testes de unidade", emissor: "balta.io", data: "2025-05", categoria: ARQ, skills: [".NET", L("Testes de unidade", "Unit testing")], url: "https://balta.io/certificates/15289f5a-3dcf-454d-908b-c5c0cb254b71" },
      { titulo: "Acesso à dados com .NET, C#, Dapper e SQL Server", emissor: "balta.io", data: "2024-09", categoria: ARQ, skills: [".NET", "C#", "Dapper", "SQL Server", "Docker"], url: "https://balta.io/certificates/c7691c16-4763-4e6c-be09-a322e5c1ddd0" },
      { titulo: "Fundamentos do Entity Framework", emissor: "balta.io", data: "2024-09", categoria: ARQ, skills: [".NET", "Entity Framework"], url: "https://balta.io/certificates/f8dcaad1-bb61-44aa-b796-11933b5759c7" },
      { titulo: "Fundamentos do SQL Server", emissor: "balta.io", data: "2024-06", categoria: ARQ, skills: ["SQL Server", "Azure"], url: "https://balta.io/certificates/90437c20-9b23-48b7-990b-401fe26877fc" },

      // --- Frameworks web, cloud e DevOps ---
      { titulo: "Fundamentos do Azure, Git, GitHub e DevOps", emissor: "balta.io", data: "2025-04", categoria: WEB, skills: [".NET", "Git", "GitHub", "Azure", "DevOps"], url: "https://balta.io/certificates/f8f92a90-3f69-4d54-b76b-e7c912e3e3de" },
      { titulo: "Progressive Web Apps com Blazor Web Assembly", emissor: "balta.io", data: "2025-03", categoria: WEB, skills: [".NET", "Blazor", "PWA"], url: "https://balta.io/certificates/3ed8617d-a7db-46a8-a89e-68cd713a2817" },
      { titulo: "Fundamentos do Blazor com .NET 8", emissor: "balta.io", data: "2025-03", categoria: WEB, skills: [".NET", "Blazor"], url: "https://balta.io/certificates/0004c940-1ce2-45bb-980e-96bc7431230f" },
      { titulo: "Fundamentos do Blazor Web Assembly", emissor: "balta.io", data: "2025-03", categoria: WEB, skills: [".NET", "Blazor"], url: "https://balta.io/certificates/d9d602b4-6a09-4945-9749-617031b3d220" },
      { titulo: "Fundamentos do Blazor Server", emissor: "balta.io", data: "2025-03", categoria: WEB, skills: [".NET", "Blazor"], url: "https://balta.io/certificates/7ed45d2e-a4f4-4c86-a04a-6ab190627e46" },
      { titulo: "Fundamentos do ASP.NET 6", emissor: "balta.io", data: "2025-03", categoria: WEB, skills: [".NET", "ASP.NET MVC"], url: "https://balta.io/certificates/6b095b3b-ab62-4e60-9689-cadab4a7b75d" },
      { titulo: "Uma visão geral sobre o ASP.NET Razor Pages", emissor: "balta.io", data: "2023-04", categoria: WEB, skills: [".NET", "ASP.NET MVC", "Razor Pages"], url: "https://balta.io/certificates/7b08c6e0-0254-4293-bd7a-67a7646b7beb" },

      // --- Fundamentos e programação orientada a objetos ---
      { titulo: "Fundamentos do JavaScript", emissor: "balta.io", data: "2025-10", categoria: FUND, skills: ["JavaScript"], url: "https://balta.io/certificates/52db820b-9d4d-4b9a-a18f-141d8c53d296" },
      { titulo: ".NET Developer Fundamentals (carreira)", emissor: "balta.io", data: "2025-07", categoria: FUND, skills: [".NET", "C#"], url: "https://balta.io/certificates/19b388a1-37b2-47b9-9d73-98406e7643be" },
      { titulo: "Fundamentos do C#", emissor: "balta.io", data: "2025-07", categoria: FUND, skills: ["C#", ".NET"], url: "https://balta.io/certificates/3ae555bc-e0ae-46ac-b1c8-ceded65120d6" },
      { titulo: "Aplicando Orientação a Objetos em Projetos Reais com C# 11 e .NET 7", emissor: "balta.io", data: "2025-06", categoria: FUND, skills: [L("POO", "OOP"), ".NET", "C# 11"], url: "https://balta.io/certificates/b3cf963c-b806-4bac-8b64-3311dbe953e3" },
      { titulo: "Fundamentos da Orientação a Objetos", emissor: "balta.io", data: "2025-05", categoria: FUND, skills: [L("POO", "OOP")], url: "https://balta.io/certificates/8e5be4ce-1c48-4983-80e0-80f9123dbce7" },
      { titulo: "C# COMPLETO Programação Orientada a Objetos", emissor: "Udemy", data: "", categoria: FUND, skills: ["C#", L("POO", "OOP"), "ASP.NET MVC", "MySQL"], url: "https://udemy-certificate.s3.amazonaws.com/image/UC-0814dee0-00fa-42dc-8fe6-0f4d7115650d.jpg" },
      { titulo: "Curso Programador", emissor: L("Curso presencial", "In-person course"), data: "", categoria: FUND, skills: ["VBA", "Delphi"], url: "" },

      // --- Complementar: interface, web design e relatórios ---
      { titulo: "Sites Responsivos", emissor: "balta.io", data: "2025-06", categoria: UI, skills: [L("Sites Responsivos", "Responsive websites")], url: "https://balta.io/certificates/f5b45281-23e0-47a9-8799-417488fe9e77" },
      { titulo: "SAP Crystal Reports - Do Básico ao Avançado", emissor: "Udemy", data: "", categoria: UI, skills: ["Crystal Reports"], url: "https://www.udemy.com/certificate/UC-5cae22f4-44fb-4286-8c5c-f4849b796327/" },
    ];
  })(),

  // Projetos. Cada um vira um card na página inicial e uma página própria em /projetos/<slug>
  // (e /en/projetos/<slug> em inglês).
  //   slug        endereço da página; sem ele, é gerado a partir do nome
  //   seo         título e descrição da página no Google (até ~60 e ~155 caracteres),
  //               `categoria` e `sistema` para os dados estruturados (schema.org)
  //   sobre       texto da página do projeto (um parágrafo por item)
  //   linguagens  porcentagem (soma 100), desenha a barra de cores
  //   repo        vazio = repositório privado ("código disponível sob consulta")
  projetos: [
    {
      nome: "GestaoComercial",
      slug: "gestao-comercial",
      resumo: L(
        "Sistema desktop para lojas que vendem produtos e prestam serviço nos equipamentos dos clientes. Primeiro uso: loja de toners, impressoras e papelaria.",
        "Desktop system for stores that sell products and also service their customers' equipment. First deployed at a toner, printer and stationery store."
      ),
      seo: {
        titulo: L("GestaoComercial: sistema para loja de toner e impressoras", "GestaoComercial: management system for printer supply stores"),
        descricao: L(
          "Sistema de gestão em C# para loja de toner, impressoras e papelaria: orçamentos, pedidos, estoque com produtos compatíveis, PDF e WhatsApp.",
          "C# management system for toner, printer and stationery stores: quotes, orders, inventory with compatible products, PDF quotes and WhatsApp."
        ),
        categoria: "BusinessApplication", // tipo de aplicação para o Google (schema.org)
        sistema: "Windows",
      },
      sobre: L([
        "O GestaoComercial é um sistema desktop em Windows Forms (.NET Framework 4.8) para lojas que vendem produtos e também prestam serviço nos equipamentos dos clientes. Nasceu da estrutura do sistema de oficina, com nomes genéricos para servir a outros ramos, e o primeiro uso é uma loja de toners e impressoras com papelaria.",
        "O fluxo acompanha o dia a dia do balcão: o cliente chega com a impressora, sai um orçamento, ele aprova pelo WhatsApp, a loja faz o serviço, finaliza o pedido e o estoque se ajusta sozinho. Para vendas rápidas, a venda de balcão já nasce finalizada.",
        "O ponto forte é a ligação entre equipamento e suprimento. Cada produto guarda os modelos em que serve (por exemplo, \"HP P1102; HP M1132\"), e a comparação ignora maiúsculas, espaços e traços e aceita o modelo com ou sem a marca. Assim, no pedido de uma impressora a lista de produtos já abre filtrada pelos toners compatíveis, e o cadastro do cliente mostra, para cada equipamento, os suprimentos que servem e o estoque deles.",
        "Os produtos são separados por departamento (impressão e papelaria), o que alimenta os filtros do catálogo e o relatório de vendas por departamento. O sistema roda em SQLite, sem servidor, ou em PostgreSQL para vários computadores, com scripts de migração versionados e instalador .msi gerado pelo CriadorInstalador.",
      ], [
        "GestaoComercial is a Windows Forms desktop system (.NET Framework 4.8) for stores that sell products and also service their customers' equipment. It grew out of the auto repair shop system, with generic names so it fits other businesses, and its first user is a toner and printer store with a stationery section.",
        "The workflow follows the shop counter day to day: the customer brings in a printer, a quote goes out, the customer approves it on WhatsApp, the store does the job, closes the order and the inventory updates itself. Quick counter sales are created already closed.",
        "Its strong point is the link between equipment and supplies. Each product stores the models it fits (for example \"HP P1102; HP M1132\"), and the match ignores case, spaces and dashes and accepts the model with or without the brand. So when an order is for a printer, the product list opens already filtered to the compatible toners, and each customer's equipment shows which supplies fit it and how many are in stock.",
        "Products belong to departments (printing and stationery), which drive the catalog filters and the sales-by-department report. The system runs on SQLite with no server, or on PostgreSQL for several computers, with versioned migration scripts and an .msi installer built by CriadorInstalador.",
      ]),
      detalhes: L([
        "Pedido com fluxo orçamento → aprovado → finalizado, e venda rápida de balcão",
        "Produtos com modelos compatíveis: o pedido de uma impressora já filtra os toners que servem nela",
        "Orçamento em PDF com os dados da loja e envio pelo WhatsApp com a mensagem pronta",
        "Relatórios: orçamentos parados, vendas por departamento, o que repor, serviços mais pedidos e clientes que mais voltam, com exportação para Excel",
        "Usuários com permissões por área (vender, orçar, aprovar, finalizar, ver relatórios)",
        "Roda em SQLite (sem servidor) ou PostgreSQL, com scripts de migração versionados",
      ], [
        "Order workflow quote → approved → closed, plus quick counter sales",
        "Products with compatible models: a printer order already filters the toners that fit it",
        "PDF quotes with the store's details, sent on WhatsApp with a ready-made message",
        "Reports: stalled quotes, sales by department, what to restock, top services and returning customers, with Excel export",
        "Users with per-area permissions (sell, quote, approve, close, view reports)",
        "Runs on SQLite (no server) or PostgreSQL, with versioned migration scripts",
      ]),
      tags: ["C#", ".NET Framework 4.8", "WinForms", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 94, "SQL": 6 },
      repo: "",            // repositório privado
      demo: "",
      destaque: true,
      // Vídeo e tour pelas telas: na janela do README e na página do projeto
      apresentacao: {
        pasta: "/assets/projetos/gestao-comercial/",
        video: "apresentacao.mp4",
        capa: "capa-video.webp",
        intro: L(
          "O cliente chega com a impressora, sai um orçamento, ele aprova pelo WhatsApp, a loja faz o serviço, finaliza e o estoque se ajusta sozinho. Bora dar uma volta pelas telas:",
          "The customer brings in a printer, a quote goes out, they approve it on WhatsApp, the store does the job, closes it and the inventory updates itself. Let's take a tour of the screens:"
        ),
        telas: [
          { arquivo: "01-pedidos", titulo: L("Pedidos e orçamentos", "Orders and quotes"), texto: L("A tela que fica aberta o dia todo. Vermelho é orçamento esperando resposta, verde é aprovado, azul é finalizado.", "The screen that stays open all day. Red is a quote awaiting an answer, green is approved, blue is closed.") },
          { arquivo: "02-clientes", titulo: L("Clientes", "Customers"), texto: L("CPF ou CNPJ e endereço pela busca de CEP. Os equipamentos do cliente já mostram os toners que servem neles.", "Tax ID and address lookup by postal code. Each customer's equipment already shows the toners that fit it.") },
          { arquivo: "03-servicos", titulo: L("Serviços", "Services"), texto: L("O cardápio da loja, com preço e tempo estimado. Entra no orçamento com um clique.", "The store's service menu, with price and estimated time. One click adds it to a quote.") },
          { arquivo: "04-funcionarios", titulo: L("Funcionários", "Employees"), texto: L("Dados pessoais e de contrato. O funcionário vira o responsável pelo serviço e pode ter login próprio.", "Personal and contract details. Employees are assigned to jobs and can have their own login.") },
          { arquivo: "05-produtos", titulo: L("Produtos e estoque", "Products and inventory"), texto: L("Estoque mínimo, preço de compra e venda e margem calculada na hora. Cada toner sabe em quais impressoras serve.", "Minimum stock, cost and sale price, and the margin calculated on the spot. Each toner knows which printers it fits.") },
          { arquivo: "06-relatorios", titulo: L("Relatórios", "Reports"), texto: L("Orçamentos parados, vendas por departamento, o que repor e quem mais volta. Exporta para o Excel e imprime.", "Stalled quotes, sales by department, what to restock and who comes back the most. Exports to Excel and prints.") },
          { arquivo: "07-usuarios", titulo: L("Usuários e permissões", "Users and permissions"), texto: L("Cada pessoa com o seu login, e o administrador marca o que ela pode fazer.", "Everyone has their own login, and the administrator decides what each person can do.") },
          { arquivo: "08-orcamento", titulo: L("Montando um orçamento", "Building a quote"), texto: L("Cliente → equipamento → serviços → detalhes → produtos, já filtrados pelos compatíveis. O total sai pronto, com os descontos.", "Customer → equipment → services → details → products, already filtered to compatible ones. The total comes out ready, with discounts.") },
          { arquivo: "09-aprovar", titulo: L("Aprovar, finalizar e enviar", "Approve, close and send"), texto: L("Aprovou, fica verde. Finalizou, o estoque baixa sozinho. O orçamento vai pelo WhatsApp, em PDF ou dos dois jeitos.", "Approved turns green. Closing it updates the inventory. The quote goes out on WhatsApp, as a PDF or both.") },
        ],
      },
    },
    {
      nome: "GestaoModa",
      slug: "gestao-moda",
      resumo: L(
        "Vendas e estoque para lojas de roupas: PDV pelo teclado, grade de tamanhos e cores, crediário, trocas, caixa e 22 relatórios. Reconstruído em .NET 8 sobre a base do GestaoComercial.",
        "Sales and inventory for clothing stores: keyboard-driven POS, size and color grid, store credit, exchanges, cash register and 22 reports. Rebuilt in .NET 8 on top of GestaoComercial."
      ),
      seo: {
        titulo: L("GestaoModa: sistema de vendas e estoque para loja de roupas", "GestaoModa: sales and inventory system for clothing stores"),
        descricao: L(
          "Sistema para loja de roupas em C# e .NET 8: PDV, grade de tamanhos e cores com código de barras, crediário, trocas e vale-troca, caixa e relatórios.",
          "Clothing store system in C# and .NET 8: POS, size and color grid with barcodes, store credit, exchanges and gift vouchers, cash register and reports."
        ),
        categoria: "BusinessApplication",
        sistema: "Windows",
      },
      sobre: L([
        "O GestaoModa é um sistema desktop de vendas e estoque para lojas de roupas e moda: boutiques, moda feminina, masculina, infantil, moda praia, fitness e acessórios. Ele nasceu do NewBronx, um sistema em MySQL de uma loja de roupas, e foi reconstruído em .NET 8 sobre a mesma base do GestaoComercial.",
        "O PDV foi pensado para ser usado pelo teclado (F2 a F9): leitor de código de barras, busca por nome, cor e tamanho, \"3*código\" para várias peças, desconto por peça ou geral e várias formas de pagamento na mesma venda, incluindo Pix, cartão parcelado, crediário e vale-troca.",
        "Cada peça tem a sua grade de tamanhos × cores, e cada combinação tem código de barras (EAN-13 gerado pelo sistema ou o do fornecedor) e estoque próprio. Entrada de mercadoria pelo leitor, inventário com motivo, histórico de cada movimento e etiquetas com preço \"de/por\" completam o controle de estoque.",
        "No financeiro, o sistema cuida do crediário no carnê (com limite por cliente, multa e juros de atraso), de trocas e vales-troca, da abertura e do fechamento do caixa com conferência e das contas a pagar. São 22 relatórios, entre eles curva ABC, produtos parados, clientes sumidas e um DRE simples, além de avisos do dia e mensagens prontas pelo WhatsApp.",
        "As telas são montadas em código, sem o designer do Visual Studio, e um projeto de testes percorre o sistema de ponta a ponta num banco temporário: cadastro, vendas, crediário, trocas, caixa e relatórios.",
      ], [
        "GestaoModa is a desktop sales and inventory system for clothing and fashion stores: boutiques, women's, men's and kids' wear, swimwear, fitness and accessories. It started as NewBronx, a MySQL system for a clothing store, and was rebuilt in .NET 8 on the same foundation as GestaoComercial.",
        "The point of sale is built to be used from the keyboard (F2 to F9): barcode scanner, search by name, color and size, \"3*code\" for several items, per-item or overall discounts and several payment methods in the same sale, including Pix, installments, store credit and gift vouchers.",
        "Each item has its own size × color grid, and every combination has its own barcode (an EAN-13 generated by the system or the supplier's) and its own stock. Receiving goods with the scanner, stock counts with a reason, a history of every movement and \"was/now\" price tags complete the inventory control.",
        "On the financial side, the system handles store credit with payment booklets (per-customer limits, late fees and interest), exchanges and gift vouchers, opening and closing the register with a count, and accounts payable. There are 22 reports, including ABC curve, slow-moving products, customers who stopped buying and a simple income statement, plus daily alerts and ready-made WhatsApp messages.",
        "The screens are built in code, without the Visual Studio designer, and a test project runs through the system end to end on a temporary database: registration, sales, store credit, exchanges, cash register and reports.",
      ]),
      detalhes: L([
        "PDV pelo teclado com leitor de código de barras e várias formas de pagamento na mesma venda",
        "Grade de tamanhos × cores com código de barras EAN-13 e estoque por variação",
        "Crediário no carnê com limite por cliente, multa e juros de atraso",
        "Trocas, vale-troca com validade, caixa com conferência e contas a pagar",
        "22 relatórios (curva ABC, DRE simples, produtos parados) com exportação para Excel",
        "Testes de ponta a ponta das regras de negócio num banco temporário",
      ], [
        "Keyboard-driven POS with barcode scanner and several payment methods in the same sale",
        "Size × color grid with EAN-13 barcodes and stock per variation",
        "Store credit with payment booklets, per-customer limits, late fees and interest",
        "Exchanges, gift vouchers with expiry, cash register with counting, and accounts payable",
        "22 reports (ABC curve, simple income statement, slow-moving products) with Excel export",
        "End-to-end tests of the business rules on a temporary database",
      ]),
      tags: ["C#", ".NET 8", "WinForms", "EF Core", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 96, "SQL": 4 },
      repo: "",            // repositório privado
      demo: "",
      destaque: true,
    },
    {
      nome: "pdf-para-epub",
      slug: "pdf-para-epub",
      resumo: L(
        "Conversor online de PDF para EPUB, para ler no Kindle, Kobo e apps de leitura. Front estático no GitHub Pages e API em Python que roda o Calibre num container Docker.",
        "Online PDF to EPUB converter for reading on Kindle, Kobo and reading apps. Static front end on GitHub Pages and a Python API running Calibre in a Docker container."
      ),
      seo: {
        titulo: L("pdf-para-epub: conversor online de PDF para EPUB", "pdf-para-epub: online PDF to EPUB converter"),
        descricao: L(
          "Conversor de PDF para EPUB com front no GitHub Pages e API em Python (FastAPI) rodando o Calibre em Docker, com rate limit e arquivos temporários.",
          "PDF to EPUB converter with a front end on GitHub Pages and a Python (FastAPI) API running Calibre in Docker, with rate limiting and temporary files."
        ),
        categoria: "UtilitiesApplication",
        sistema: "Web",
      },
      sobre: L([
        "O pdf-para-epub é um conversor online de PDF para EPUB, o formato que se adapta à tela do Kindle, do Kobo e dos aplicativos de leitura. A pessoa escolhe um ou mais PDFs, converte e baixa o EPUB, sem login.",
        "A conversão é feita pelo Calibre (ebook-convert), que precisa de um servidor com os binários do sistema. Por isso o projeto tem duas partes: as páginas, em HTML, CSS e JavaScript puros, publicadas no GitHub Pages; e uma API em Python com FastAPI, empacotada em Docker com o Calibre instalado e publicada no Render.",
        "A API foi feita para aguentar uso público: limite de tamanho verificado no cabeçalho e durante o recebimento, rate limit por IP, limite de conversões simultâneas, timeout e uma segunda tentativa sem as opções heurísticas quando a primeira falha. Os arquivos ficam em pastas temporárias com nome aleatório e são apagados depois da resposta e numa limpeza periódica.",
        "Como o servidor gratuito dorme quando fica sem uso, a página já manda um sinal para acordá-lo assim que abre e mostra o status (conectando, acordando, online). O site também traz guias sobre leitura digital, como enviar EPUB para o Kindle e por que alguns PDFs não convertem bem.",
      ], [
        "pdf-para-epub is an online converter from PDF to EPUB, the format that adapts to Kindle, Kobo and reading app screens. You pick one or more PDFs, convert them and download the EPUB, no login required.",
        "The conversion is done by Calibre (ebook-convert), which needs a server with the system binaries. So the project has two parts: the pages, in plain HTML, CSS and JavaScript, hosted on GitHub Pages; and a Python API with FastAPI, packaged in Docker with Calibre installed and deployed on Render.",
        "The API is built to withstand public use: upload size checked in the header and while receiving, rate limiting per IP, a cap on simultaneous conversions, a timeout and a second attempt without the heuristic options when the first one fails. Files live in randomly named temporary folders and are deleted after the response and in a periodic cleanup.",
        "Since the free server sleeps when idle, the page pings it to wake it up as soon as it opens and shows its status (connecting, waking up, online). The site also has guides on digital reading, such as sending EPUB to a Kindle and why some PDFs don't convert well.",
      ]),
      detalhes: L([
        "API FastAPI que recebe o PDF, roda o ebook-convert do Calibre e devolve o EPUB",
        "Rate limit por IP, limite de conversões simultâneas, timeout e validação de tamanho do upload",
        "Arquivos temporários com nome aleatório, apagados após a resposta e numa limpeza periódica",
        "Front em HTML, CSS e JavaScript com fila de arquivos, arrastar e soltar e status do servidor",
        "Publicação separada: páginas no GitHub Pages e API em Docker no Render",
      ], [
        "FastAPI API that receives the PDF, runs Calibre's ebook-convert and returns the EPUB",
        "Rate limiting per IP, a cap on simultaneous conversions, timeout and upload size validation",
        "Randomly named temporary files, deleted after the response and in a periodic cleanup",
        "HTML, CSS and JavaScript front end with a file queue, drag and drop and server status",
        "Split deployment: pages on GitHub Pages and the Docker API on Render",
      ]),
      tags: ["Python", "FastAPI", "Docker", "Calibre", "JavaScript"],
      linguagens: { "HTML": 40, "CSS": 25, "Python": 20, "JavaScript": 15 },
      repo: "https://github.com/alex-m-silva/pdf-para-epub",
      demo: "https://alex-m-silva.github.io/pdf-para-epub/",
      destaque: true,
    },
    {
      nome: "ProjetoOficina",
      slug: "projeto-oficina",
      resumo: L(
        "O sistema que deu origem à família: ordens de serviço, clientes e veículos para oficinas mecânicas.",
        "The system that started the family: work orders, customers and vehicles for auto repair shops."
      ),
      seo: {
        titulo: L("ProjetoOficina: sistema para oficina mecânica em C#", "ProjetoOficina: auto repair shop system in C#"),
        descricao: L(
          "Sistema para oficina mecânica em C# e Windows Forms: ordens de serviço, clientes, veículos, peças, serviços, funcionários, relatórios e usuários.",
          "Auto repair shop system in C# and Windows Forms: work orders, customers, vehicles, parts, services, employees, reports and users."
        ),
        categoria: "BusinessApplication",
        sistema: "Windows",
      },
      sobre: L([
        "O ProjetoOficina é um sistema desktop em Windows Forms para oficinas mecânicas, e foi o primeiro da família. Ele organiza o atendimento do orçamento à entrega: o cliente, o veículo, as peças e os serviços entram na ordem de serviço, que acompanha o trabalho até a conclusão.",
        "Tem cadastros de clientes, veículos, produtos (peças), serviços e funcionários, relatórios com impressão, e controle de acesso com login, usuários e troca de senha. Os dados ficam no Entity Framework Core, com SQLite ou PostgreSQL.",
        "Foi da estrutura dele que saiu o GestaoComercial, com os nomes generalizados (veículo virou equipamento) para atender outros ramos, e depois o GestaoModa. A infraestrutura comum (telas base, máscaras, impressão, banco) passou de um sistema para o outro.",
      ], [
        "ProjetoOficina is a Windows Forms desktop system for auto repair shops, and the first of the family. It organizes the service from quote to delivery: the customer, the vehicle, the parts and the services go into a work order that follows the job until it's done.",
        "It has records for customers, vehicles, products (parts), services and employees, printable reports, and access control with login, users and password change. Data is stored with Entity Framework Core, on SQLite or PostgreSQL.",
        "GestaoComercial grew out of its structure, with generalized names (vehicle became equipment) to serve other businesses, followed by GestaoModa. The shared infrastructure (base screens, input masks, printing, database) carried over from one system to the next.",
      ]),
      detalhes: L([
        "Ordem de serviço do orçamento à entrega, com peças e serviços",
        "Cadastro de clientes, veículos, peças, serviços e funcionários",
        "Relatórios com impressão",
        "Login, usuários e troca de senha",
        "Base de onde saíram o GestaoComercial e o GestaoModa",
      ], [
        "Work orders from quote to delivery, with parts and services",
        "Records for customers, vehicles, parts, services and employees",
        "Printable reports",
        "Login, users and password change",
        "The foundation GestaoComercial and GestaoModa grew out of",
      ]),
      tags: ["C#", ".NET Framework 4.8", "WinForms", "EF Core", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 100 },
      repo: "",            // repositório privado
      demo: "",
    },
    {
      nome: "CriadorInstalador",
      slug: "criador-instalador",
      resumo: L(
        "Programa com tela que gera o instalador .msi de um sistema Windows Forms, com telas em português e pasta de dados compartilhada.",
        "A desktop tool that builds the .msi installer for a Windows Forms system, with Portuguese setup screens and a shared data folder."
      ),
      seo: {
        titulo: L("CriadorInstalador: gerador de instalador .msi para WinForms", "CriadorInstalador: .msi installer builder for WinForms apps"),
        descricao: L(
          "Ferramenta em C# que gera o instalador .msi de sistemas Windows Forms com WiX: telas em português, atalhos, pasta de dados e atualização de versão.",
          "C# tool that builds .msi installers for Windows Forms apps with WiX: Portuguese setup screens, shortcuts, a data folder and in-place upgrades."
        ),
        categoria: "DeveloperApplication",
        sistema: "Windows",
      },
      sobre: L([
        "O CriadorInstalador é um programa com tela que gera o instalador .msi de um sistema Windows Forms. Basta apontar a pasta do programa (ou só o projeto, que ele compila em Release antes) e clicar em \"Gerar instalador\".",
        "O .msi gerado tem as telas em português (boas-vindas, escolha da pasta de instalação e instalação), cria atalhos no menu Iniciar e na área de trabalho, pode exigir o .NET Framework 4.8 e aparece em \"Adicionar/remover programas\". Instalar por cima atualiza a versão anterior mantendo os arquivos alterados no cliente, como o .exe.config.",
        "Para os sistemas de gestão, ele cria uma pasta de dados em %ProgramData% com permissão de gravação para todos os usuários (onde fica o banco SQLite) e pode mostrar uma tela de configuração da empresa: nome da loja e escolha entre SQLite e PostgreSQL, gravados só na primeira instalação.",
        "Por dentro, o programa escreve um projeto WiX Toolset 5 (Package.wxs e .wixproj) e roda o dotnet build nele. As opções de cada sistema ficam num arquivo .instalador (XML) com caminhos relativos, o que permite gerar o instalador de novo a cada versão sem refazer a configuração.",
      ], [
        "CriadorInstalador is a desktop tool that builds the .msi installer for a Windows Forms system. Just point it to the program folder (or only the project, which it builds in Release first) and click \"Build installer\".",
        "The generated .msi has Portuguese setup screens (welcome, install folder and install), creates Start menu and desktop shortcuts, can require .NET Framework 4.8 and shows up in \"Add/remove programs\". Installing over an existing copy upgrades it while keeping the files changed on the customer's machine, such as the .exe.config.",
        "For the management systems, it creates a data folder under %ProgramData% writable by every user (where the SQLite database lives) and can show a company setup screen: the store name and the choice between SQLite and PostgreSQL, saved only on the first install.",
        "Under the hood, the tool writes a WiX Toolset 5 project (Package.wxs and .wixproj) and runs dotnet build on it. Each system's options live in an .instalador (XML) file with relative paths, so the installer can be rebuilt for every release without setting it up again.",
      ]),
      detalhes: L([
        "Telas do instalador em português, com escolha da pasta de instalação e atalhos",
        "Pode exigir o .NET Framework 4.8",
        "Cria pasta de dados em %ProgramData% com permissão para todos os usuários",
        "Tela de configuração da empresa: nome da loja e banco SQLite ou PostgreSQL",
        "Atualiza a versão anterior mantendo os arquivos alterados no cliente",
        "Gera o projeto WiX 5 e compila com dotnet build",
      ], [
        "Portuguese installer screens, with install folder choice and shortcuts",
        "Can require .NET Framework 4.8",
        "Creates a data folder under %ProgramData% writable by every user",
        "Company setup screen: store name and SQLite or PostgreSQL database",
        "Upgrades the previous version while keeping files changed on the customer's machine",
        "Generates the WiX 5 project and builds it with dotnet build",
      ]),
      tags: ["C#", "WiX", "MSI", "WinForms"],
      linguagens: { "C#": 88, "WiX": 12 },
      repo: "",            // repositório privado
      demo: "",
    },
    {
      nome: "LionFinance",
      slug: "lion-finance",
      resumo: L(
        "API de finanças pessoais em ASP.NET Core organizada em camadas: Domain, Application, Infrastructure e API. Em desenvolvimento.",
        "Personal finance API in ASP.NET Core organized in layers: Domain, Application, Infrastructure and API. Work in progress."
      ),
      seo: {
        titulo: L("LionFinance: API de finanças pessoais em ASP.NET Core", "LionFinance: personal finance API in ASP.NET Core"),
        descricao: L(
          "API de finanças pessoais em ASP.NET Core e EF Core com arquitetura em camadas: transações, categorias, parcelamentos e orçamento mensal.",
          "Personal finance API in ASP.NET Core and EF Core with a layered architecture: transactions, categories, installments and monthly budget."
        ),
        categoria: "FinanceApplication",
        sistema: "Web (API)",
      },
      sobre: L([
        "O LionFinance é uma API de finanças pessoais em ASP.NET Core, ainda em desenvolvimento. O objetivo é registrar receitas e despesas, separá-las por categoria, acompanhar compras parceladas e comparar o que foi gasto com o orçamento do mês.",
        "O projeto é organizado em camadas: Domain (entidades como transação, categoria, parcela e orçamento mensal, e os tipos de transação e formas de pagamento), Application (regras e casos de uso), Infrastructure (persistência com Entity Framework Core) e API (os endpoints).",
      ], [
        "LionFinance is a personal finance API in ASP.NET Core, still in development. The goal is to record income and expenses, group them by category, track installment purchases and compare spending against the monthly budget.",
        "The project is organized in layers: Domain (entities such as transaction, category, installment and monthly budget, plus transaction types and payment methods), Application (rules and use cases), Infrastructure (persistence with Entity Framework Core) and API (the endpoints).",
      ]),
      detalhes: L([
        "Arquitetura em camadas com separação de regras de negócio",
        "Transações, categorias, parcelamentos e orçamento mensal",
        "Persistência com Entity Framework Core",
      ], [
        "Layered architecture with business rules kept separate",
        "Transactions, categories, installments and monthly budget",
        "Persistence with Entity Framework Core",
      ]),
      tags: ["C#", "ASP.NET Core", "EF Core", "Clean Architecture"],
      linguagens: { "C#": 100 },
      repo: "",            // repositório privado
      demo: "",
    },
  ],
};
