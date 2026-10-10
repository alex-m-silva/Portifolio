/*
 * ============================================================
 *  DADOS DO PORTFÓLIO — edite só este arquivo.
 * ============================================================
 *  - Campos de link vazios ("") escondem o botão correspondente.
 *  - Itens com `exemplo: true` aparecem com o selo "exemplo":
 *    troque pelos seus dados reais e apague essa linha.
 */
function revelar(codigo) {
  try { return atob(codigo).split("").reverse().join(""); } catch (e) { return ""; }
}

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
    whatsapp: revelar("ODE5MTE0ODg5NzM1NQ=="), // só números com DDI e DDD
    whatsappMensagem: "Olá, Alex! Vi seu portfólio e gostaria de conversar sobre um projeto.", // texto que já vem escrito no WhatsApp
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
    { titulo: "Introdução ao ASP.NET Core Identity", emissor: "balta.io", data: "2025-10", categoria: "arquitetura & backend", skills: [".NET", "ASP.NET Core Identity", "Autenticação"], url: "https://balta.io/certificates/4c903784-850c-4948-8809-459e1a35b9fd" },
    { titulo: "Segurança em APIs ASP.NET com JWT e Bearer Authentication", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: [".NET", "JWT", "Bearer Authentication", "Segurança em APIs"], url: "https://balta.io/certificates/e2fe40e9-1c73-4d35-afa7-29199ea870ff" },
    { titulo: "Fundamentos dos Microsserviços", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: ["Microsserviços", ".NET"], url: "https://balta.io/certificates/314a383b-d260-417f-9874-420fceb9764e" },
    { titulo: "Fundamentos do Event-Driven Architecture", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: ["Event-Driven Architecture", ".NET"], url: "https://balta.io/certificates/b6614f6d-c6f2-46b6-ae6e-b6abd488a778" },
    { titulo: "Aplicações Mult-Tenant com Entity Framework Core", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: [".NET", "Mult-Tenant", "Entity Framework Core"], url: "https://balta.io/certificates/b5a2db85-205c-4c06-8502-ad607879f08e" },
    { titulo: "Dominando Injeção de Dependência", emissor: "balta.io", data: "2025-06", categoria: "arquitetura & backend", skills: [".NET", "Injeção de dependência"], url: "https://balta.io/certificates/9f73b59a-63cb-49b4-b4c0-ab2aea57db94" },
    { titulo: "Modelando Domínios Ricos", emissor: "balta.io", data: "2025-05", categoria: "arquitetura & backend", skills: ["Domínios Ricos", "DDD"], url: "https://balta.io/certificates/09a27615-177a-4102-b9a4-b4ce390063c2" },
    { titulo: "Refatorando para testes de unidade", emissor: "balta.io", data: "2025-05", categoria: "arquitetura & backend", skills: [".NET", "Testes de unidade"], url: "https://balta.io/certificates/15289f5a-3dcf-454d-908b-c5c0cb254b71" },
    { titulo: "Acesso à dados com .NET, C#, Dapper e SQL Server", emissor: "balta.io", data: "2024-09", categoria: "arquitetura & backend", skills: [".NET", "C#", "Dapper", "SQL Server", "Docker"], url: "https://balta.io/certificates/c7691c16-4763-4e6c-be09-a322e5c1ddd0" },
    { titulo: "Fundamentos do Entity Framework", emissor: "balta.io", data: "2024-09", categoria: "arquitetura & backend", skills: [".NET", "Entity Framework"], url: "https://balta.io/certificates/f8dcaad1-bb61-44aa-b796-11933b5759c7" },
    { titulo: "Fundamentos do SQL Server", emissor: "balta.io", data: "2024-06", categoria: "arquitetura & backend", skills: ["SQL Server", "Azure"], url: "https://balta.io/certificates/90437c20-9b23-48b7-990b-401fe26877fc" },

    // --- Frameworks web, cloud e DevOps ---
    { titulo: "Fundamentos do Azure, Git, GitHub e DevOps", emissor: "balta.io", data: "2025-04", categoria: "web, cloud & devops", skills: [".NET", "Git", "GitHub", "Azure", "DevOps"], url: "https://balta.io/certificates/f8f92a90-3f69-4d54-b76b-e7c912e3e3de" },
    { titulo: "Progressive Web Apps com Blazor Web Assembly", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "Blazor", "PWA"], url: "https://balta.io/certificates/3ed8617d-a7db-46a8-a89e-68cd713a2817" },
    { titulo: "Fundamentos do Blazor com .NET 8", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "Blazor"], url: "https://balta.io/certificates/0004c940-1ce2-45bb-980e-96bc7431230f" },
    { titulo: "Fundamentos do Blazor Web Assembly", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "Blazor"], url: "https://balta.io/certificates/d9d602b4-6a09-4945-9749-617031b3d220" },
    { titulo: "Fundamentos do Blazor Server", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "Blazor"], url: "https://balta.io/certificates/7ed45d2e-a4f4-4c86-a04a-6ab190627e46" },
    { titulo: "Fundamentos do ASP.NET 6", emissor: "balta.io", data: "2025-03", categoria: "web, cloud & devops", skills: [".NET", "ASP.NET MVC"], url: "https://balta.io/certificates/6b095b3b-ab62-4e60-9689-cadab4a7b75d" },
    { titulo: "Uma visão geral sobre o ASP.NET Razor Pages", emissor: "balta.io", data: "2023-04", categoria: "web, cloud & devops", skills: [".NET", "ASP.NET MVC", "Razor Pages"], url: "https://balta.io/certificates/7b08c6e0-0254-4293-bd7a-67a7646b7beb" },

    // --- Fundamentos e programação orientada a objetos ---
    { titulo: "Fundamentos do JavaScript", emissor: "balta.io", data: "2025-10", categoria: "fundamentos & POO", skills: ["JavaScript"], url: "https://balta.io/certificates/52db820b-9d4d-4b9a-a18f-141d8c53d296" },
    { titulo: ".NET Developer Fundamentals (carreira)", emissor: "balta.io", data: "2025-07", categoria: "fundamentos & POO", skills: [".NET", "C#"], url: "https://balta.io/certificates/19b388a1-37b2-47b9-9d73-98406e7643be" },
    { titulo: "Fundamentos do C#", emissor: "balta.io", data: "2025-07", categoria: "fundamentos & POO", skills: ["C#", ".NET"], url: "https://balta.io/certificates/3ae555bc-e0ae-46ac-b1c8-ceded65120d6" },
    { titulo: "Aplicando Orientação a Objetos em Projetos Reais com C# 11 e .NET 7", emissor: "balta.io", data: "2025-06", categoria: "fundamentos & POO", skills: ["POO", ".NET", "C# 11"], url: "https://balta.io/certificates/b3cf963c-b806-4bac-8b64-3311dbe953e3" },
    { titulo: "Fundamentos da Orientação a Objetos", emissor: "balta.io", data: "2025-05", categoria: "fundamentos & POO", skills: ["POO"], url: "https://balta.io/certificates/8e5be4ce-1c48-4983-80e0-80f9123dbce7" },
    { titulo: "C# COMPLETO Programação Orientada a Objetos", emissor: "Udemy", data: "", categoria: "fundamentos & POO", skills: ["C#", "POO", "ASP.NET MVC", "MySQL"], url: "https://udemy-certificate.s3.amazonaws.com/image/UC-0814dee0-00fa-42dc-8fe6-0f4d7115650d.jpg" },
    { titulo: "Curso Programador", emissor: "Curso presencial", data: "", categoria: "fundamentos & POO", skills: ["VBA", "Delphi"], url: "" },

    // --- Complementar: interface, web design e relatórios ---
    { titulo: "Sites Responsivos", emissor: "balta.io", data: "2025-06", categoria: "interface & relatórios", skills: ["Sites Responsivos"], url: "https://balta.io/certificates/f5b45281-23e0-47a9-8799-417488fe9e77" },
    { titulo: "SAP Crystal Reports - Do Básico ao Avançado", emissor: "Udemy", data: "", categoria: "interface & relatórios", skills: ["Crystal Reports"], url: "https://www.udemy.com/certificate/UC-5cae22f4-44fb-4286-8c5c-f4849b796327/" },
  ],

  // Projetos. Cada um vira um card na página inicial e uma página própria em /projetos/<slug>.
  //   slug        endereço da página (/projetos/<slug>); sem ele, é gerado a partir do nome
  //   seo         título e descrição da página do projeto no Google (até ~60 e ~155 caracteres)
  //   sobre       texto da página do projeto (um parágrafo por item)
  //   linguagens  porcentagem (soma 100), desenha a barra de cores
  //   repo        vazio = repositório privado ("código disponível sob consulta")
  projetos: [
    {
      nome: "GestaoComercial",
      slug: "gestao-comercial",
      resumo: "Sistema desktop para lojas que vendem produtos e prestam serviço nos equipamentos dos clientes. Primeiro uso: loja de toners, impressoras e papelaria.",
      seo: {
        titulo: "GestaoComercial: sistema para loja de toner e impressoras",
        descricao: "Sistema de gestão em C# para loja de toner, impressoras e papelaria: orçamentos, pedidos, estoque com produtos compatíveis, PDF e WhatsApp.",
        categoria: "BusinessApplication", // tipo de aplicação para o Google (schema.org)
        sistema: "Windows",
      },
      sobre: [
        "O GestaoComercial é um sistema desktop em Windows Forms (.NET Framework 4.8) para lojas que vendem produtos e também prestam serviço nos equipamentos dos clientes. Nasceu da estrutura do sistema de oficina, com nomes genéricos para servir a outros ramos, e o primeiro uso é uma loja de toners e impressoras com papelaria.",
        "O fluxo acompanha o dia a dia do balcão: o cliente chega com a impressora, sai um orçamento, ele aprova pelo WhatsApp, a loja faz o serviço, finaliza o pedido e o estoque se ajusta sozinho. Para vendas rápidas, a venda de balcão já nasce finalizada.",
        "O ponto forte é a ligação entre equipamento e suprimento. Cada produto guarda os modelos em que serve (por exemplo, \"HP P1102; HP M1132\"), e a comparação ignora maiúsculas, espaços e traços e aceita o modelo com ou sem a marca. Assim, no pedido de uma impressora a lista de produtos já abre filtrada pelos toners compatíveis, e o cadastro do cliente mostra, para cada equipamento, os suprimentos que servem e o estoque deles.",
        "Os produtos são separados por departamento (impressão e papelaria), o que alimenta os filtros do catálogo e o relatório de vendas por departamento. O sistema roda em SQLite, sem servidor, ou em PostgreSQL para vários computadores, com scripts de migração versionados e instalador .msi gerado pelo CriadorInstalador.",
      ],
      detalhes: [
        "Pedido com fluxo orçamento → aprovado → finalizado, e venda rápida de balcão",
        "Produtos com modelos compatíveis: o pedido de uma impressora já filtra os toners que servem nela",
        "Orçamento em PDF com os dados da loja e envio pelo WhatsApp com a mensagem pronta",
        "Relatórios: orçamentos parados, vendas por departamento, o que repor, serviços mais pedidos e clientes que mais voltam, com exportação para Excel",
        "Usuários com permissões por área (vender, orçar, aprovar, finalizar, ver relatórios)",
        "Roda em SQLite (sem servidor) ou PostgreSQL, com scripts de migração versionados",
      ],
      tags: ["C#", ".NET Framework 4.8", "WinForms", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 94, "SQL": 6 },
      repo: "",            // repositório privado
      demo: "",
      destaque: true,
      apresentacao: {
        pasta: "assets/projetos/gestao-comercial/",
        video: "apresentacao.mp4",
        capa: "capa-video.webp",
        intro: "O cliente chega com a impressora, sai um orçamento, ele aprova pelo WhatsApp, a loja faz o serviço, finaliza e o estoque se ajusta sozinho. Bora dar uma volta pelas telas:",
        telas: [
          { arquivo: "01-pedidos", titulo: "Pedidos e orçamentos", texto: "A tela que fica aberta o dia todo. Vermelho é orçamento esperando resposta, verde é aprovado, azul é finalizado." },
          { arquivo: "02-clientes", titulo: "Clientes", texto: "CPF ou CNPJ e endereço pela busca de CEP. Os equipamentos do cliente já mostram os toners que servem neles." },
          { arquivo: "03-servicos", titulo: "Serviços", texto: "O cardápio da loja, com preço e tempo estimado. Entra no orçamento com um clique." },
          { arquivo: "04-funcionarios", titulo: "Funcionários", texto: "Dados pessoais e de contrato. O funcionário vira o responsável pelo serviço e pode ter login próprio." },
          { arquivo: "05-produtos", titulo: "Produtos e estoque", texto: "Estoque mínimo, preço de compra e venda e margem calculada na hora. Cada toner sabe em quais impressoras serve." },
          { arquivo: "06-relatorios", titulo: "Relatórios", texto: "Orçamentos parados, vendas por departamento, o que repor e quem mais volta. Exporta para o Excel e imprime." },
          { arquivo: "07-usuarios", titulo: "Usuários e permissões", texto: "Cada pessoa com o seu login, e o administrador marca o que ela pode fazer." },
          { arquivo: "08-orcamento", titulo: "Montando um orçamento", texto: "Cliente → equipamento → serviços → detalhes → produtos, já filtrados pelos compatíveis. O total sai pronto, com os descontos." },
          { arquivo: "09-aprovar", titulo: "Aprovar, finalizar e enviar", texto: "Aprovou, fica verde. Finalizou, o estoque baixa sozinho. O orçamento vai pelo WhatsApp, em PDF ou dos dois jeitos." },
        ],
      },
    },
    {
      nome: "GestaoModa",
      slug: "gestao-moda",
      resumo: "Vendas e estoque para lojas de roupas: PDV pelo teclado, grade de tamanhos e cores, crediário, trocas, caixa e 22 relatórios. Reconstruído em .NET 8 sobre a base do GestaoComercial.",
      seo: {
        titulo: "GestaoModa: sistema de vendas e estoque para loja de roupas",
        descricao: "Sistema para loja de roupas em C# e .NET 8: PDV, grade de tamanhos e cores com código de barras, crediário, trocas e vale-troca, caixa e relatórios.",
        categoria: "BusinessApplication", // tipo de aplicação para o Google (schema.org)
        sistema: "Windows",
      },
      sobre: [
        "O GestaoModa é um sistema desktop de vendas e estoque para lojas de roupas e moda: boutiques, moda feminina, masculina, infantil, moda praia, fitness e acessórios. Ele nasceu do NewBronx, um sistema em MySQL de uma loja de roupas, e foi reconstruído em .NET 8 sobre a mesma base do GestaoComercial.",
        "O PDV foi pensado para ser usado pelo teclado (F2 a F9): leitor de código de barras, busca por nome, cor e tamanho, \"3*código\" para várias peças, desconto por peça ou geral e várias formas de pagamento na mesma venda, incluindo Pix, cartão parcelado, crediário e vale-troca.",
        "Cada peça tem a sua grade de tamanhos × cores, e cada combinação tem código de barras (EAN-13 gerado pelo sistema ou o do fornecedor) e estoque próprio. Entrada de mercadoria pelo leitor, inventário com motivo, histórico de cada movimento e etiquetas com preço \"de/por\" completam o controle de estoque.",
        "No financeiro, o sistema cuida do crediário no carnê (com limite por cliente, multa e juros de atraso), de trocas e vales-troca, da abertura e do fechamento do caixa com conferência e das contas a pagar. São 22 relatórios, entre eles curva ABC, produtos parados, clientes sumidas e um DRE simples, além de avisos do dia e mensagens prontas pelo WhatsApp.",
        "As telas são montadas em código, sem o designer do Visual Studio, e um projeto de testes percorre o sistema de ponta a ponta num banco temporário: cadastro, vendas, crediário, trocas, caixa e relatórios.",
      ],
      detalhes: [
        "PDV pelo teclado com leitor de código de barras e várias formas de pagamento na mesma venda",
        "Grade de tamanhos × cores com código de barras EAN-13 e estoque por variação",
        "Crediário no carnê com limite por cliente, multa e juros de atraso",
        "Trocas, vale-troca com validade, caixa com conferência e contas a pagar",
        "22 relatórios (curva ABC, DRE simples, produtos parados) com exportação para Excel",
        "Testes de ponta a ponta das regras de negócio num banco temporário",
      ],
      tags: ["C#", ".NET 8", "WinForms", "EF Core", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 96, "SQL": 4 },
      repo: "",            // repositório privado
      demo: "",
      destaque: true,
    },
    {
      nome: "pdf-para-epub",
      slug: "pdf-para-epub",
      resumo: "Conversor online de PDF para EPUB, para ler no Kindle, Kobo e apps de leitura. Front estático no GitHub Pages e API em Python que roda o Calibre num container Docker.",
      seo: {
        titulo: "pdf-para-epub: conversor online de PDF para EPUB",
        descricao: "Conversor de PDF para EPUB com front no GitHub Pages e API em Python (FastAPI) rodando o Calibre em Docker, com rate limit e arquivos temporários.",
        categoria: "UtilitiesApplication", // tipo de aplicação para o Google (schema.org)
        sistema: "Web",
      },
      sobre: [
        "O pdf-para-epub é um conversor online de PDF para EPUB, o formato que se adapta à tela do Kindle, do Kobo e dos aplicativos de leitura. A pessoa escolhe um ou mais PDFs, converte e baixa o EPUB, sem login.",
        "A conversão é feita pelo Calibre (ebook-convert), que precisa de um servidor com os binários do sistema. Por isso o projeto tem duas partes: as páginas, em HTML, CSS e JavaScript puros, publicadas no GitHub Pages; e uma API em Python com FastAPI, empacotada em Docker com o Calibre instalado e publicada no Render.",
        "A API foi feita para aguentar uso público: limite de tamanho verificado no cabeçalho e durante o recebimento, rate limit por IP, limite de conversões simultâneas, timeout e uma segunda tentativa sem as opções heurísticas quando a primeira falha. Os arquivos ficam em pastas temporárias com nome aleatório e são apagados depois da resposta e numa limpeza periódica.",
        "Como o servidor gratuito dorme quando fica sem uso, a página já manda um sinal para acordá-lo assim que abre e mostra o status (conectando, acordando, online). O site também traz guias sobre leitura digital, como enviar EPUB para o Kindle e por que alguns PDFs não convertem bem.",
      ],
      detalhes: [
        "API FastAPI que recebe o PDF, roda o ebook-convert do Calibre e devolve o EPUB",
        "Rate limit por IP, limite de conversões simultâneas, timeout e validação de tamanho do upload",
        "Arquivos temporários com nome aleatório, apagados após a resposta e numa limpeza periódica",
        "Front em HTML, CSS e JavaScript com fila de arquivos, arrastar e soltar e status do servidor",
        "Publicação separada: páginas no GitHub Pages e API em Docker no Render",
      ],
      tags: ["Python", "FastAPI", "Docker", "Calibre", "JavaScript"],
      linguagens: { "HTML": 40, "CSS": 25, "Python": 20, "JavaScript": 15 },
      repo: "https://github.com/alex-m-silva/pdf-para-epub",
      demo: "https://alex-m-silva.github.io/pdf-para-epub/",
      destaque: true,
    },
    {
      nome: "ProjetoOficina",
      slug: "projeto-oficina",
      resumo: "O sistema que deu origem à família: ordens de serviço, clientes e veículos para oficinas mecânicas.",
      seo: {
        titulo: "ProjetoOficina: sistema para oficina mecânica em C#",
        descricao: "Sistema para oficina mecânica em C# e Windows Forms: ordens de serviço, clientes, veículos, peças, serviços, funcionários, relatórios e usuários.",
        categoria: "BusinessApplication", // tipo de aplicação para o Google (schema.org)
        sistema: "Windows",
      },
      sobre: [
        "O ProjetoOficina é um sistema desktop em Windows Forms para oficinas mecânicas, e foi o primeiro da família. Ele organiza o atendimento do orçamento à entrega: o cliente, o veículo, as peças e os serviços entram na ordem de serviço, que acompanha o trabalho até a conclusão.",
        "Tem cadastros de clientes, veículos, produtos (peças), serviços e funcionários, relatórios com impressão, e controle de acesso com login, usuários e troca de senha. Os dados ficam no Entity Framework Core, com SQLite ou PostgreSQL.",
        "Foi da estrutura dele que saiu o GestaoComercial, com os nomes generalizados (veículo virou equipamento) para atender outros ramos, e depois o GestaoModa. A infraestrutura comum (telas base, máscaras, impressão, banco) passou de um sistema para o outro.",
      ],
      detalhes: [
        "Ordem de serviço do orçamento à entrega, com peças e serviços",
        "Cadastro de clientes, veículos, peças, serviços e funcionários",
        "Relatórios com impressão",
        "Login, usuários e troca de senha",
        "Base de onde saíram o GestaoComercial e o GestaoModa",
      ],
      tags: ["C#", ".NET Framework 4.8", "WinForms", "EF Core", "SQLite", "PostgreSQL"],
      linguagens: { "C#": 100 },
      repo: "",            // repositório privado
      demo: "",
    },
    {
      nome: "CriadorInstalador",
      slug: "criador-instalador",
      resumo: "Programa com tela que gera o instalador .msi de um sistema Windows Forms, com telas em português e pasta de dados compartilhada.",
      seo: {
        titulo: "CriadorInstalador: gerador de instalador .msi para WinForms",
        descricao: "Ferramenta em C# que gera o instalador .msi de sistemas Windows Forms com WiX: telas em português, atalhos, pasta de dados e atualização de versão.",
        categoria: "DeveloperApplication", // tipo de aplicação para o Google (schema.org)
        sistema: "Windows",
      },
      sobre: [
        "O CriadorInstalador é um programa com tela que gera o instalador .msi de um sistema Windows Forms. Basta apontar a pasta do programa (ou só o projeto, que ele compila em Release antes) e clicar em \"Gerar instalador\".",
        "O .msi gerado tem as telas em português (boas-vindas, escolha da pasta de instalação e instalação), cria atalhos no menu Iniciar e na área de trabalho, pode exigir o .NET Framework 4.8 e aparece em \"Adicionar/remover programas\". Instalar por cima atualiza a versão anterior mantendo os arquivos alterados no cliente, como o .exe.config.",
        "Para os sistemas de gestão, ele cria uma pasta de dados em %ProgramData% com permissão de gravação para todos os usuários (onde fica o banco SQLite) e pode mostrar uma tela de configuração da empresa: nome da loja e escolha entre SQLite e PostgreSQL, gravados só na primeira instalação.",
        "Por dentro, o programa escreve um projeto WiX Toolset 5 (Package.wxs e .wixproj) e roda o dotnet build nele. As opções de cada sistema ficam num arquivo .instalador (XML) com caminhos relativos, o que permite gerar o instalador de novo a cada versão sem refazer a configuração.",
      ],
      detalhes: [
        "Telas do instalador em português, com escolha da pasta de instalação e atalhos",
        "Pode exigir o .NET Framework 4.8",
        "Cria pasta de dados em %ProgramData% com permissão para todos os usuários",
        "Tela de configuração da empresa: nome da loja e banco SQLite ou PostgreSQL",
        "Atualiza a versão anterior mantendo os arquivos alterados no cliente",
        "Gera o projeto WiX 5 e compila com dotnet build",
      ],
      tags: ["C#", "WiX", "MSI", "WinForms"],
      linguagens: { "C#": 88, "WiX": 12 },
      repo: "",            // repositório privado
      demo: "",
    },
    {
      nome: "LionFinance",
      slug: "lion-finance",
      resumo: "API de finanças pessoais em ASP.NET Core organizada em camadas: Domain, Application, Infrastructure e API. Em desenvolvimento.",
      seo: {
        titulo: "LionFinance: API de finanças pessoais em ASP.NET Core",
        descricao: "API de finanças pessoais em ASP.NET Core e EF Core com arquitetura em camadas: transações, categorias, parcelamentos e orçamento mensal.",
        categoria: "FinanceApplication", // tipo de aplicação para o Google (schema.org)
        sistema: "Web (API)",
      },
      sobre: [
        "O LionFinance é uma API de finanças pessoais em ASP.NET Core, ainda em desenvolvimento. O objetivo é registrar receitas e despesas, separá-las por categoria, acompanhar compras parceladas e comparar o que foi gasto com o orçamento do mês.",
        "O projeto é organizado em camadas: Domain (entidades como transação, categoria, parcela e orçamento mensal, e os tipos de transação e formas de pagamento), Application (regras e casos de uso), Infrastructure (persistência com Entity Framework Core) e API (os endpoints).",
      ],
      detalhes: [
        "Arquitetura em camadas com separação de regras de negócio",
        "Transações, categorias, parcelamentos e orçamento mensal",
        "Persistência com Entity Framework Core",
      ],
      tags: ["C#", "ASP.NET Core", "EF Core", "Clean Architecture"],
      linguagens: { "C#": 100 },
      repo: "",            // repositório privado
      demo: "",
    },
  ],
};
