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
    cargo: "Desenvolvedor .NET",
    local: "Brasil",
    // Frases que se alternam no topo da página
    funcoes: [
      "sistemas de gestão",
      "aplicações desktop em C#",
      "APIs em .NET",
      "software para o comércio",
    ],
    frase: "Eu transformo o balcão de uma loja em software: pedido, estoque, orçamento em PDF e mensagem no WhatsApp.",
    sobre: [
      "Desenvolvo sistemas de gestão para pequenos comércios: oficinas, lojas de suprimentos de impressão e lojas de roupas. Cada sistema nasce de um anterior, que vira base para o próximo, com a infraestrutura comum reaproveitada e o que é específico de cada ramo separado.",
      "Gosto de software que resolve o dia a dia de quem está atrás do balcão: cadastro com busca de CEP, estoque com produtos compatíveis por modelo, orçamento em PDF, aviso pelo WhatsApp e instalador .msi que deixa tudo pronto no computador do cliente.",
      "Trabalho principalmente com C# e .NET (Windows Forms, .NET Framework 4.8 e .NET 8), Entity Framework, SQLite, PostgreSQL e MySQL, além de APIs em camadas (Domain, Application, Infrastructure).",
    ],
    stack: [
      "C#",
      ".NET 8 / .NET Framework 4.8",
      "Windows Forms",
      "Entity Framework",
      "ASP.NET Core Web API",
      "PostgreSQL · SQLite · MySQL",
      "Git & GitHub",
      "WiX / instaladores .msi",
    ],
  },

  contato: {
    email: "",          // ex.: "voce@email.com"
    github: "https://github.com/alex-m-silva",
    linkedin: "",       // ex.: "https://www.linkedin.com/in/seu-perfil"
    whatsapp: "",       // só números com DDI e DDD, ex.: "5531999999999"
  },

  // Certificados: viram "tags" de versão na página.
  certificados: [
    {
      titulo: "C# e Orientação a Objetos",
      emissor: "Instituição",
      data: "2024-03",
      skills: ["C#", "POO"],
      url: "",
      exemplo: true,
    },
    {
      titulo: "ASP.NET Core Web API",
      emissor: "Instituição",
      data: "2024-08",
      skills: ["ASP.NET", "REST", "Entity Framework"],
      url: "",
      exemplo: true,
    },
    {
      titulo: "Banco de Dados SQL",
      emissor: "Instituição",
      data: "2023-11",
      skills: ["SQL", "PostgreSQL", "Modelagem"],
      url: "",
      exemplo: true,
    },
    {
      titulo: "Git e GitHub",
      emissor: "Instituição",
      data: "2023-05",
      skills: ["Git", "GitHub"],
      url: "",
      exemplo: true,
    },
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
