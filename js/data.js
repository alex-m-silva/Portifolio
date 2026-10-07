/*
 * ============================================================
 *  DADOS DO PORTFÓLIO — edite só este arquivo.
 * ============================================================
 *  - Campos de link vazios ("") escondem o botão correspondente.
 *  - Itens com `exemplo: true` aparecem com o selo "exemplo":
 *    troque pelos seus dados reais e apague essa linha.
 */
window.PORTFOLIO = {
  perfil: {
    nome: "Alex Matias",
    usuario: "alex-matias",
    cargo: "Desenvolvedor de Software .NET",
    local: "Divinópolis, MG · Brasil",
    // Frases que se alternam no topo da página
    funcoes: [
      "sistemas de gestão",
      "aplicações desktop em C#",
      "APIs em .NET",
      "integrações entre sistemas",
      "software para o comércio",
    ],
    frase: "Eu transformo o balcão de uma loja em software: pedido, estoque, orçamento em PDF e mensagem no WhatsApp.",
    sobre: [
      "Sou desenvolvedor de software .NET com mais de 3 anos de experiência no desenvolvimento, modernização e integração de sistemas corporativos, com foco em regras de negócio, dados e performance.",
      "Hoje trabalho na CartSys, no ERP desktop usado por cartórios de Protesto, RTD/PJ, Registro de Imóveis e Notas. Antes, passei quase três anos na indústria, sustentando sistemas legados críticos e automatizando processos de fábrica em C#.",
      "Por conta própria, desenvolvo sistemas de gestão para pequenos comércios: oficinas, lojas de suprimentos de impressão e lojas de roupas. Cada sistema nasce de um anterior, que vira base para o próximo, com a infraestrutura comum reaproveitada e o que é específico de cada ramo separado.",
      "Trabalho principalmente com C# e .NET (Windows Forms, WPF, .NET Framework 4.8 e .NET 8), Entity Framework / EF Core, SQL Server, MySQL, PostgreSQL e SQLite, além de APIs em camadas (Domain, Application, Infrastructure).",
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
      "APIs REST · JWT",
      "Docker",
      "Git & GitHub",
      "WiX / instaladores .msi",
    ],
  },

  contato: {
    email: "alexmatias.am162@gmail.com",
    github: "https://github.com/alex-m-silva",
    linkedin: "https://www.linkedin.com/in/alex-matias-silva",
    instagram: "https://www.instagram.com/alex_matias._/",
    whatsapp: "",       // só números com DDI e DDD, ex.: "5531999999999"
  },

  // Experiência: cada item vira um "commit" no git log. `fim` vazio = emprego atual.
  experiencia: [
    {
      cargo: "Desenvolvedor de Software",
      empresa: "CartSys Software",
      inicio: "2026-03",
      fim: "",
      local: "Divinópolis, MG",
      resumo: "Desenvolvimento e evolução do Cartsys, ERP desktop para os setores registral e notarial, usado por cartórios de Protesto, RTD/PJ, Registro de Imóveis e Notas, com módulos Financeiro e NFS-e. Uma solução com mais de 75 projetos em C#.",
      destaques: [
        "Integração bancária via API REST (Unicred): emissão, consulta, baixa, pagamento, alteração de vencimento e impressão de boletos em lote, com autenticação por token e tratamento de falhas HTTP",
        "Redução de 25% no cálculo de custas de 1.608 títulos (de 7min20s para 5min30s), eliminando consultas N+1 e otimizando o Entity Framework",
        "Banco em nuvem via VPN: rotinas críticas em lote com carga em blocos, cache de dados de referência, auditoria agrupada e inserts multi-row, reduzindo as idas ao banco sem alterar resultados",
        "Livro eletrônico com assinatura digital: PDF/A, hash SHA-256 e assinatura CMS com certificado digital",
        "NFS-e: sincronização com provedores municipais e nacional, sem reemissão e sem ajuste manual no banco",
        "Relatório unificado do CNJ integrando SQL Server e Firebird",
        "Modernização visual para DevExpress WXI em centenas de formulários",
      ],
      stack: ["C#", ".NET Framework", "WinForms", "DevExpress", "Entity Framework", "LINQ", "SQL Server", "Firebird", "APIs REST", "SVN"],
    },
    {
      cargo: "Desenvolvedor de Software",
      empresa: "Condumig",
      inicio: "2023-05",
      fim: "2026-03",
      local: "Divinópolis, MG",
      resumo: "Sustentação de sistemas legados críticos e desenvolvimento de soluções modernas em C#, com foco em automação de processos industriais, confiabilidade operacional e qualidade de dados.",
      destaques: [
        "Tempo de resposta 75% menor (de 40s para 10s) em sistema legado VB6 do módulo de engenharia, com normalização de banco, criação de índices e reescrita de queries no MySQL",
        "Automação do fluxo de impressão e controle industrial em .NET 4.8, WinForms, Entity Framework e MySQL, eliminando processos manuais",
        "Mais de 10% de redução no desperdício de materiais, com ferramentas de BI por máquina integrando MySQL e Progress para o QlikView e o Grafeno",
        "Cálculo do Ticket Alimentação em .NET 8: processa relatórios do iPonto via EPPlus e aplica as regras de assiduidade (faixas de 80% a 100%), sem conferência manual",
        "\"Fiscal digital\" de pesagem: monitora em tempo real as oscilações de peso das bobinas e avisa os gestores pelo Telegram em caso de suspeita de fraude",
        "Rotinas de integração em .NET 8, EF Core e MySQL para extrair dados do Progress (Datasul), alimentando relatórios financeiros e regras de cobrança",
        "Estabilidade e evolução dos sistemas legados de Fábrica, Estoque e Administrativo em VB6",
      ],
      stack: ["C#", ".NET Framework 4.8", ".NET 8", "EF Core", "MySQL", "Progress (Datasul)", "WinForms", "Docker", "Arduino", "Git"],
    },
    {
      cargo: "Freelancer",
      empresa: "Fiverr",
      inicio: "2023-11",
      fim: "2023-12",
      local: "Remoto",
      resumo: "Aplicação em C# e WinForms que recebia textos e os formatava automaticamente de acordo com as necessidades específicas do cliente.",
      destaques: [],
      stack: ["C#", "WinForms"],
    },
    {
      cargo: "Desenvolvedor de Software",
      empresa: "Petrarca Software",
      inicio: "2022-07",
      fim: "2023-02",
      local: "Divinópolis, MG",
      resumo: "Modernização do sistema de gestão da empresa, com novos módulos em C# e manutenção do legado em VB.NET.",
      destaques: [
        "Novos módulos em C# .NET com WPF (MVVM), Entity Framework e SQL Server, com separação de responsabilidades",
        "Conversão de bibliotecas críticas de VB.NET para C#, melhorando performance e legibilidade",
        "Reimplementação do módulo de relatórios gerenciais com Crystal Reports",
      ],
      stack: ["C#", ".NET Framework 4.5.2", "WPF", "MVVM", "SQL Server", "VB.NET", "Crystal Reports", "Bitbucket"],
    },
  ],

  formacao: [
    {
      curso: "Ciência da Computação · Bacharelado",
      instituicao: "Faculdade Pitágoras",
      inicio: "2023-02",
      fim: "2026-06",
    },
  ],

  // Certificados: viram "tags" de versão na página.
  // `data` é o mês de conclusão ("AAAA-MM"); `categoria` vira o filtro no topo da seção.
  certificados: [
    // --- Arquitetura, backend .NET, segurança e banco de dados ---
    { titulo: "Segurança em APIs ASP.NET com JWT e Bearer Authentication", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: [".NET", "JWT", "Bearer Authentication", "Segurança em APIs"], url: "https://balta.io/certificados/7f11af9b-93a2-4797-86f7-43aa9c46a31d" },
    { titulo: "Fundamentos dos Microsserviços", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: ["Microsserviços", ".NET"], url: "https://balta.io/certificados/6ff8871e-f4ae-4f68-b037-29e6763eeb7a" },
    { titulo: "Fundamentos do Event-Driven Architecture", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: ["Event-Driven Architecture", ".NET"], url: "https://balta.io/certificados/3df2dc51-7a7f-4ac0-9dc5-9982e298f48a" },
    { titulo: "Aplicações Mult-Tenant com Entity Framework Core", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: [".NET", "Mult-Tenant", "Entity Framework Core"], url: "https://balta.io/certificados/1ee931cf-7f94-4ddd-af91-dab9855cfb7c" },
    { titulo: "Dominando Injeção de Dependência", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: [".NET", "Injeção de dependência"], url: "https://balta.io/certificados/f416e374-00a8-4b1d-ba49-2b86840241fd" },
    { titulo: "Modelando Domínios Ricos", emissor: "balta.io", data: "2025-05", categoria: "arquitetura & backend", skills: ["Domínios Ricos", "DDD"], url: "https://balta.io/certificados/a5cd3727-de4d-4ec8-91dc-03f384e1ff1b" },
    { titulo: "Refatorando para testes de unidade", emissor: "balta.io", data: "2025-05", categoria: "arquitetura & backend", skills: [".NET", "Testes de unidade"], url: "https://balta.io/certificados/e045e9cb-2ad4-4e40-ad7f-de70cbf51632" },
    { titulo: "Acesso à dados com .NET, C#, Dapper e SQL Server", emissor: "balta.io", data: "2024-09", categoria: "arquitetura & backend", skills: [".NET", "C#", "Dapper", "SQL Server", "Docker"], url: "https://balta.io/certificados/9e64513d-425f-485d-b153-bb1e73bbd9be" },
    { titulo: "Fundamentos do Entity Framework", emissor: "balta.io", data: "2024-09", categoria: "arquitetura & backend", skills: [".NET", "Entity Framework"], url: "https://balta.io/certificados/9a8aac3f-417f-42e0-9a83-c964f143744e" },
    { titulo: "Fundamentos do SQL Server", emissor: "balta.io", data: "2024-06", categoria: "arquitetura & backend", skills: ["SQL Server", "Azure"], url: "https://balta.io/certificados/4a921494-ca1f-4bb8-ae05-441a9b114592" },

    // --- Frameworks web, cloud e DevOps ---
    { titulo: "Fundamentos do ASP.NET 6", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "ASP.NET MVC"], url: "https://balta.io/certificados/303abb8b-e0bf-48fe-956e-c8ae3439fc81" },
    { titulo: "Fundamentos do Azure, Git, GitHub e DevOps", emissor: "balta.io", data: "2025-04", categoria: "web, cloud & devops", skills: [".NET", "Git", "GitHub", "Azure", "DevOps"], url: "https://balta.io/certificados/6090ae49-76bd-4bda-97b4-656b4d138988" },
    { titulo: "Fundamentos do Blazor com .NET 8", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "Blazor"], url: "https://balta.io/certificados/46fda571-fcec-49d5-803b-8eb355f36238" },
    { titulo: "Fundamentos do Blazor Web Assembly", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "Blazor"], url: "https://balta.io/certificados/4b7c9ba8-c8a6-43db-818a-4e98a6ad8e5b" },
    { titulo: "Fundamentos do Blazor Server", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "Blazor"], url: "https://balta.io/certificados/01dbef73-acdf-40db-81a5-4b2b2686ea77" },
    { titulo: "Uma visão geral sobre o ASP.NET Razor Pages", emissor: "balta.io", data: "2023-04", categoria: "web, cloud & devops", skills: [".NET", "ASP.NET MVC", "Razor Pages"], url: "https://balta.io/certificados/7ae0857f-c78b-48dc-93e7-9fb108d696f1" },

    // --- Fundamentos e programação orientada a objetos ---
    { titulo: "Aplicando Orientação a Objetos em Projetos Reais com C# 11 e .NET 7", emissor: "balta.io", data: "2025-06", categoria: "fundamentos & POO", skills: ["POO", ".NET", "C# 11"], url: "https://balta.io/certificados/00af3965-8a47-4b63-a93e-5698a50aae4a" },
    { titulo: "Fundamentos da Orientação a Objetos", emissor: "balta.io", data: "2025-05", categoria: "fundamentos & POO", skills: ["POO"], url: "https://balta.io/certificados/71fcfad4-5adb-44a9-b5f8-b97de4f88050" },
    { titulo: "C# COMPLETO Programação Orientada a Objetos", emissor: "Udemy", data: "", categoria: "fundamentos & POO", skills: ["C#", "POO", "ASP.NET MVC", "MySQL"], url: "https://udemy-certificate.s3.amazonaws.com/image/UC-0814dee0-00fa-42dc-8fe6-0f4d7115650d.jpg" },
    { titulo: "Curso Programador", emissor: "Curso presencial", data: "", categoria: "fundamentos & POO", skills: ["VBA", "Delphi"], url: "" },

    // --- Complementar: interface, web design e relatórios ---
    { titulo: "Sites Responsivos", emissor: "balta.io", data: "2025-06", categoria: "interface & relatórios", skills: ["Sites Responsivos"], url: "https://balta.io/certificados/bda41201-b0f3-46f2-837f-24daeac71462" },
    { titulo: "SAP Crystal Reports - Do Básico ao Avançado", emissor: "Udemy", data: "", categoria: "interface & relatórios", skills: ["Crystal Reports"], url: "https://www.udemy.com/certificate/UC-5cae22f4-44fb-4286-8c5c-f4849b796327/" },
  ],

  // Projetos: `linguagens` em porcentagem (soma 100) desenha a barra de cores.
  projetos: [
    {
      nome: "GestaoComercial",
      resumo: "Sistema desktop para lojas que vendem produtos e prestam serviço nos equipamentos dos clientes. Primeiro uso: loja de toners, impressoras e papelaria.",
      detalhes: [
        "Pedido com fluxo orçamento → aprovado → finalizado, e venda rápida de balcão",
        "Produtos com modelos compatíveis: o pedido de uma impressora já filtra os toners que servem nela",
        "Orçamento em PDF, envio pelo WhatsApp e relatório de vendas por departamento",
        "Roda em SQLite (sem servidor) ou PostgreSQL, com scripts de migração versionados",
      ],
      tags: ["C#", ".NET Framework 4.8", "WinForms", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 94, "SQL": 6 },
      repo: "https://github.com/alex-m-silva/GestaoComercial",
      demo: "",
      destaque: true,
    },
    {
      nome: "GestaoModa",
      resumo: "Gestão para loja de roupas, reconstruída sobre a base do GestaoComercial e migrada para .NET 8, com as telas montadas em código.",
      detalhes: [
        "Reaproveita a infraestrutura comum da família de sistemas",
        "Migração de um sistema antigo em MySQL para SQLite/PostgreSQL",
        "Projeto de testes automatizados",
      ],
      tags: ["C#", ".NET 8", "WinForms", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 96, "SQL": 4 },
      repo: "",            // repositório privado
      demo: "",
      destaque: true,
    },
    {
      nome: "ProjetoOficina",
      resumo: "O sistema que deu origem à família: ordens de serviço, clientes e veículos para oficinas mecânicas.",
      detalhes: [
        "Cadastro de clientes, veículos, peças e serviços",
        "Ordem de serviço do orçamento à entrega",
        "Base de onde saíram o GestaoComercial e o GestaoModa",
      ],
      tags: ["C#", "WinForms", "Entity Framework"],
      linguagens: { "C#": 100 },
      repo: "https://github.com/alex-m-silva/ProjetoOficina",
      demo: "",
    },
    {
      nome: "CriadorInstalador",
      resumo: "Programa com tela que gera o instalador .msi de um sistema Windows Forms, com telas em português e pasta de dados compartilhada.",
      detalhes: [
        "Escolha da pasta de instalação e atalhos no menu Iniciar e na área de trabalho",
        "Pode exigir o .NET Framework 4.8",
        "Cria pasta de dados em %ProgramData% com permissão para todos os usuários",
        "Atualiza a versão anterior mantendo os arquivos alterados no cliente",
      ],
      tags: ["C#", "WiX", "MSI", "WinForms"],
      linguagens: { "C#": 88, "WiX": 12 },
      repo: "https://github.com/alex-m-silva/CriadorInstalador",
      demo: "",
    },
    {
      nome: "LionFinance",
      resumo: "API de finanças em ASP.NET Core organizada em camadas: Domain, Application, Infrastructure e API.",
      detalhes: [
        "Arquitetura em camadas com separação de regras de negócio",
        "Transações, categorias, parcelamentos e orçamento mensal",
        "Persistência com Entity Framework",
      ],
      tags: ["C#", "ASP.NET Core", "Clean Architecture"],
      linguagens: { "C#": 100 },
      repo: "https://github.com/alex-m-silva/LionFinance",
      demo: "",
    },
  ],
};
