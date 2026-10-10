/*
 * ============================================================
 *  Idiomas do site (português e inglês)
 * ============================================================
 *  - Cada página tem um idioma fixo, dado pelo <html lang>: "/" é
 *    português, "/en/" é inglês. Os textos do código são escritos em
 *    português e passam por t("texto"), que devolve a tradução de EN
 *    quando a página é em inglês.
 *  - Textos dos dados (js/data.js) usam L("pt", "en"); resolver() escolhe.
 *  - O build (tools/build.js) usa este mesmo arquivo para gerar /en/ e
 *    FALHA se algum texto marcado não tiver tradução aqui.
 *  - No navegador: se a pessoa ainda não escolheu um idioma e o do
 *    navegador for outro, aparece um aviso discreto oferecendo a troca.
 *    A escolha fica guardada; o Google não é redirecionado (não guarda nada).
 */
(function (raiz) {
  "use strict";

  // Português → inglês. Chave: o texto exatamente como aparece em português.
  // {nome} e afins são trocados pelo valor passado em t(texto, { nome: ... }).
  var EN = {
    /* --- index.html: cabeçalho, menu e acessibilidade --- */
    "Alex Matias · Desenvolvedor de Software .NET e C# | Divinópolis, MG": "Alex Matias · .NET and C# Software Developer | Brazil",
    "Alex Matias, desenvolvedor de software .NET em Divinópolis, MG. 4 anos com C#, .NET 8, Entity Framework, SQL Server e ASP.NET Core: ERP, integrações, automação industrial e sistemas de gestão.":
      "Alex Matias, .NET software developer based in Brazil. 4 years with C#, .NET 8, Entity Framework, SQL Server and ASP.NET Core: ERP, integrations, industrial automation and business systems.",
    "Alex Matias · Desenvolvedor de Software .NET": "Alex Matias · .NET Software Developer",
    "C#, .NET, Entity Framework e SQL Server: ERP, integrações bancárias, automação industrial e sistemas de gestão. Veja experiência, certificados e projetos.":
      "C#, .NET, Entity Framework and SQL Server: ERP, banking integrations, industrial automation and business systems. See my experience, certificates and projects.",
    "Alex Matias, Desenvolvedor de Software .NET, com um grafo de commits ao lado": "Alex Matias, .NET Software Developer, next to a commit graph",
    "C#, .NET, Entity Framework e SQL Server: ERP, integrações e sistemas de gestão.": "C#, .NET, Entity Framework and SQL Server: ERP, integrations and business systems.",
    "Pular para o conteúdo": "Skip to content",
    "~/alex-matias: ir para o início": "~/alex-matias: go to the top",
    "Seções": "Sections",
    "sobre": "about",
    "carreira": "career",
    "certificados": "certificates",
    "projetos": "projects",
    "artigos": "articles",
    "contato": "contact",
    "Abrir paleta de comandos": "Open command palette",
    "Alternar tema claro e escuro": "Toggle light and dark theme",
    "Idioma": "Language",
    "Navegação rápida pelas seções": "Quick navigation through the sections",

    /* --- index.html: seções --- */
    "Olá, eu sou": "Hi, I'm",
    "desenvolvo": "I build",
    "git checkout projetos": "git checkout projects",
    "abrir um PR →": "open a PR →",
    "Animação de um grafo de commits com ramos se unindo": "Animated commit graph with branches merging",
    "git show sobre": "git show about",
    "Quem sou eu": "About me",
    "Sobre mim": "About me",
    "Tecnologias": "Technologies",
    "ferramentas do dia a dia": "everyday tools",
    "Experiência": "Experience",
    "Cada emprego é um commit na carreira, do mais recente ao mais antigo.": "Each job is a commit in my career, from the most recent to the oldest.",
    "git log --grep=formação": "git log --grep=education",
    "Certificados": "Certificates",
    "Cada certificado é uma versão lançada. Clique para verificar.": "Each certificate is a released version. Click to verify it.",
    "Filtrar certificados por habilidade": "Filter certificates by category",
    "Projetos": "Projects",
    "Sistemas de gestão, APIs e ferramentas web, do balcão da loja ao navegador.": "Business systems, APIs and web tools, from the shop counter to the browser.",
    "Filtrar projetos por tecnologia": "Filter projects by technology",
    "Vamos conversar": "Let's talk",
    "Proposta, vaga ou ideia: abra um pull request.": "A proposal, a job opening or an idea: open a pull request.",
    "Não preencha": "Do not fill in",
    "Sua mensagem chega direto no meu e-mail, e eu respondo pessoalmente.": "Your message goes straight to my inbox, and I reply personally.",
    "Seu nome": "Your name",
    "Como posso te chamar?": "What should I call you?",
    "Seu e-mail": "Your email",
    "voce@email.com": "you@email.com",
    "Título do PR": "PR title",
    "feat: proposta de projeto": "feat: project proposal",
    "Descrição": "Description",
    "Conte o que você precisa…": "Tell me what you need…",
    "nome informado": "name provided",
    "e-mail válido": "valid email",
    "título preenchido": "title filled in",
    "descrição com 10+ caracteres": "description with 10+ characters",
    "Outros canais": "Other channels",
    "feito à mão com HTML, CSS e JavaScript, sem framework": "handmade with HTML, CSS and JavaScript, no framework",
    "Fechar": "Close",
    "clique na imagem para ver no tamanho real": "click the image to see it full size",
    "Tela anterior": "Previous screen",
    "Próxima tela": "Next screen",
    "Revisar pull request": "Review pull request",
    "Paleta de comandos": "Command palette",
    "Digite um comando… (ex.: projetos, carreira, email)": "Type a command… (e.g. projects, career, email)",
    "↑↓ navegar · Enter executar · Esc fechar": "↑↓ navigate · Enter run · Esc close",

    /* --- main.js: topo e números --- */
    "repositórios": "repositories",
    "tags (certificados)": "tags (certificates)",
    "ferramentas": "tools",
    "anos de carreira": "years of experience",
    "Copiado!": "Copied!",
    "Ir para {nome}": "Go to {nome}",

    /* --- main.js: grafo da carreira e experiência --- */
    "graduação": "degree",
    "Linha do tempo da carreira em forma de grafo de commits": "Career timeline drawn as a commit graph",
    "{dica} (início {mes})": "{dica} (started {mes})",
    "{dica} (concluído {mes})": "{dica} (completed {mes})",
    "hoje": "present",
    "todos": "all",

    /* --- main.js: certificados e projetos --- */
    "fatal: No names found, cannot describe anything. (nenhum certificado ainda)": "fatal: No names found, cannot describe anything. (no certificates yet)",
    "exemplo": "example",
    "verificar →": "verify →",
    "link em breve": "link coming soon",
    "{titulo}, {emissor} — verificar certificado": "{titulo}, {emissor} — verify certificate",
    "código": "code",
    "Abrir a demonstração do {nome} (nova aba)": "Open the {nome} demo (new tab)",
    "Ver a demonstração do {nome}": "Watch the {nome} demo",
    "público": "public",
    "privado": "private",
    "## Apresentação": "## Presentation",
    "Vídeo de apresentação do sistema": "System presentation video",
    "## Tour pelas telas": "## Screen tour",
    "Ampliar: {titulo}": "Enlarge: {titulo}",
    "## Destaques": "## Highlights",
    "## Linguagens": "## Languages",
    "Repositório privado. Código disponível sob consulta.": "Private repository. Code available on request.",
    "Ver a página completa do projeto →": "See the full project page →",

    /* --- main.js: contato e formulário --- */
    "mandar mensagem": "send a message",
    "Copiar {rotulo}": "Copy {rotulo}",
    "copiar": "copy",
    "copiado!": "copied!",
    "E-mail copiado!": "Email copied!",
    "Link do GitHub copiado!": "GitHub link copied!",
    "Link do LinkedIn copiado!": "LinkedIn link copied!",
    "Nenhum canal configurado em js/data.js": "No channels configured in js/data.js",
    "Olá, {nome}! ": "Hi, {nome}! ",
    "✗ Alguns checks falharam. Confira os campos marcados.": "✗ Some checks failed. Please review the highlighted fields.",
    "✗ O e-mail de destino ainda não foi configurado em js/data.js.": "✗ The destination email hasn't been set in js/data.js yet.",
    "✓ Mensagem enviada.": "✓ Message sent.",
    " #{numero} · de {nome} para ": " #{numero} · from {nome} to ",
    "de": "from",
    "para": "to",
    "Mensagem": "Message",
    "Confira se o seu e-mail está certo: é por ele que eu vou responder.": "Check that your email is right: that's where I'll reply.",
    "Voltar e editar": "Back to edit",
    "Confirmar e enviar": "Confirm and send",
    "Enviando…": "Sending…",
    "Enviando sua mensagem, só um instante.": "Sending your message, just a moment.",
    "✓ PR #{numero} enviado. Obrigado pelo contato!": "✓ PR #{numero} sent. Thanks for reaching out!",
    "Mensagem enviada!": "Message sent!",
    "Obrigado, {nome}. Recebi sua mensagem e vou responder em {email}.": "Thank you, {nome}. I got your message and will reply to {email}.",
    "Falha no envio": "Sending failed",
    "Não consegui enviar agora": "I couldn't send it right now",
    "Sua mensagem não se perdeu: ela continua no formulário. Tente de novo ou envie pelo seu e-mail.": "Your message isn't lost: it's still in the form. Try again or send it from your email app.",
    "Enviar pelo meu e-mail": "Send from my email",
    "Tentar de novo": "Try again",

    /* --- main.js e pagina.js: tema, paleta, proteção e console --- */
    "tema: {tema}": "theme: {tema}",
    "claro": "light",
    "escuro": "dark",
    "Ir para o início": "Go to the top",
    "Ir para sobre": "Go to about",
    "Ir para experiência (carreira)": "Go to experience (career)",
    "Ir para certificados": "Go to certificates",
    "Ir para projetos": "Go to projects",
    "Ir para contato": "Go to contact",
    "Alternar tema claro/escuro": "Toggle light/dark theme",
    "tema": "theme",
    "Copiar e-mail": "Copy email",
    "Abrir GitHub": "Open GitHub",
    "Abrir LinkedIn": "Open LinkedIn",
    "Abrir Instagram": "Open Instagram",
    "Ler em português": "Read in Portuguese",
    "Ler em inglês": "Read in English",
    "comando não encontrado: {q}": "command not found: {q}",
    "Conteúdo protegido · use \"copiar email\" no contato": "Protected content · use \"copy email\" in the contact section",
    "Conteúdo protegido": "Protected content",
    "você abriu o console": "you opened the console",
    "feat: curiosidade de dev": "feat: developer curiosity",
    "Olá, dev curioso! 👋": "Hi, curious dev! 👋",
    "Já que você está aqui… que tal a gente conversar?": "Since you're here… how about we talk?",
    "Digite ": "Type ",
    " para ir direto ao formulário de contato.": " to jump straight to the contact form.",
    "Abrindo o contato… até já! 🚀": "Opening the contact form… see you there! 🚀",

    /* --- Páginas internas (build) --- */
    "Início": "Home",
    "Você está em": "You are here",
    "abrir a demo": "open the demo",
    "ver a demonstração": "watch the demo",
    "código no GitHub": "code on GitHub",
    "falar comigo →": "talk to me →",
    "Repositório privado: código disponível sob consulta.": "Private repository: code available on request.",
    "Apresentação": "Presentation",
    "Vídeo de apresentação do {nome}": "{nome} presentation video",
    "Tour pelas telas": "Screen tour",
    "Sobre o projeto": "About the project",
    "Destaques": "Highlights",
    "Stack e linguagens": "Stack and languages",
    "Outros projetos": "Other projects",
    "Precisa de um sistema assim?": "Need a system like this?",
    "Sistemas de gestão, integrações e APIs em C# e .NET. Me conta o que você precisa.": "Business systems, integrations and APIs in C# and .NET. Tell me what you need.",
    "detalhes": "details",
    "Lista de projetos de {nome}": "{nome}'s projects",

    /* --- Página inicial: resultados (build) --- */
    "Resultados com antes e depois": "Results with before and after numbers",
    "o que mudou, medido antes e depois": "what changed, measured before and after",

    /* --- Cookies (js/analytics.js) e página de privacidade (build) --- */
    "Aviso de cookies": "Cookie notice",
    "Uso o Google Analytics para saber quantas pessoas visitam o site. Ele só grava cookies se você aceitar.":
      "I use Google Analytics to know how many people visit this site. It only sets cookies if you accept.",
    "Saiba mais": "Learn more",
    "Recusar": "Decline",
    "Aceitar": "Accept",
    "privacidade": "privacy",
    "Privacidade": "Privacy",

    /* --- Aviso de idioma --- */
    "Este site também está em português.": "Este site também está em português.",
    "Ler em português →": "Ler em português →",
    "This site is also available in English.": "This site is also available in English.",
    "Read in English →": "Read in English →",
    "Fechar aviso": "Close notice",
  };

  var MESES = {
    pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  };

  // Objeto { pt, en } (feito por L() no data.js)?
  function ehBilingue(v) {
    if (!v || typeof v !== "object" || Array.isArray(v)) return false;
    var chaves = Object.keys(v);
    return chaves.length > 0 && chaves.length <= 2 && "pt" in v && chaves.every(function (k) { return k === "pt" || k === "en"; });
  }

  function criar(idioma) {
    var lang = idioma === "en" ? "en" : "pt";

    function t(pt, vars) {
      var s = lang === "en" && Object.prototype.hasOwnProperty.call(EN, pt) ? EN[pt] : pt;
      if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
      return s;
    }

    // Troca, em qualquer profundidade, os { pt, en } pelo texto do idioma (sem mexer no original)
    function resolver(v) {
      if (ehBilingue(v)) return resolver(lang === "en" && v.en != null ? v.en : v.pt);
      if (Array.isArray(v)) return v.map(resolver);
      if (v && typeof v === "object") {
        var r = {};
        Object.keys(v).forEach(function (k) { r[k] = resolver(v[k]); });
        return r;
      }
      return v;
    }

    function formatarMes(aaaamm) {
      var p = String(aaaamm || "").split("-");
      var m = parseInt(p[1], 10);
      if (!p[0] || !m) return aaaamm || "";
      return MESES[lang][m - 1] + " " + p[0];
    }

    function periodo(inicio, fim) {
      return formatarMes(inicio) + " → " + (fim ? formatarMes(fim) : t("hoje"));
    }

    // "2 anos e 10 meses" / "2 yrs 10 mos", do mês de início até o de saída (ou até hoje)
    function duracao(inicio, fim) {
      var a = String(inicio).split("-").map(Number);
      var hoje = new Date();
      var b = fim ? String(fim).split("-").map(Number) : [hoje.getFullYear(), hoje.getMonth() + 1];
      var meses = Math.max(1, (b[0] - a[0]) * 12 + (b[1] - a[1]));
      var anos = Math.floor(meses / 12), resto = meses % 12;
      var partes = [];
      if (lang === "en") {
        if (anos) partes.push(anos + (anos === 1 ? " yr" : " yrs"));
        if (resto) partes.push(resto + (resto === 1 ? " mo" : " mos"));
        return partes.join(" ");
      }
      if (anos) partes.push(anos + (anos === 1 ? " ano" : " anos"));
      if (resto) partes.push(resto + (resto === 1 ? " mês" : " meses"));
      return partes.join(" e ");
    }

    return {
      idioma: lang,
      locale: lang === "en" ? "en-US" : "pt-BR",
      prefixo: lang === "en" ? "/en" : "", // início dos endereços das páginas neste idioma
      t: t,
      resolver: resolver,
      formatarMes: formatarMes,
      periodo: periodo,
      duracao: duracao,
    };
  }

  var docLang = raiz.document && raiz.document.documentElement && raiz.document.documentElement.lang;
  var I18N = criar(/^en/i.test(docLang || "") ? "en" : "pt");
  I18N.criar = criar;
  I18N.EN = EN;
  raiz.I18N = I18N;

  /* ============================================================
     No navegador: escolha guardada e aviso de idioma
     ============================================================ */
  if (!raiz.document || !raiz.addEventListener) return;

  function lerPreferencia() { try { return localStorage.getItem("idioma"); } catch (e) { return null; } }
  function gravarPreferencia(v) { try { localStorage.setItem("idioma", v); } catch (e) { /* sem armazenamento */ } }

  // Endereço desta mesma página no outro idioma (vem das tags hreflang do <head>)
  function enderecoEm(idioma) {
    var link = document.querySelector('link[rel="alternate"][hreflang="' + (idioma === "en" ? "en" : "pt-BR") + '"]');
    if (!link) return null;
    var u = new URL(link.href, location.href);
    return u.pathname + u.search; // mesmo domínio em que a pessoa está (também no localhost)
  }

  // Quem já escolheu um idioma vai direto para ele (só pessoas: o Google não guarda nada)
  var pref = lerPreferencia();
  if (pref && pref !== I18N.idioma) {
    var destino = enderecoEm(pref);
    if (destino && destino !== location.pathname) { location.replace(destino); return; }
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[data-idioma]");
    if (link) gravarPreferencia(link.getAttribute("data-idioma"));
  });

  // Ainda não escolheu: se o navegador for de outro idioma, oferece a troca (sem forçar)
  function oferecerTroca() {
    if (pref) return;
    var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]).join(",");
    var prefereEn = !/(^|,)pt/i.test(langs);
    var outro = I18N.idioma === "pt" && prefereEn ? "en" : I18N.idioma === "en" && !prefereEn ? "pt" : null;
    var destino = outro && enderecoEm(outro);
    if (!destino) return;

    var emIngles = outro === "en";
    var aviso = document.createElement("div");
    aviso.className = "aviso-idioma";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", emIngles ? "Language" : "Idioma");
    aviso.lang = emIngles ? "en" : "pt-BR";
    aviso.innerHTML =
      '<span class="aviso-idioma-ico" aria-hidden="true">⎇</span>' +
      '<p><span class="aviso-idioma-txt"></span> <a class="aviso-idioma-link"></a></p>' +
      '<button type="button" class="aviso-idioma-x">✕</button>';
    aviso.querySelector(".aviso-idioma-txt").textContent = emIngles ? "This site is also available in English." : "Este site também está em português.";
    var a = aviso.querySelector(".aviso-idioma-link");
    a.textContent = emIngles ? "Read in English →" : "Ler em português →";
    a.href = destino;
    a.hreflang = emIngles ? "en" : "pt-BR";
    a.setAttribute("data-idioma", outro);
    var x = aviso.querySelector(".aviso-idioma-x");
    x.setAttribute("aria-label", emIngles ? "Close notice" : "Fechar aviso");
    x.addEventListener("click", function () {
      gravarPreferencia(I18N.idioma); // fechar = ficar neste idioma, sem perguntar de novo
      aviso.classList.remove("mostrar");
      setTimeout(function () { aviso.remove(); }, 400);
    });
    document.body.appendChild(aviso);
    setTimeout(function () { aviso.classList.add("mostrar"); }, 1200);
  }

  // Um aviso por vez: enquanto o de cookies (js/analytics.js) espera uma escolha, este espera também
  function quandoPronto() {
    var consentimento;
    try { consentimento = localStorage.getItem("consentimento"); } catch (e) { consentimento = "?"; }
    if (consentimento) oferecerTroca();
    else document.addEventListener("consentimento", oferecerTroca, { once: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", quandoPronto);
  else quandoPronto();
})(typeof window !== "undefined" ? window : this);
