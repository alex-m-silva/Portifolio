(function () {
  "use strict";

  // Idioma da página (pt em "/", en em "/en/"): textos passam por tx(), escritos em português
  // e dados já resolvidos para o idioma (os L("pt", "en") do data.js viram texto simples)
  var I = window.I18N;
  var tx = I.t;
  var D = I.resolver(window.PORTFOLIO);
  var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     Utilitários
     ============================================================ */
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  // Cria elementos sem innerHTML para os dados (evita injeção de HTML)
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v; // só para ícones fixos deste arquivo
        else if (k === "style") el.setAttribute("style", v);
        else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var filho = arguments[i];
      if (filho === null || filho === undefined || filho === false) continue;
      if (Array.isArray(filho)) filho.forEach(function (f) { if (f) el.appendChild(f); });
      else el.appendChild(typeof filho === "string" ? document.createTextNode(filho) : filho);
    }
    return el;
  }

  // Hash curto e determinístico (FNV-1a), para parecer um SHA de commit
  function hashCurto(texto) {
    var h1 = 0x811c9dc5;
    for (var i = 0; i < texto.length; i++) {
      h1 ^= texto.charCodeAt(i);
      h1 = Math.imul(h1, 0x01000193);
    }
    return ("0000000" + (h1 >>> 0).toString(16)).slice(-7);
  }

  // Datas no idioma da página ("mai 2023" / "May 2023", "hoje" / "present")
  var formatarMes = I.formatarMes;
  var periodo = I.periodo;
  var duracao = I.duracao;

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("mostrar");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("mostrar"); }, 2400);
  }

  // O aviso aparece na hora do clique; se a API moderna falhar, cai no método antigo
  function copiar(texto, aviso) {
    toast(aviso || tx("Copiado!"));
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).catch(function () { copiarAntigo(texto); });
    } else {
      copiarAntigo(texto);
    }
  }
  function copiarAntigo(texto) {
    var ta = h("textarea", { style: "position:fixed;opacity:0" });
    ta.value = texto;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* sem suporte */ }
    ta.remove();
  }

  // Rola até uma seção e atualiza o endereço (#secao) sem pular a página
  // Rola até uma seção sem pôr "#secao" no endereço: a barra fica sempre alexmatias.dev.br
  function irPara(id, instantaneo) {
    var el = document.getElementById(id);
    if (!el) return;
    limparEndereco(); // antes de rolar: trocar a URL no meio da rolagem suave a interrompe no Chrome
    // "instant" ignora o scroll-behavior: smooth do CSS (usado ao abrir um link antigo com #secao)
    el.scrollIntoView({ behavior: instantaneo ? "instant" : reduzirMovimento ? "auto" : "smooth" });
  }

  function limparEndereco() {
    if (location.hash && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
  }

  // Links internos (menu, botões "#secao") navegam por irPara em vez de mexer na URL.
  // Links antigos com #secao (ex.: compartilhados antes) ainda funcionam: rola até lá e limpa a URL.
  function prepararLinksInternos() {
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href").slice(1);
      var alvo = id && document.getElementById(id);
      if (!alvo) return;
      e.preventDefault();
      if (id === "conteudo") { // "Pular para o conteúdo": leva o foco junto
        alvo.setAttribute("tabindex", "-1");
        alvo.focus({ preventScroll: true });
      }
      irPara(id);
    });

    // "#demo-<projeto>" é tratado por abrirDemoPeloEndereco, que abre a demonstração
    if (location.hash && !/^#demo-/i.test(location.hash)) {
      var id = decodeURIComponent(location.hash.slice(1));
      limparEndereco();
      // Espera a página terminar de carregar (fontes e imagens) para cair no lugar certo
      var rolar = function () { setTimeout(function () { irPara(id, true); }, 30); };
      if (document.readyState === "complete") rolar();
      else window.addEventListener("load", rolar, { once: true });
    }
  }

  // Evento no Google Analytics (se ele estiver ligado; fora do domínio oficial não faz nada)
  function rastrear(evento, params) {
    if (typeof window.gtag === "function") window.gtag("event", evento, params || {});
  }

  function corVar(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  }

  var ICONES = {
    repo: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.07 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.09a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>',
    github: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
    link: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .14.11.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.78 2.78 2 3.75 2Zm6.85-.53A.75.75 0 0 1 11.25 1h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.28.53L12.6 4.16 9.28 7.47a.75.75 0 0 1-1.06-1.06l3.31-3.32-1.12-1.12a.75.75 0 0 1-.21-.5Z"/></svg>',
    livro: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.25c1.2 0 2.27.56 3 1.44A3.75 3.75 0 0 1 11 1h4.25a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H10.8a2.25 2.25 0 0 0-2.05 1.32.75.75 0 0 1-1.38.02l-.05-.1A2.25 2.25 0 0 0 5.2 13H.75a.75.75 0 0 1-.75-.75Zm7.25 2.5A2.25 2.25 0 0 0 5 2.5H1.5v9h3.7c.75 0 1.47.22 2.05.6Zm1.5 7.85a3.74 3.74 0 0 1 2.05-.6h3.7v-9H11a2.25 2.25 0 0 0-2.25 2.25Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.6-8-5.6ZM5.4 7l6.6 4.6L18.6 7H5.4Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.82c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.9h-4v-11Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/></svg>',
    check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>',
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.8v10.4a.8.8 0 0 0 1.22.68l8.3-5.2a.8.8 0 0 0 0-1.36l-8.3-5.2A.8.8 0 0 0 4 2.8Z"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.25 4.24a1 1 0 0 1-1.42 1.42l-4.24-4.25A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 2a1 1 0 0 1 1 1v1.5H13a1 1 0 1 1 0 2h-1.5V13a1 1 0 1 1-2 0v-1.5H8a1 1 0 1 1 0-2h1.5V8a1 1 0 0 1 1-1Z"/></svg>',
    copiar: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 6.75C0 5.78.78 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .14.11.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Zm5-5C5 .78 5.78 0 6.75 0h7.5C15.22 0 16 .78 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .14.11.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>',
  };

  var CORES_LINGUAGEM = { "C#": "--lilas", "SQL": "--ambar", "WiX": "--coral", "JavaScript": "--ambar", "TypeScript": "--ceu", "HTML": "--coral", "CSS": "--ceu", "Python": "--menta" };
  var CORES_ROTACAO = ["--menta", "--ceu", "--lilas", "--ambar", "--coral"];

  /* ============================================================
     Início
     ============================================================ */
  function montarInicio() {
    var p = D.perfil;
    $("#marca-usuario").textContent = p.usuario;
    $("#hero-nome").textContent = p.nome;
    // A frase já vem no HTML (build). Regravar o mesmo texto faria o navegador "pintar de novo"
    // o maior elemento do topo no fim do carregamento, piorando o LCP.
    var frase = $("#hero-frase");
    if (frase.textContent.trim() !== p.frase) frase.textContent = p.frase;
    $("#hero-hash").textContent = hashCurto(p.nome + p.cargo);

    var numeros = [
      { valor: D.projetos.length, rotulo: tx("repositórios") },
      { valor: D.certificados.length, rotulo: tx("tags (certificados)") },
      { valor: p.stack.length, rotulo: tx("ferramentas") },
    ];
    var anos = anosDeCarreira();
    if (anos) numeros.unshift({ valor: anos, rotulo: tx("anos de carreira") });
    var dl = $("#hero-numeros");
    numeros.forEach(function (n) {
      var dd = h("dd", null, h("span", { "data-contar": n.valor, text: reduzirMovimento ? String(n.valor) : "0" }), h("small", { text: "+" }));
      dl.appendChild(h("div", null, h("dt", { text: n.rotulo }), dd));
    });

    digitar($("#digitando"), p.funcoes);
    introTopo();
  }

  // Entrada do topo ao carregar: o nome em "~/alex-matias" é digitado letra a letra
  // enquanto os itens do menu descem um a um. No fim fica tudo como sempre foi.
  function introTopo() {
    var raiz = document.documentElement;
    if (!raiz.classList.contains("intro")) return;
    var alvo = $("#marca-usuario");
    var nome = alvo.textContent;
    var itens = $$(".nav li, .topo-acoes > *");

    alvo.textContent = "";
    alvo.style.visibility = "visible";
    itens.forEach(function (el, i) { el.style.setProperty("--atraso-menu", 380 + i * 70 + "ms"); });
    raiz.classList.add("intro-menu");

    var letra = 0;
    setTimeout(function digita() {
      alvo.textContent = nome.slice(0, ++letra);
      if (letra < nome.length) setTimeout(digita, 45 + Math.random() * 45); // ritmo de quem digita
    }, 250);

    // Tira as classes quando a última animação do menu acabar
    var duracao = 380 + itens.length * 70 + 650;
    setTimeout(function () {
      raiz.classList.remove("intro", "intro-menu");
      alvo.style.removeProperty("visibility");
      itens.forEach(function (el) { el.style.removeProperty("--atraso-menu"); });
      alvo.textContent = nome;
    }, Math.max(duracao, 250 + nome.length * 90 + 100));
  }

  // Efeito de digitação: escreve, espera, apaga e passa para a próxima frase
  function digitar(alvo, frases) {
    if (!frases || !frases.length) return;
    if (reduzirMovimento) { alvo.textContent = frases[0]; return; }
    var i = 0, letra = 0, apagando = false;
    function passo() {
      var frase = frases[i];
      letra += apagando ? -1 : 1;
      alvo.textContent = frase.slice(0, letra);
      var espera = apagando ? 35 : 70;
      if (!apagando && letra === frase.length) { apagando = true; espera = 1800; }
      else if (apagando && letra === 0) { apagando = false; i = (i + 1) % frases.length; espera = 350; }
      setTimeout(passo, espera);
    }
    passo();
  }

  function contarNumeros() {
    $$("[data-contar]").forEach(function (el) {
      var fim = parseInt(el.getAttribute("data-contar"), 10) || 0;
      if (reduzirMovimento || fim === 0) { el.textContent = String(fim); return; }
      var inicio = performance.now(), dur = 1100;
      function quadro(t) {
        var k = Math.min(1, (t - inicio) / dur);
        el.textContent = String(Math.round(fim * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(quadro);
      }
      requestAnimationFrame(quadro);
    });
  }

  /* ============================================================
     Grafo de commits animado (canvas)
     ------------------------------------------------------------
     O commit mais novo fica no topo, como no `git log --graph`.
     Cada linha tem um nó numa faixa (lane) e as arestas que
     descem até a linha anterior. Ramos nascem (fork) e voltam
     para outra faixa (merge).
     ============================================================ */
  function iniciarGrafo() {
    var canvas = $("#grafo");
    var legenda = $("#grafo-legenda");
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var MAX_LANES = 5;
    var MENSAGENS = I.idioma === "en" ? [
      "feat: PDF quotes",
      "feat: WhatsApp notifications",
      "fix: offline postal code lookup",
      "feat: compatible products by model",
      "refactor: generic repositories",
      "feat: quick counter sale",
      "chore: migration script 005",
      "feat: sales by department report",
      "fix: aligned grid on the orders screen",
      "feat: .msi installer",
      "perf: indexed queries on PostgreSQL",
      "test: order rules",
      "feat: SQLite without admin rights",
      "docs: updated README",
    ] : [
      "feat: orçamento em PDF",
      "feat: aviso pelo WhatsApp",
      "fix: busca de CEP sem internet",
      "feat: produtos compatíveis por modelo",
      "refactor: repositórios genéricos",
      "feat: venda rápida de balcão",
      "chore: script de migração 005",
      "feat: relatório por departamento",
      "fix: grid alinhado na tela de pedidos",
      "feat: instalador .msi",
      "perf: consultas com índice no PostgreSQL",
      "test: regras do pedido",
      "feat: SQLite sem administrador",
      "docs: README atualizado",
    ];
    var RAMOS = ["feature/pdf", "feature/whatsapp", "fix/cep", "feature/estoque", "feature/msi", "feature/api", "refactor/repos"];

    var largura = 0, altura = 0, dpr = 1;
    var GAP = 46;          // distância vertical entre commits
    var linhas = [];       // [0] = mais novo
    var ativos = [0];      // faixas com ramo aberto no topo
    var nomeRamo = { 0: "main" };
    var deslocamento = 0;  // animação de entrada da linha nova
    var cores = [];
    var corLinhaFundo = "";
    var mouse = { x: -999, y: -999 };
    var contador = 0;
    var visivel = true;
    var ultimo = 0;
    var proximo = 0;

    function lerCores() {
      cores = CORES_ROTACAO.map(corVar);
      corLinhaFundo = corVar("--bg-2");
    }

    function xLane(l) {
      var usar = Math.min(largura, 460);
      var inicio = (largura - usar) / 2 + 48;
      return inicio + l * ((usar - 96) / (MAX_LANES - 1));
    }

    function aleatorio(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

    function novaLinha() {
      contador++;
      var r = Math.random();
      var livres = [];
      for (var l = 0; l < MAX_LANES; l++) if (ativos.indexOf(l) < 0) livres.push(l);
      var linha;

      if (livres.length && ativos.length < 4 && r < 0.24) {
        // Fork: ramo novo que (descendo) sai de uma faixa existente
        var nova = livres[0];
        var origem = aleatorio(ativos);
        var nome = aleatorio(RAMOS);
        nomeRamo[nova] = nome;
        linha = {
          no: nova, tipo: "fork",
          arestas: ativos.map(function (a) { return [a, a]; }).concat([[nova, origem]]),
          texto: "checkout -b " + nome,
        };
        ativos = ativos.concat([nova]).sort();
      } else if (ativos.length > 1 && r < 0.5) {
        // Merge: um ramo volta para outro (de preferência a main)
        var ramos = ativos.filter(function (a) { return a !== 0; });
        var m = aleatorio(ramos);
        var destinos = ativos.filter(function (a) { return a !== m; });
        var alvo = Math.random() < 0.7 && destinos.indexOf(0) >= 0 ? 0 : aleatorio(destinos);
        linha = {
          no: alvo, tipo: "merge",
          arestas: ativos.filter(function (a) { return a !== m; }).map(function (a) { return [a, a]; }).concat([[alvo, m]]),
          texto: "Merge branch '" + (nomeRamo[m] || "feature") + "' into " + (nomeRamo[alvo] || "main"),
        };
        ativos = ativos.filter(function (a) { return a !== m; });
      } else {
        var lane = Math.random() < 0.4 ? ativos[0] : aleatorio(ativos);
        linha = {
          no: lane, tipo: "commit",
          arestas: ativos.map(function (a) { return [a, a]; }),
          texto: aleatorio(MENSAGENS),
        };
      }
      linha.hash = hashCurto("c" + contador + linha.texto);
      linha.nasceu = performance.now();
      linhas.unshift(linha);
      var max = Math.ceil(altura / GAP) + 3;
      if (linhas.length > max) linhas.length = max;
      mostrarLegenda(linha);
    }

    function mostrarLegenda(linha) {
      legenda.textContent = "";
      legenda.appendChild(h("b", { text: linha.hash }));
      legenda.appendChild(document.createTextNode(" " + linha.texto));
    }

    function yLinha(i) { return 52 + i * GAP + deslocamento; }

    function desenhar(agora) {
      ctx.clearRect(0, 0, largura, altura);
      ctx.lineCap = "round";

      // Arestas
      for (var i = 0; i < linhas.length - 1; i++) {
        var y1 = yLinha(i), y2 = yLinha(i + 1);
        var arestas = linhas[i].arestas;
        for (var j = 0; j < arestas.length; j++) {
          var de = arestas[j][0], para = arestas[j][1];
          var x1 = xLane(de), x2 = xLane(para);
          ctx.strokeStyle = cores[(de === para ? de : Math.max(de, para)) % cores.length];
          ctx.globalAlpha = 0.85;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          if (x1 === x2) ctx.lineTo(x2, y2);
          else ctx.bezierCurveTo(x1, y1 + GAP * 0.55, x2, y2 - GAP * 0.55, x2, y2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Nós
      for (var k = 0; k < linhas.length; k++) {
        var ln = linhas[k];
        var x = xLane(ln.no), y = yLinha(k);
        var cor = cores[ln.no % cores.length];
        var dist = Math.hypot(mouse.x - x, mouse.y - y);
        var perto = Math.max(0, 1 - dist / 90);
        var idade = Math.min(1, (agora - ln.nasceu) / 450);
        var raio = (ln.tipo === "merge" ? 7 : 5.5) * (0.4 + 0.6 * idade) + perto * 4;

        if (k === 0 && !reduzirMovimento) {
          var pulso = (agora % 1600) / 1600;
          ctx.globalAlpha = 0.35 * (1 - pulso);
          ctx.fillStyle = cor;
          ctx.beginPath();
          ctx.arc(x, y, raio + pulso * 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = ln.tipo === "merge" ? corLinhaFundo : cor;
        ctx.strokeStyle = cor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, raio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rótulo do commit ao lado, mais visível perto do mouse
        var maxLane = Math.max.apply(null, ln.arestas.map(function (a) { return Math.max(a[0], a[1]); }).concat([ln.no]));
        var xTexto = xLane(maxLane) + 22;
        if (xTexto < largura - 60) {
          ctx.globalAlpha = (k === 0 ? 0.95 : 0.32) + perto * 0.6;
          ctx.fillStyle = cor;
          ctx.font = "500 11px 'JetBrains Mono', monospace";
          ctx.textBaseline = "middle";
          ctx.fillText(ln.hash, xTexto, y);
          ctx.globalAlpha = 1;
        }
      }
    }

    function laco(agora) {
      if (!visivel || document.hidden) { ultimo = 0; requestAnimationFrame(laco); return; }
      if (!ultimo) ultimo = agora;
      var dt = Math.min(64, agora - ultimo);
      ultimo = agora;

      if (agora >= proximo) {
        novaLinha();
        deslocamento -= GAP;
        proximo = agora + 1300 + Math.random() * 700;
      }
      // Desliza suavemente até a posição final
      deslocamento += (0 - deslocamento) * Math.min(1, dt / 160);
      if (Math.abs(deslocamento) < 0.1) deslocamento = 0;

      desenhar(agora);
      requestAnimationFrame(laco);
    }

    function redimensionar() {
      var r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = r.width;
      altura = r.height;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var min = Math.ceil(altura / GAP) + 2;
      while (linhas.length < min) novaLinha();
      if (reduzirMovimento) desenhar(performance.now() + 1000);
    }

    lerCores();
    redimensionar();
    if (typeof ResizeObserver === "function") new ResizeObserver(redimensionar).observe(canvas);
    else window.addEventListener("resize", redimensionar);

    document.addEventListener("tema-alterado", function () {
      lerCores();
      if (reduzirMovimento) desenhar(performance.now() + 1000);
    });

    if (reduzirMovimento) return;

    canvas.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; }).observe(canvas);
    }
    proximo = performance.now() + 900;
    requestAnimationFrame(laco);
  }

  /* ============================================================
     Sobre
     ============================================================ */
  function montarSobre() {
    var p = D.perfil;
    $("#sobre-hash").textContent = hashCurto(p.sobre.join(" ")) + hashCurto(p.nome) + hashCurto(p.cargo).slice(0, 4);
    $("#sobre-autor").textContent = p.nome + " <" + p.usuario + "@dev>";
    var hoje = new Date();
    $("#sobre-data").textContent = hoje.toLocaleDateString(I.locale, { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

    // O build (tools/build.js) já deixa este conteúdo no HTML para o Google; aqui é montado de novo
    var texto = $("#sobre-texto");
    texto.textContent = "";
    p.sobre.forEach(function (par) { texto.appendChild(h("p", { text: par })); });

    var lista = $("#stack");
    lista.textContent = "";
    p.stack.forEach(function (item, i) { lista.appendChild(h("li", { text: item, style: "--i:" + i })); });
    $("#stack-qtd").textContent = String(p.stack.length);
    desenharUmaVez(lista); // as linhas do diff entram uma a uma

    montarGrafoCarreira();
  }

  /* ============================================================
     Grafo da carreira (card "Quem sou eu")
     ------------------------------------------------------------
     Desenha a carreira como um `git log --graph`, montado a partir
     de D.experiencia e D.formacao:
     - empregos em sequência são commits na main;
     - um emprego que acontece durante outro (ex.: freela) vira um
       ramo que sai da main e volta com um merge ao terminar;
     - cada formação também é um ramo, com merge na conclusão.
     O mais novo fica em cima. É estático: só se desenha uma vez,
     do mais antigo para o mais novo, quando aparece na tela.
     ============================================================ */
  var SVG_NS = "http://www.w3.org/2000/svg";
  function s(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) el.appendChild(arguments[i]);
    return el;
  }

  function montarGrafoCarreira() {
    var fig = $("#grafo-carreira");
    var exp = D.experiencia || [];
    var form = D.formacao || [];
    if (!fig || exp.length + form.length < 2) return;

    var hoje = new Date();
    var hojeStr = hoje.getFullYear() + "-" + ("0" + (hoje.getMonth() + 1)).slice(-2);
    var fimDe = function (x) { return x.fim || hojeStr; };
    var meses = function (x) { var a = x.inicio.split("-"), b = fimDe(x).split("-"); return (b[0] - a[0]) * 12 + (b[1] - a[1]); };

    // Emprego "paralelo": acontece inteiro dentro de outro, mais longo
    var paralelo = function (e) {
      return exp.some(function (o) { return o !== e && o.inicio <= e.inicio && fimDe(o) >= fimDe(e) && meses(o) > meses(e); });
    };

    var eventos = [];
    var ramos = [];
    exp.forEach(function (e) {
      if (!e.inicio) return;
      if (paralelo(e)) ramos.push({ inicio: e.inicio, fim: e.fim, nome: e.empresa, rotulo: e.empresa, merge: "merge: " + e.empresa, dica: e.cargo + " @ " + e.empresa });
      else eventos.push({ data: e.inicio, lane: 0, tipo: "commit", rotulo: e.empresa, dica: e.cargo + " @ " + e.empresa + " (" + periodo(e.inicio, e.fim) + ")" });
    });
    form.forEach(function (f) {
      if (!f.inicio) return;
      ramos.push({ inicio: f.inicio, fim: f.fim && f.fim <= hojeStr ? f.fim : "", nome: tx("graduação"), rotulo: f.instituicao, merge: "merge: " + tx("graduação") + " ✓", dica: f.curso + " @ " + f.instituicao });
    });

    // Cada ramo ganha a menor faixa livre (≥ 1) no período dele. Os mais curtos escolhem
    // primeiro e ficam por dentro, perto da main, para as linhas não se cruzarem.
    var ocupacao = [];
    var livre = function (l, r) {
      return !(ocupacao[l] || []).some(function (p) { return r.inicio <= p[1] && (r.fim || "9999") >= p[0]; });
    };
    ramos.sort(function (a, b) { return meses(a) - meses(b); }).forEach(function (r) {
      var l = 1;
      while (!livre(l, r)) l++;
      (ocupacao[l] = ocupacao[l] || []).push([r.inicio, r.fim || "9999"]);
      r.lane = l;
      r.fork = { data: r.inicio, lane: l, tipo: "fork", rotulo: r.rotulo, dica: tx("{dica} (início {mes})", { dica: r.dica, mes: formatarMes(r.inicio) }) };
      eventos.push(r.fork);
      if (r.fim) {
        r.mergeEv = { data: r.fim, lane: 0, tipo: "merge", rotulo: r.merge, dica: tx("{dica} (concluído {mes})", { dica: r.dica, mes: formatarMes(r.fim) }) };
        eventos.push(r.mergeEv);
      }
    });

    var ordemTipo = { merge: 0, commit: 1, fork: 2 };
    eventos.sort(function (a, b) { return b.data.localeCompare(a.data) || ordemTipo[a.tipo] - ordemTipo[b.tipo]; });
    eventos.forEach(function (ev, i) { ev.linha = i; });

    var n = eventos.length;
    var faixas = Math.max(1, ocupacao.length);
    var GAP = 44, TOPO = 22;
    var X = function (l) { return 14 + l * 26; };
    var Y = function (i) { return TOPO + i * GAP; };
    var xTexto = X(faixas - 1) + 22;
    var larg = 300, alt = Y(n - 1) + TOPO;
    var corFaixa = function (l) { return l === 0 ? "var(--menta)" : "var(" + ["--ambar", "--lilas", "--ceu", "--coral"][(l - 1) % 4] + ")"; };
    var atrasoLinha = function (i) { return (n - 1 - i) * 140; }; // de baixo (antigo) para cima (novo)

    var svg = s("svg", { viewBox: "0 0 " + larg + " " + alt, width: larg, height: alt, role: "img", "aria-label": tx("Linha do tempo da carreira em forma de grafo de commits") });

    // Linha da main, desenhada de baixo para cima
    svg.appendChild(s("path", {
      class: "gc-linha", d: "M" + X(0) + " " + Y(n - 1) + "V" + Y(0), stroke: corFaixa(0), pathLength: 1,
      style: "--d:0ms;--dur:" + (300 + n * 140) + "ms",
    }));

    // Ramos: saem da main abaixo do primeiro commit do ramo e voltam no merge
    ramos.forEach(function (r) {
      var xl = X(r.lane), rf = r.fork.linha, c = GAP * 0.6;
      var d = rf + 1 < n
        ? "M" + X(0) + " " + Y(rf + 1) + "C" + X(0) + " " + (Y(rf + 1) - c) + " " + xl + " " + (Y(rf) + c) + " " + xl + " " + Y(rf)
        : "M" + xl + " " + Y(rf);
      if (r.mergeEv) {
        var rm = r.mergeEv.linha;
        if (rm + 1 < rf) d += "V" + Y(rm + 1);
        var yBase = rm + 1 < rf ? Y(rm + 1) : Y(rf);
        d += "C" + xl + " " + (yBase - c) + " " + X(0) + " " + (Y(rm) + c) + " " + X(0) + " " + Y(rm);
      } else {
        d += "V" + (Y(0) - 14); // ramo ainda aberto: segue até o topo
      }
      svg.appendChild(s("path", { class: "gc-linha", d: d, stroke: corFaixa(r.lane), pathLength: 1, style: "--d:" + atrasoLinha(Math.min(rf + 1, n - 1)) + "ms;--dur:" + ((rf - (r.mergeEv ? r.mergeEv.linha : 0)) * 140 + 400) + "ms" }));
    });

    // Nós e rótulos
    eventos.forEach(function (ev, i) {
      var x = X(ev.lane), y = Y(i), cor = corFaixa(ev.lane), atraso = atrasoLinha(i) + "ms";
      var g = s("g", { class: "gc-no", style: "--d:" + atraso }, s("title"));
      g.firstChild.textContent = ev.dica;
      if (i === 0) g.appendChild(s("circle", { class: "gc-pulso", cx: x, cy: y, r: 7, fill: cor }));
      g.appendChild(s("circle", {
        class: "gc-bola", cx: x, cy: y, r: ev.tipo === "merge" ? 6.5 : 5.5,
        fill: ev.tipo === "merge" ? "var(--bg-2)" : cor, stroke: cor, "stroke-width": ev.tipo === "merge" ? 3 : 0,
      }));
      var texto = s("text", { x: xTexto, y: y, "dominant-baseline": "central" });
      var ano = s("tspan", { class: "gc-ano" }); ano.textContent = ev.data.slice(0, 4) + " ";
      var rot = s("tspan", { class: ev.tipo === "merge" ? "gc-merge" : "" }); rot.textContent = ev.rotulo;
      texto.appendChild(ano); texto.appendChild(rot);
      if (i === 0) { var ref = s("tspan", { class: "gc-ref" }); ref.textContent = " HEAD"; texto.appendChild(ref); }
      g.appendChild(texto);
      svg.appendChild(g);
    });

    fig.appendChild(svg);
    fig.hidden = false;
    desenharUmaVez(fig);
  }

  // Marca o elemento para animar e dispara uma única vez quando ele aparece na tela
  function desenharUmaVez(el) {
    if (reduzirMovimento || !("IntersectionObserver" in window)) return;
    el.classList.add("armado");
    var io = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      io.disconnect();
      el.classList.add("desenhado");
    }, { threshold: 0.3 });
    io.observe(el);
  }

  /* ============================================================
     Experiência e formação (git log)
     ============================================================ */
  // Anos completos desde o primeiro emprego
  function anosDeCarreira() {
    var inicios = (D.experiencia || []).map(function (e) { return e.inicio; }).filter(Boolean).sort();
    if (!inicios.length) return 0;
    var p = inicios[0].split("-");
    var hoje = new Date();
    var meses = (hoje.getFullYear() - parseInt(p[0], 10)) * 12 + (hoje.getMonth() + 1 - parseInt(p[1], 10));
    return Math.max(0, Math.floor(meses / 12));
  }

  function montarExperiencia() {
    var secao = $("#experiencia");
    var exp = D.experiencia || [];
    var form = D.formacao || [];
    if (!exp.length && !form.length) {
      secao.remove();
      $$('.nav a[href="#experiencia"]').forEach(function (a) { a.parentNode.remove(); });
      return;
    }

    var lista = $("#lista-exp");
    lista.textContent = ""; // tira a versão pré-renderizada pelo build
    exp.forEach(function (e, i) {
      var atual = !e.fim;
      lista.appendChild(h("li", { class: "commit", style: "--cor: var(" + CORES_ROTACAO[i % CORES_ROTACAO.length] + ")" },
        h("p", { class: "commit-meta mono" },
          h("span", { class: "amarelo", text: "commit " + hashCurto(e.empresa + e.inicio) }),
          atual ? h("span", { class: "ref ref-atual" }, h("i", { class: "pulso", "aria-hidden": "true" }), "(HEAD → main)") : null,
          h("span", { class: "commit-data" }, periodo(e.inicio, e.fim),
            h("span", { class: "commit-duracao", text: " · " + duracao(e.inicio, e.fim) }))),
        h("h3", null, e.cargo, h("span", { class: "commit-empresa", text: " @ " + e.empresa })),
        e.local ? h("p", { class: "commit-local mono", text: e.local }) : null,
        e.resumo ? h("p", { class: "commit-resumo", text: e.resumo }) : null,
        (e.destaques || []).length ? h("ul", { class: "commit-itens" }, e.destaques.map(function (d) { return h("li", { text: d }); })) : null,
        (e.stack || []).length ? h("div", { class: "tag-skills" }, e.stack.map(function (t) { return h("span", { text: t }); })) : null));
    });

    if (form.length) {
      $("#bloco-formacao").hidden = false;
      var listaForm = $("#lista-form");
      listaForm.textContent = "";
      form.forEach(function (f) {
        listaForm.appendChild(h("li", { class: "commit", style: "--cor: var(--ambar)" },
          h("p", { class: "commit-meta mono" },
            h("span", { class: "amarelo", text: "commit " + hashCurto(f.instituicao + f.curso) }),
            h("span", { class: "commit-data", text: periodo(f.inicio, f.fim) })),
          h("h3", null, f.curso, h("span", { class: "commit-empresa", text: " @ " + f.instituicao }))));
      });
    }
  }

  /* ============================================================
     Filtros (chips)
     ============================================================ */
  function montarFiltros(container, opcoes, aoMudar) {
    var atual = "todos";
    function chip(valor, rotulo) {
      return h("button", {
        class: "chip", type: "button", "aria-pressed": valor === atual ? "true" : "false", text: rotulo,
        onclick: function () {
          atual = valor;
          $$(".chip", container).forEach(function (c) { c.setAttribute("aria-pressed", c === this ? "true" : "false"); }, this);
          aoMudar(valor);
        },
      });
    }
    container.appendChild(chip("todos", tx("todos")));
    opcoes.forEach(function (o) { container.appendChild(chip(o, o)); });
  }

  function frequencia(listas, limite) {
    var conta = {};
    listas.forEach(function (l) { (l || []).forEach(function (x) { conta[x] = (conta[x] || 0) + 1; }); });
    return Object.keys(conta).sort(function (a, b) { return conta[b] - conta[a] || a.localeCompare(b); }).slice(0, limite);
  }

  /* ============================================================
     Certificados
     ============================================================ */
  function montarCertificados() {
    var lista = $("#lista-cert");
    var certs = D.certificados.slice().sort(function (a, b) { return String(a.data).localeCompare(String(b.data)); });
    // Versões em ordem de data: o mais antigo é v1.0.0
    certs.forEach(function (c, i) { c._versao = "v1." + i + ".0"; c._cor = CORES_ROTACAO[i % CORES_ROTACAO.length]; });
    certs.reverse();

    // Se os certificados têm `categoria`, os filtros são por categoria; senão, por habilidade
    var porCategoria = certs.some(function (c) { return !!c.categoria; });

    if (!certs.length) {
      lista.replaceWith(h("p", { class: "vazio", text: tx("fatal: No names found, cannot describe anything. (nenhum certificado ainda)") }));
      return;
    }

    function render(filtro) {
      lista.textContent = "";
      certs.filter(function (c) { return filtro === "todos" || (porCategoria ? c.categoria === filtro : (c.skills || []).indexOf(filtro) >= 0); })
        .forEach(function (c) {
          var temLink = !!c.url;
          var corpo = [
            h("div", { class: "tag-topo" },
              h("span", { class: "tag-versao", text: c._versao }),
              c.exemplo ? h("span", { class: "selo-exemplo", text: tx("exemplo") }) : null,
              h("span", { class: "tag-data", text: formatarMes(c.data) })),
            h("h3", { text: c.titulo }),
            h("p", { class: "tag-emissor", text: c.emissor }),
            h("div", { class: "tag-skills" }, (c.skills || []).map(function (s) { return h("span", { text: s }); })),
            h("span", { class: "tag-verificar" + (temLink ? "" : " sem-link"), text: temLink ? tx("verificar →") : tx("link em breve") }),
          ];
          var cartao = temLink
            ? h("a", { class: "tag", href: c.url, target: "_blank", rel: "noopener noreferrer", style: "--cor: var(" + c._cor + ")", "aria-label": tx("{titulo}, {emissor} — verificar certificado", { titulo: c.titulo, emissor: c.emissor }) }, corpo)
            : h("div", { class: "tag", style: "--cor: var(" + c._cor + ")" }, corpo);
          var item = h("li", null, cartao);
          lista.appendChild(item);
          animarEntrada(item, "card");
        });
    }

    var categorias = [];
    D.certificados.forEach(function (c) { if (c.categoria && categorias.indexOf(c.categoria) < 0) categorias.push(c.categoria); });
    var opcoes = porCategoria ? categorias : frequencia(certs.map(function (c) { return c.skills; }), 8);
    if (opcoes.length > 1) montarFiltros($("#filtros-cert"), opcoes, render);
    render("todos");
  }

  /* ============================================================
     Projetos
     ============================================================ */
  function barraLinguagens(linguagens) {
    var nomes = Object.keys(linguagens || {});
    if (!nomes.length) return null;
    var cor = function (n) { return "var(" + (CORES_LINGUAGEM[n] || "--ceu") + ")"; };
    return h("div", null,
      h("div", { class: "lang-barra", role: "img", "aria-label": nomes.map(function (n) { return n + " " + linguagens[n] + "%"; }).join(", ") },
        nomes.map(function (n) { return h("span", { style: "width:" + linguagens[n] + "%;background:" + cor(n) }); })),
      h("div", { class: "lang-legenda", style: "margin-top:8px", "aria-hidden": "true" },
        nomes.map(function (n) { return h("span", null, h("i", { style: "background:" + cor(n) }), n + " " + linguagens[n] + "%"); })));
  }

  // Página própria de cada projeto, gerada pelo build em /projetos/<slug>
  function urlProjeto(p) {
    var slug = p.slug || p.nome.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return I.prefixo + "/projetos/" + slug;
  }

  function botoesProjeto(p, comReadme) {
    return h("div", { class: "repo-acoes" },
      comReadme ? h("button", { class: "btn-peq", type: "button", html: ICONES.livro + " README", onclick: function () { abrirProjeto(p); } }) : null,
      p.repo ? h("a", { class: "btn-peq", href: p.repo, target: "_blank", rel: "noopener noreferrer", html: ICONES.github + " " + tx("código") }) : null,
      // Demo no ar (site): mesmo botão de destaque da apresentação, abrindo em outra aba
      p.demo ? h("a", { class: "btn-peq btn-demo", href: p.demo, target: "_blank", rel: "noopener noreferrer", html: ICONES.play + " demo", "aria-label": tx("Abrir a demonstração do {nome} (nova aba)", { nome: p.nome }) }) : null,
      // Sistema desktop não roda no navegador: a demo é o vídeo e o tour pelas telas
      comReadme && !p.demo && p.apresentacao ? h("button", { class: "btn-peq btn-demo", type: "button", html: ICONES.play + " demo", "aria-label": tx("Ver a demonstração do {nome}", { nome: p.nome }), onclick: function () { abrirProjeto(p, true); } }) : null);
  }

  // Link direto para a demo: www.alexmatias.dev.br/#demo-gestaocomercial
  function abrirDemoPeloEndereco() {
    var m = /^#demo-(.+)$/i.exec(location.hash);
    if (!m) return;
    var alvo = decodeURIComponent(m[1]).toLowerCase();
    var p = D.projetos.filter(function (x) { return x.apresentacao && x.nome.toLowerCase() === alvo; })[0];
    if (!p) return;
    var secao = $("#projetos");
    if (secao) secao.scrollIntoView();
    abrirProjeto(p, true);
    limparEndereco(); // o link funciona, mas a barra de endereço fica limpa
  }

  function montarProjetos() {
    var lista = $("#lista-proj");
    var projetos = D.projetos.slice().sort(function (a, b) { return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0); });

    function render(filtro) {
      lista.textContent = "";
      projetos.filter(function (p) { return filtro === "todos" || (p.tags || []).indexOf(filtro) >= 0; })
        .forEach(function (p) {
          var card = h("article", { class: "repo" + (p.destaque ? " destaque" : "") },
            h("div", { class: "repo-cab" },
              h("span", { html: ICONES.repo }),
              h("h3", null, h("a", { href: urlProjeto(p), text: p.nome })),
              h("span", { class: "repo-visib", text: p.repo ? tx("público") : tx("privado") })),
            h("p", { class: "repo-resumo", text: p.resumo }),
            barraLinguagens(p.linguagens),
            h("div", { class: "repo-tags" }, (p.tags || []).map(function (t) { return h("span", { text: t }); })),
            botoesProjeto(p, true));
          card.addEventListener("pointermove", function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty("--mx", (e.clientX - r.left) + "px");
            card.style.setProperty("--my", (e.clientY - r.top) + "px");
          });
          lista.appendChild(card);
          animarEntrada(card, "card");
        });
    }

    var tags = frequencia(projetos.map(function (p) { return p.tags; }), 8);
    if (tags.length > 1) montarFiltros($("#filtros-proj"), tags, render);
    render("todos");
  }

  // Vídeo de apresentação e tour pelas telas (só para projetos com `apresentacao`).
  // O vídeo começa pausado e só baixa quando a pessoa aperta o play (até lá, só a capa);
  // as telas são imagens que abrem ampliadas numa galeria (setas, teclado e arrastar no celular).
  function montarApresentacao(a) {
    var pasta = a.pasta || "";
    var frag = document.createDocumentFragment();
    frag.appendChild(h("h4", { id: "proj-apresentacao", text: tx("## Apresentação") }));
    var video = h("video", {
      class: "proj-video", src: pasta + a.video, poster: a.capa ? pasta + a.capa : null,
      controls: true, playsinline: true, preload: "none",
      "aria-label": tx("Vídeo de apresentação do sistema"),
    });
    frag.appendChild(video);

    frag.appendChild(h("h4", { text: tx("## Tour pelas telas") }));
    if (a.intro) frag.appendChild(h("p", { class: "tour-intro", text: a.intro }));

    var lista = h("ol", { class: "tour" });
    a.telas.forEach(function (t, i) {
      var num = String(i + 1).padStart(2, "0");
      lista.appendChild(h("li", { class: "tela" },
        h("button", {
          type: "button", class: "tela-img", "aria-label": tx("Ampliar: {titulo}", { titulo: t.titulo }),
          onclick: function () { abrirGaleria(a, i); },
        },
          h("img", { src: pasta + "telas/mini/" + t.arquivo + ".webp", alt: t.titulo, loading: "lazy", width: 720, height: 405 }),
          h("span", { class: "tela-zoom", "aria-hidden": "true", html: ICONES.zoom })),
        h("div", { class: "tela-txt" },
          h("b", null, h("span", { class: "tela-num mono", text: num }), t.titulo),
          h("span", { text: t.texto }))));
    });
    frag.appendChild(lista);
    return frag;
  }

  function pararVideosProjeto() {
    $$("#modal-conteudo video").forEach(function (v) { v.pause(); });
  }

  /* --- Galeria: tela ampliada com anterior/próxima --- */
  var galeria = { a: null, i: 0 };

  function mostrarTela(i) {
    var a = galeria.a, total = a.telas.length;
    galeria.i = (i + total) % total;
    var t = a.telas[galeria.i];
    var img = $("#galeria-img");
    img.classList.remove("zoom");
    img.src = (a.pasta || "") + "telas/" + t.arquivo + ".jpg";
    img.alt = t.titulo;
    $("#galeria-num").textContent = String(galeria.i + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    $("#galeria-titulo").textContent = t.titulo;
    $("#galeria-texto").textContent = t.texto;
    $("#galeria-quadro").scrollTo(0, 0);
    // Pré-carrega as vizinhas para a troca ser instantânea
    [galeria.i + 1, galeria.i - 1].forEach(function (k) {
      var viz = a.telas[(k + total) % total];
      new Image().src = (a.pasta || "") + "telas/" + viz.arquivo + ".jpg";
    });
  }

  function abrirGaleria(a, i) {
    galeria.a = a;
    mostrarTela(i);
    abrirDialogo($("#galeria"));
    rastrear("ver_tela", { tela: a.telas[i].titulo });
  }

  function prepararGaleria() {
    var dlg = $("#galeria");
    if (!dlg) return;
    $("#galeria-ant").addEventListener("click", function () { mostrarTela(galeria.i - 1); });
    $("#galeria-prox").addEventListener("click", function () { mostrarTela(galeria.i + 1); });
    // Clique na imagem alterna entre caber na tela e o tamanho real (com rolagem)
    $("#galeria-img").addEventListener("click", function () { this.classList.toggle("zoom"); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); mostrarTela(galeria.i + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); mostrarTela(galeria.i - 1); }
    });
    // Arrastar para o lado no celular
    var x0 = null;
    dlg.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") x0 = e.clientX; });
    dlg.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50 && !$("#galeria-img").classList.contains("zoom")) mostrarTela(galeria.i + (dx < 0 ? 1 : -1));
    });
  }

  function abrirProjeto(p, irParaApresentacao) {
    rastrear(irParaApresentacao ? "ver_apresentacao" : "ver_readme", { projeto: p.nome });
    var alvo = $("#modal-conteudo");
    pararVideosProjeto();
    alvo.textContent = "";
    $("#modal-proj").classList.toggle("modal-largo", !!p.apresentacao);
    alvo.appendChild(h("h3", { id: "modal-titulo", text: "# " + p.nome }));
    alvo.appendChild(h("p", { text: p.resumo }));
    if (p.apresentacao) alvo.appendChild(montarApresentacao(p.apresentacao));
    if (p.detalhes && p.detalhes.length) {
      alvo.appendChild(h("h4", { text: tx("## Destaques") }));
      alvo.appendChild(h("ul", null, p.detalhes.map(function (d) { return h("li", { text: d }); })));
    }
    if (p.tags && p.tags.length) {
      alvo.appendChild(h("h4", { text: "## Stack" }));
      alvo.appendChild(h("div", { class: "repo-tags" }, p.tags.map(function (t) { return h("span", { text: t }); })));
    }
    var barra = barraLinguagens(p.linguagens);
    if (barra) {
      alvo.appendChild(h("h4", { text: tx("## Linguagens") }));
      alvo.appendChild(barra);
    }
    if (!p.repo) alvo.appendChild(h("p", { class: "mono", style: "margin-top:18px;font-size:13px;color:var(--texto-3)", text: tx("Repositório privado. Código disponível sob consulta.") }));
    alvo.appendChild(botoesProjeto(p, false));
    alvo.appendChild(h("p", { class: "modal-pagina" }, h("a", { href: urlProjeto(p), text: tx("Ver a página completa do projeto →") })));
    var modal = $("#modal-proj");
    if (!modal.dataset.pararVideos) {
      modal.addEventListener("close", pararVideosProjeto);
      modal.dataset.pararVideos = "1";
    }
    abrirDialogo(modal);
    alvo.scrollTop = 0;
    var ancora = irParaApresentacao && $("#proj-apresentacao");
    if (ancora) alvo.scrollTop = ancora.getBoundingClientRect().top - alvo.getBoundingClientRect().top - 12;
  }

  /* ============================================================
     Animação de entrada dos cards
     ------------------------------------------------------------
     Os cards que entram na tela juntos surgem em cascata, na
     ordem em que aparecem (esquerda → direita, cima → baixo).
     Só `opacity` e `transform` são animados, então o navegador
     resolve tudo na placa de vídeo, sem recalcular o layout.
     Ao terminar, as classes saem e o card volta ao normal (o
     hover continua funcionando). Vale também para os cards
     recriados pelos filtros.
     ============================================================ */
  var observadorCards = null;
  var PASSO_CASCATA = 75;   // ms entre um card e o próximo
  var MAX_CASCATA = 7;      // a partir daqui todos entram juntos, para não demorar

  var observadorSaida = null;

  // Deixa o card pronto para animar: invisível, abaixo e com o brilho
  function armar(el) {
    if (el.classList.contains("anima")) return;
    el.classList.add("anima", "anima-" + el.dataset.anima);
    if (el.dataset.anima === "card") ($(".tag", el) || el).appendChild(h("span", { class: "anima-brilho", "aria-hidden": "true" }));
  }

  function desarmar(el) {
    el.classList.remove("anima", "anima-card", "anima-commit", "anima-ativa");
    el.style.removeProperty("--atraso");
    var brilho = $(".anima-brilho", el);
    if (brilho) brilho.remove();
  }

  function animarEntrada(el, tipo) {
    if (reduzirMovimento || !("IntersectionObserver" in window)) return;
    if (!observadorCards) {
      // Entrada: card entrou na tela → anima (em cascata com os que entraram junto)
      observadorCards = new IntersectionObserver(function (entradas) {
        entradas.filter(function (e) { return e.isIntersecting && e.target.classList.contains("anima") && !e.target.classList.contains("anima-ativa"); })
          .map(function (e) { return { alvo: e.target, r: e.boundingClientRect }; })
          // Ordem visual: linha por linha, da esquerda para a direita
          .sort(function (a, b) { return Math.round(a.r.top / 40) - Math.round(b.r.top / 40) || a.r.left - b.r.left; })
          .forEach(function (item, i) {
            item.alvo.style.setProperty("--atraso", Math.min(i, MAX_CASCATA) * PASSO_CASCATA + "ms");
            item.alvo.classList.add("anima-ativa");
          });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

      // Saída: card saiu da tela por BAIXO (a pessoa rolou para cima) → arma de novo,
      // para animar outra vez quando ela descer. Saindo por cima, fica como está.
      observadorSaida = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting && e.boundingClientRect.top > 0) {
            desarmar(e.target);
            armar(e.target);
          }
        });
      }, { threshold: 0 });
    }
    el.dataset.anima = tipo;
    armar(el);
    el.addEventListener("animationend", function (e) {
      if (e.target === el) desarmar(el); // ignora as animações internas (barra, brilho)
    });
    observadorCards.observe(el);
    observadorSaida.observe(el);
  }

  /* ============================================================
     Diálogos (modal e paleta)
     ============================================================ */
  function abrirDialogo(dlg) {
    if (dlg.open) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  }
  function fecharDialogo(dlg) {
    if (typeof dlg.close === "function") dlg.close();
    else dlg.removeAttribute("open");
  }
  function prepararDialogos() {
    $$("dialog").forEach(function (dlg) {
      // Clique fora do conteúdo fecha
      // `data-travado` impede fechar enquanto algo está sendo enviado
      dlg.addEventListener("click", function (e) { if (e.target === dlg && !dlg.dataset.travado) fecharDialogo(dlg); });
      $$("[data-fechar]", dlg).forEach(function (b) { b.addEventListener("click", function () { if (!dlg.dataset.travado) fecharDialogo(dlg); }); });
    });
  }

  /* ============================================================
     Contato
     ============================================================ */
  var EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function montarContato() {
    var c = D.contato;
    var ul = $("#canais");

    // `copia` (opcional): { texto, aviso } mostra um botão de copiar no canto do card
    function canal(icone, rotulo, valor, attrs, copia) {
      var tag = attrs.href ? "a" : "button";
      if (tag === "button") attrs.type = "button";
      attrs.class = "canal" + (copia ? " canal-com-copiar" : "");
      attrs.html = icone;
      var el = h(tag, attrs);
      el.appendChild(h("span", { class: "canal-txt" }, h("b", { text: rotulo }), h("span", { text: valor })));
      var li = h("li", null, el);
      if (copia) {
        var botao = h("button", {
          type: "button", class: "canal-copiar", html: ICONES.copiar,
          "aria-label": tx("Copiar {rotulo}", { rotulo: rotulo }), "data-dica": tx("copiar"),
          onclick: function () {
            copiar(copia.texto, copia.aviso);
            rastrear("copiar_contato", { canal: rotulo });
            botao.innerHTML = ICONES.check;
            botao.classList.add("copiado");
            botao.setAttribute("data-dica", tx("copiado!"));
            clearTimeout(botao._t);
            botao._t = setTimeout(function () {
              botao.innerHTML = ICONES.copiar;
              botao.classList.remove("copiado");
              botao.setAttribute("data-dica", tx("copiar"));
            }, 1800);
          },
        });
        li.appendChild(botao);
      }
      ul.appendChild(li);
    }

    if (c.email) canal(ICONES.email, "email", c.email, { href: "mailto:" + c.email }, { texto: c.email, aviso: tx("E-mail copiado!") });
    if (c.github) canal(ICONES.github, "origin", c.github.replace(/^https?:\/\/(www\.)?/, ""), { href: c.github, target: "_blank", rel: "noopener noreferrer" }, { texto: c.github, aviso: tx("Link do GitHub copiado!") });
    if (c.linkedin) canal(ICONES.linkedin, "linkedin", c.linkedin.replace(/^https?:\/\/(www\.)?/, ""), { href: c.linkedin, target: "_blank", rel: "noopener noreferrer" }, { texto: c.linkedin, aviso: tx("Link do LinkedIn copiado!") });
    if (c.instagram) canal(ICONES.instagram, "instagram", "@" + c.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/+$/, ""), { href: c.instagram, target: "_blank", rel: "noopener noreferrer" });
    if (c.whatsapp) {
      var num = String(c.whatsapp).replace(/\D/g, "");
      canal(ICONES.whatsapp, "whatsapp", tx("mandar mensagem"), { href: "https://wa.me/" + num + (c.whatsappMensagem ? "?text=" + encodeURIComponent(c.whatsappMensagem) : ""), target: "_blank", rel: "noopener noreferrer" });
    }
    if (!ul.children.length) ul.appendChild(h("li", { class: "mono", style: "color:var(--texto-3);font-size:13px", text: tx("Nenhum canal configurado em js/data.js") }));

    var form = $("#form-pr");
    var campos = { nome: $("#pr-nome"), email: $("#pr-email"), titulo: $("#pr-titulo"), mensagem: $("#pr-msg") };
    var regras = {
      nome: function (v) { return v.trim().length >= 2; },
      email: function (v) { return EMAIL_OK.test(v.trim()); },
      titulo: function (v) { return v.trim().length >= 3; },
      mensagem: function (v) { return v.trim().length >= 10; },
    };
    var tentou = false;

    function verificar() {
      var tudoOk = true;
      Object.keys(regras).forEach(function (k) {
        var ok = regras[k](campos[k].value);
        var linha = $('[data-check="' + k + '"]', form);
        linha.classList.toggle("ok", ok);
        linha.classList.toggle("falhou", !ok && tentou);
        campos[k].setAttribute("aria-invalid", !ok && tentou ? "true" : "false");
        if (!ok) tudoOk = false;
      });
      var primeiroNome = campos.nome.value.trim().split(/\s+/)[0];
      $("#pr-saudacao").textContent = (primeiroNome ? tx("Olá, {nome}! ", { nome: primeiroNome }) : "") + tx("Sua mensagem chega direto no meu e-mail, e eu respondo pessoalmente.");
      return tudoOk;
    }

    form.addEventListener("input", verificar);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tentou = true;
      var status = $("#pr-status");
      if (!verificar()) {
        status.textContent = tx("✗ Alguns checks falharam. Confira os campos marcados.");
        var primeiro = Object.keys(regras).filter(function (k) { return !regras[k](campos[k].value); })[0];
        if (primeiro) campos[primeiro].focus();
        return;
      }
      if (!c.email) {
        status.textContent = tx("✗ O e-mail de destino ainda não foi configurado em js/data.js.");
        return;
      }
      // Robô preencheu o campo invisível: finge que deu certo e não envia nada
      if ($("#pr-site").value) { status.textContent = tx("✓ Mensagem enviada."); form.reset(); return; }

      status.textContent = "";
      revisarPR({
        nome: campos.nome.value.trim(),
        email: campos.email.value.trim(),
        titulo: campos.titulo.value.trim(),
        mensagem: campos.mensagem.value.trim(),
      });
    });

    /* --- Confirmação do envio, em três telas no mesmo diálogo: revisar → enviando → resultado --- */
    var dlg = $("#modal-pr");
    var corpoDlg = $("#pr-modal-conteudo");
    var barraDlg = $("#pr-modal-barra");
    // Durante o envio, Esc, o X e o clique fora não fecham o diálogo
    function travar(sim) { if (sim) dlg.dataset.travado = "1"; else delete dlg.dataset.travado; }
    dlg.addEventListener("cancel", function (e) { if (dlg.dataset.travado) e.preventDefault(); });

    function tela(titulo) {
      barraDlg.textContent = titulo;
      corpoDlg.textContent = "";
      for (var i = 1; i < arguments.length; i++) if (arguments[i]) corpoDlg.appendChild(arguments[i]);
    }

    function botaoAcao(texto, classe, aoClicar) {
      return h("button", { type: "button", class: "btn " + classe, text: texto, onclick: aoClicar });
    }

    function revisarPR(msg) {
      var numero = Math.floor(Math.random() * 90) + 10;
      tela(tx("Revisar pull request"),
        h("p", { class: "pr-rev-cab mono" },
          h("span", { class: "pr-badge", text: "● Open" }),
          h("span", { text: tx(" #{numero} · de {nome} para ", { numero: numero, nome: msg.nome }) }),
          h("code", { text: "alex:main" })),
        h("h3", { class: "pr-rev-titulo", id: "pr-modal-titulo", text: msg.titulo }),
        h("dl", { class: "pr-rev-dados" },
          h("div", null, h("dt", { text: tx("de") }), h("dd", { text: msg.nome + " <" + msg.email + ">" })),
          h("div", null, h("dt", { text: tx("para") }), h("dd", { text: "Alex Matias" }))),
        h("div", { class: "pr-rev-diff mono", "aria-label": tx("Mensagem") },
          msg.mensagem.split("\n").map(function (l) { return h("p", { text: "+ " + l }); })),
        h("p", { class: "pr-rev-aviso", text: tx("Confira se o seu e-mail está certo: é por ele que eu vou responder.") }),
        h("div", { class: "pr-rev-acoes" },
          botaoAcao(tx("Voltar e editar"), "btn-secundario", function () { fecharDialogo(dlg); campos.mensagem.focus(); }),
          botaoAcao(tx("Confirmar e enviar"), "btn-primario", function () { enviarPR(msg, numero); })));
      abrirDialogo(dlg);
      var confirmar = $(".pr-rev-acoes .btn-primario", corpoDlg);
      if (confirmar) confirmar.focus();
    }

    function enviarPR(msg, numero) {
      travar(true);
      tela(tx("Enviando…"),
        h("div", { class: "pr-enviando", role: "status" },
          h("span", { class: "pr-spinner", "aria-hidden": "true" }),
          h("p", { class: "mono", text: "git push origin pr/" + numero }),
          h("p", { class: "pr-rev-aviso", text: tx("Enviando sua mensagem, só um instante.") })));

      // FormSubmit: envia o formulário para o e-mail sem precisar de servidor próprio
      fetch("https://formsubmit.co/ajax/" + (c.formsubmitId || c.email), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: msg.nome,
          email: msg.email,
          _replyto: msg.email,
          _subject: "[Portfólio] " + msg.titulo,
          message: msg.mensagem,
          _template: "box",
          _captcha: "false",
        }),
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || String(j.success) !== "true") throw new Error(j.message || "falha no envio");
          });
        })
        .then(function () {
          travar(false);
          rastrear("generate_lead", { metodo: "formulario_contato" });
          form.reset();
          tentou = false;
          verificar();
          $("#pr-status").textContent = tx("✓ PR #{numero} enviado. Obrigado pelo contato!", { numero: numero });
          tela("Pull request merged",
            h("div", { class: "pr-sucesso", role: "status" },
              h("span", { class: "pr-sucesso-ico", "aria-hidden": "true", text: "✓" }),
              h("h3", { id: "pr-modal-titulo", text: tx("Mensagem enviada!") }),
              h("p", { class: "mono pr-merged", text: "PR #" + numero + " merged into alex:main" }),
              h("p", { text: tx("Obrigado, {nome}. Recebi sua mensagem e vou responder em {email}.", { nome: msg.nome.split(/\s+/)[0], email: msg.email }) })),
            h("div", { class: "pr-rev-acoes" },
              botaoAcao(tx("Fechar"), "btn-primario", function () { fecharDialogo(dlg); })));
          var fechar = $(".pr-rev-acoes .btn-primario", corpoDlg);
          if (fechar) fechar.focus();
        })
        .catch(function () {
          travar(false);
          // Alternativa: o próprio visitante envia pelo app de e-mail (só abre com o clique dele)
          var corpo = msg.mensagem + "\n\n— " + msg.nome + " <" + msg.email + ">";
          var mailto = "mailto:" + c.email + "?subject=" + encodeURIComponent("[Portfólio] " + msg.titulo) + "&body=" + encodeURIComponent(corpo);
          tela(tx("Falha no envio"),
            h("div", { class: "pr-sucesso pr-falha", role: "alert" },
              h("span", { class: "pr-sucesso-ico", "aria-hidden": "true", text: "✗" }),
              h("h3", { id: "pr-modal-titulo", text: tx("Não consegui enviar agora") }),
              h("p", { text: tx("Sua mensagem não se perdeu: ela continua no formulário. Tente de novo ou envie pelo seu e-mail.") })),
            h("div", { class: "pr-rev-acoes" },
              h("a", { class: "btn btn-secundario", href: mailto, text: tx("Enviar pelo meu e-mail") }),
              botaoAcao(tx("Tentar de novo"), "btn-primario", function () { enviarPR(msg, numero); })));
        });
    }
  }

  /* ============================================================
     Tema
     ============================================================ */
  function temaAtual() {
    var t = document.documentElement.dataset.tema;
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "escuro";
  }
  function alternarTema() {
    var novo = temaAtual() === "claro" ? "escuro" : "claro";
    document.documentElement.dataset.tema = novo;
    try { localStorage.setItem("tema", novo); } catch (e) { /* sem armazenamento */ }
    atualizarCorTema();
    document.dispatchEvent(new Event("tema-alterado"));
    toast(tx("tema: {tema}", { tema: tx(novo) }));
  }
  function atualizarCorTema() {
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", corVar("--bg"));
  }

  /* ============================================================
     Rolagem: topo, trilho lateral, nav ativa e revelação
     ============================================================ */
  function prepararRolagem() {
    var secoes = $$("main .secao");
    var topo = $(".topo");
    var trilhoNos = $("#trilho-nos");
    var progresso = $("#trilho-progresso");
    var links = $$(".nav a");

    // Cada ponto do trilho é um botão que leva até a seção
    var nos = secoes.map(function (s) {
      var titulo = $("h1 #hero-nome, h2", s);
      var nome = s.id === "inicio" ? tx("Início") : (titulo ? titulo.textContent.trim() : s.id);
      var botao = h("button", {
        type: "button", class: "trilho-no", "aria-label": tx("Ir para {nome}", { nome: nome }), title: nome,
        onclick: function () { irPara(s.id); },
      }, h("span", { text: s.getAttribute("data-commit") }));
      var li = h("li", null, botao);
      trilhoNos.appendChild(li);
      return li;
    });

    function posicionarNos() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      secoes.forEach(function (s, i) {
        var frac = total > 0 ? Math.min(1, s.offsetTop / total) : 0;
        nos[i].style.top = (frac * 100) + "%";
      });
    }

    var pendente = false;
    function aoRolar() {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(function () {
        pendente = false;
        var y = window.scrollY;
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var frac = total > 0 ? Math.min(1, y / total) : 0;
        progresso.style.transform = "scaleY(" + frac + ")";
        topo.classList.toggle("rolou", y > 8);

        // Seção atual: a última cujo topo passou de 40% da tela
        var atual = 0;
        secoes.forEach(function (s, i) { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) atual = i; });
        if (y >= total - 2) atual = secoes.length - 1;
        nos.forEach(function (li, i) {
          li.classList.toggle("passou", i <= atual);
          li.classList.toggle("atual", i === atual);
          var b = li.firstChild;
          if (i === atual) b.setAttribute("aria-current", "location"); else b.removeAttribute("aria-current");
        });
        var id = secoes[atual].id;
        links.forEach(function (a) {
          var ativo = a.getAttribute("href") === "#" + id;
          a.classList.toggle("ativo", ativo);
          if (ativo) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }

    posicionarNos();
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", function () { posicionarNos(); aoRolar(); });
    window.addEventListener("load", posicionarNos);

    // Revelação dos blocos ao entrar na tela
    // (os cards têm animação própria, em animarEntrada)
    $$(".commit").forEach(function (el) { animarEntrada(el, "commit"); });
    var alvos = $$(".secao-cab, .git-show, .pr, .canais, .filtros");
    if (reduzirMovimento || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        io.unobserve(e.target);
        var alvo = e.target;
        setTimeout(function () { alvo.style.transitionDelay = ""; }, 1000);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    alvos.forEach(function (el, i) {
      el.classList.add("revelar");
      el.style.transitionDelay = ((i % 3) * 70) + "ms";
      io.observe(el);
    });
    // Itens recriados pelos filtros são elementos novos, sem .revelar: já entram visíveis
  }

  /* ============================================================
     Paleta de comandos (Ctrl+K)
     ============================================================ */
  function prepararPaleta() {
    var dlg = $("#paleta");
    var input = $("#paleta-input");
    var lista = $("#paleta-lista");
    var selecionado = 0;
    var filtrados = [];

    function ir(id) { return function () { irPara(id); }; }
    var comandos = [
      { rotulo: tx("Ir para o início"), dica: "git checkout main", acao: ir("inicio") },
      { rotulo: tx("Ir para sobre"), dica: tx("git show sobre"), acao: ir("sobre") },
      { rotulo: tx("Ir para experiência (carreira)"), dica: "git log", acao: ir("experiencia") },
      { rotulo: tx("Ir para certificados"), dica: "git tag", acao: ir("certificados") },
      { rotulo: tx("Ir para projetos"), dica: "ls ~/repos", acao: ir("projetos") },
      { rotulo: tx("Ir para contato"), dica: "gh pr create", acao: ir("contato") },
      { rotulo: tx("Alternar tema claro/escuro"), dica: tx("tema"), acao: alternarTema },
    ];
    // Trocar de idioma: vai para esta página no outro idioma e guarda a escolha
    var outroIdioma = I.idioma === "en" ? "pt" : "en";
    var linkOutro = document.querySelector('link[rel="alternate"][hreflang="' + (outroIdioma === "en" ? "en" : "pt-BR") + '"]');
    if (linkOutro) comandos.push({
      rotulo: outroIdioma === "en" ? tx("Ler em inglês") : tx("Ler em português"), dica: "git checkout " + outroIdioma,
      acao: function () {
        try { localStorage.setItem("idioma", outroIdioma); } catch (e) { /* sem armazenamento */ }
        location.href = new URL(linkOutro.href).pathname;
      },
    });
    if (D.contato.email) comandos.push({ rotulo: tx("Copiar e-mail"), dica: D.contato.email, acao: function () { copiar(D.contato.email, tx("E-mail copiado!")); } });
    if (D.contato.github) comandos.push({ rotulo: tx("Abrir GitHub"), dica: "git remote -v", acao: function () { window.open(D.contato.github, "_blank", "noopener"); } });
    if (D.contato.linkedin) comandos.push({ rotulo: tx("Abrir LinkedIn"), dica: "linkedin", acao: function () { window.open(D.contato.linkedin, "_blank", "noopener"); } });
    if (D.contato.instagram) comandos.push({ rotulo: tx("Abrir Instagram"), dica: "instagram", acao: function () { window.open(D.contato.instagram, "_blank", "noopener"); } });
    D.projetos.forEach(function (p) {
      comandos.push({ rotulo: "README: " + p.nome, dica: "cat " + p.nome + "/README.md", acao: function () { abrirProjeto(p); } });
    });

    function normalizar(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

    function render() {
      var q = normalizar(input.value.trim());
      filtrados = comandos.filter(function (c) { return !q || normalizar(c.rotulo + " " + c.dica).indexOf(q) >= 0; });
      selecionado = Math.min(selecionado, Math.max(0, filtrados.length - 1));
      lista.textContent = "";
      if (!filtrados.length) {
        lista.appendChild(h("li", { class: "nada", text: tx("comando não encontrado: {q}", { q: input.value }) }));
        input.removeAttribute("aria-activedescendant");
        return;
      }
      filtrados.forEach(function (c, i) {
        lista.appendChild(h("li", {
          id: "cmd-" + i, role: "option", "aria-selected": i === selecionado ? "true" : "false",
          onclick: function () { executar(i); },
          onmousemove: function () { if (selecionado !== i) { selecionado = i; marcar(); } },
        }, h("span", { text: c.rotulo }), h("small", { text: c.dica })));
      });
      input.setAttribute("aria-activedescendant", "cmd-" + selecionado);
    }

    function marcar() {
      $$("li[role=option]", lista).forEach(function (li, i) { li.setAttribute("aria-selected", i === selecionado ? "true" : "false"); });
      var atual = $("#cmd-" + selecionado);
      if (atual) { atual.scrollIntoView({ block: "nearest" }); input.setAttribute("aria-activedescendant", atual.id); }
    }

    function executar(i) {
      var c = filtrados[i];
      if (!c) return;
      fecharDialogo(dlg);
      // Espera o diálogo fechar para não brigar com o foco/rolagem
      setTimeout(c.acao, 30);
    }

    function abrir() {
      input.value = "";
      selecionado = 0;
      render();
      abrirDialogo(dlg);
      input.focus();
    }

    input.addEventListener("input", function () { selecionado = 0; render(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); selecionado = (selecionado + 1) % Math.max(1, filtrados.length); marcar(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); selecionado = (selecionado - 1 + filtrados.length) % Math.max(1, filtrados.length); marcar(); }
      else if (e.key === "Enter") { e.preventDefault(); executar(selecionado); }
    });

    $("#abrir-paleta").addEventListener("click", abrir);
    document.addEventListener("keydown", function (e) {
      var digitandoEmCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dlg.open) fecharDialogo(dlg); else abrir();
      } else if (e.key === "/" && !digitandoEmCampo && !dlg.open) {
        e.preventDefault();
        abrir();
      }
    });
  }

  /* ============================================================
     Proteção do conteúdo
     ------------------------------------------------------------
     Bloqueia seleção, cópia, recorte, arrastar e o menu do botão
     direito no texto do site. Campos do formulário continuam
     normais, e o e-mail se copia pelo botão "copiar email".
     ============================================================ */
  function protegerConteudo() {
    function liberado(alvo) {
      return !!(alvo && alvo.closest && alvo.closest("input, textarea, [contenteditable], .paleta"));
    }
    var ultimoAviso = 0;
    function avisar() {
      var agora = Date.now();
      if (agora - ultimoAviso < 2500) return;
      ultimoAviso = agora;
      toast(D.contato.email ? tx("Conteúdo protegido · use \"copiar email\" no contato") : tx("Conteúdo protegido"));
    }
    ["copy", "cut"].forEach(function (tipo) {
      document.addEventListener(tipo, function (e) {
        if (liberado(e.target) || liberado(document.activeElement)) return;
        e.preventDefault();
        avisar();
      });
    });
    document.addEventListener("contextmenu", function (e) {
      // Links continuam com o menu (abrir em nova aba etc.)
      if (liberado(e.target) || (e.target.closest && e.target.closest("a[href]"))) return;
      e.preventDefault();
    });
    document.addEventListener("dragstart", function (e) {
      if (!liberado(e.target)) e.preventDefault();
    });
    document.addEventListener("selectstart", function (e) {
      if (!liberado(e.target)) e.preventDefault();
    });
  }

  /* ============================================================
     Recado para quem abre o console (DevTools)
     ============================================================ */
  function recadoNoConsole() {
    var c = D.contato;
    var titulo = "font: 700 22px/1.4 'Space Grotesk', system-ui, sans-serif; color: #3ddc97;";
    var texto = "font: 14px/1.6 'JetBrains Mono', Consolas, monospace; color: #9fb0c0;";
    var link = "font: 14px/1.6 'JetBrains Mono', Consolas, monospace; color: #5cc8ff;";
    var grafo = [
      "  * a1c3e47 (HEAD -> main) " + tx("você abriu o console"),
      "  |\\",
      "  | * 5f0d2b1 " + tx("feat: curiosidade de dev"),
      "  |/",
      "  * 0c0ffee init",
    ].join("\n");
    var linhas = ["%c" + tx("Olá, dev curioso! 👋"), "%c" + grafo + "\n\n" + tx("Já que você está aqui… que tal a gente conversar?")];
    var estilos = [titulo, texto];
    if (c.linkedin) { linhas.push("%cLinkedIn  → %c" + c.linkedin); estilos.push(texto, link); }
    if (c.github) { linhas.push("%cGitHub    → %c" + c.github); estilos.push(texto, link); }
    if (c.whatsapp) { linhas.push("%cWhatsApp  → %chttps://wa.me/" + String(c.whatsapp).replace(/\D/g, "")); estilos.push(texto, link); }
    if (c.instagram) { linhas.push("%cInstagram → %c" + c.instagram); estilos.push(texto, link); }
    if (c.email) { linhas.push("%cE-mail    → %c" + c.email); estilos.push(texto, link); }
    linhas.push("%c" + tx("Digite ") + "%c" + (I.idioma === "en" ? "letsTalk()" : "vamosConversar()") + "%c" + tx(" para ir direto ao formulário de contato."));
    estilos.push(texto, link, texto);
    console.log.apply(console, [linhas.join("\n")].concat(estilos));

    window.vamosConversar = function () {
      irPara("contato");
      setTimeout(function () { $("#pr-nome").focus({ preventScroll: true }); }, 600);
      return tx("Abrindo o contato… até já! 🚀");
    };
    window.letsTalk = window.vamosConversar;
  }

  /* ============================================================
     Partida
     ============================================================ */
  function iniciar() {
    if (!D) return;
    montarInicio();
    montarSobre();
    montarExperiencia();
    montarCertificados();
    montarProjetos();
    montarContato();
    prepararDialogos();
    prepararGaleria();
    prepararLinksInternos();
    prepararPaleta();
    prepararRolagem();
    iniciarGrafo();
    atualizarCorTema();
    contarNumeros();
    protegerConteudo();
    recadoNoConsole();
    $("#ano").textContent = String(new Date().getFullYear());
    $("#alternar-tema").addEventListener("click", alternarTema);
    abrirDemoPeloEndereco();
    window.addEventListener("hashchange", abrirDemoPeloEndereco);

    // Se o tema segue o sistema, acompanha a mudança
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
      if (!document.documentElement.dataset.tema) {
        atualizarCorTema();
        document.dispatchEvent(new Event("tema-alterado"));
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
