(function () {
  "use strict";

  var D = window.PORTFOLIO;
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

  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  function formatarMes(aaaamm) {
    var p = String(aaaamm || "").split("-");
    var m = parseInt(p[1], 10);
    if (!p[0] || !m) return aaaamm || "";
    return MESES[m - 1] + " " + p[0];
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("mostrar");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("mostrar"); }, 2400);
  }

  function copiar(texto, aviso) {
    function ok() { toast(aviso || "Copiado!"); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(ok, function () { copiarAntigo(texto); ok(); });
    } else {
      copiarAntigo(texto);
      ok();
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
    copiar: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 6.75C0 5.78.78 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .14.11.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Zm5-5C5 .78 5.78 0 6.75 0h7.5C15.22 0 16 .78 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .14.11.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>',
  };

  var CORES_LINGUAGEM = { "C#": "--lilas", "SQL": "--ambar", "WiX": "--coral", "JavaScript": "--ambar", "TypeScript": "--ceu", "HTML": "--coral", "CSS": "--ceu" };
  var CORES_ROTACAO = ["--menta", "--ceu", "--lilas", "--ambar", "--coral"];

  /* ============================================================
     Início
     ============================================================ */
  function montarInicio() {
    var p = D.perfil;
    $("#marca-usuario").textContent = p.usuario;
    $("#hero-nome").textContent = p.nome;
    $("#hero-frase").textContent = p.frase;
    $("#hero-hash").textContent = hashCurto(p.nome + p.cargo);

    var numeros = [
      { valor: D.projetos.length, rotulo: "repositórios" },
      { valor: D.certificados.length, rotulo: "tags (certificados)" },
      { valor: p.stack.length, rotulo: "ferramentas" },
    ];
    var anos = anosDeCarreira();
    if (anos) numeros.unshift({ valor: anos, rotulo: "anos de carreira" });
    var dl = $("#hero-numeros");
    numeros.forEach(function (n) {
      var dd = h("dd", null, h("span", { "data-contar": n.valor, text: reduzirMovimento ? String(n.valor) : "0" }), h("small", { text: "+" }));
      dl.appendChild(h("div", null, h("dt", { text: n.rotulo }), dd));
    });

    digitar($("#digitando"), p.funcoes);
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
    var MENSAGENS = [
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
    $("#sobre-data").textContent = hoje.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

    var texto = $("#sobre-texto");
    p.sobre.forEach(function (par) { texto.appendChild(h("p", { text: par })); });

    var lista = $("#stack");
    p.stack.forEach(function (s) { lista.appendChild(h("li", { text: s })); });
    $("#stack-qtd").textContent = String(p.stack.length);
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

  function periodo(inicio, fim) {
    return formatarMes(inicio) + " → " + (fim ? formatarMes(fim) : "hoje");
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
    exp.forEach(function (e, i) {
      var atual = !e.fim;
      lista.appendChild(h("li", { class: "commit", style: "--cor: var(" + CORES_ROTACAO[i % CORES_ROTACAO.length] + ")" },
        h("p", { class: "commit-meta mono" },
          h("span", { class: "amarelo", text: "commit " + hashCurto(e.empresa + e.inicio) }),
          atual ? h("span", { class: "ref", text: "(HEAD → main)" }) : null,
          h("span", { class: "commit-data", text: periodo(e.inicio, e.fim) })),
        h("h3", null, e.cargo, h("span", { class: "commit-empresa", text: " @ " + e.empresa })),
        e.local ? h("p", { class: "commit-local mono", text: e.local }) : null,
        e.resumo ? h("p", { class: "commit-resumo", text: e.resumo }) : null,
        (e.destaques || []).length ? h("ul", { class: "commit-itens" }, e.destaques.map(function (d) { return h("li", { text: d }); })) : null,
        (e.stack || []).length ? h("div", { class: "tag-skills" }, e.stack.map(function (t) { return h("span", { text: t }); })) : null));
    });

    if (form.length) {
      $("#bloco-formacao").hidden = false;
      var listaForm = $("#lista-form");
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
    container.appendChild(chip("todos", "todos"));
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
      lista.replaceWith(h("p", { class: "vazio", text: "fatal: No names found, cannot describe anything. (nenhum certificado ainda)" }));
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
              c.exemplo ? h("span", { class: "selo-exemplo", text: "exemplo" }) : null,
              h("span", { class: "tag-data", text: formatarMes(c.data) })),
            h("h3", { text: c.titulo }),
            h("p", { class: "tag-emissor", text: c.emissor }),
            h("div", { class: "tag-skills" }, (c.skills || []).map(function (s) { return h("span", { text: s }); })),
            h("span", { class: "tag-verificar" + (temLink ? "" : " sem-link"), text: temLink ? "verificar →" : "link em breve" }),
          ];
          var cartao = temLink
            ? h("a", { class: "tag", href: c.url, target: "_blank", rel: "noopener noreferrer", style: "--cor: var(" + c._cor + ")", "aria-label": c.titulo + ", " + c.emissor + " — verificar certificado" }, corpo)
            : h("div", { class: "tag", style: "--cor: var(" + c._cor + ")" }, corpo);
          lista.appendChild(h("li", null, cartao));
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

  function botoesProjeto(p, comReadme) {
    return h("div", { class: "repo-acoes" },
      comReadme ? h("button", { class: "btn-peq", type: "button", html: ICONES.livro + " README", onclick: function () { abrirProjeto(p); } }) : null,
      p.repo ? h("a", { class: "btn-peq", href: p.repo, target: "_blank", rel: "noopener noreferrer", html: ICONES.github + " código" }) : null,
      p.demo ? h("a", { class: "btn-peq", href: p.demo, target: "_blank", rel: "noopener noreferrer", html: ICONES.link + " demo" }) : null);
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
              h("h3", { text: p.nome }),
              h("span", { class: "repo-visib", text: p.repo ? "público" : "privado" })),
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
        });
    }

    var tags = frequencia(projetos.map(function (p) { return p.tags; }), 8);
    if (tags.length > 1) montarFiltros($("#filtros-proj"), tags, render);
    render("todos");
  }

  function abrirProjeto(p) {
    var alvo = $("#modal-conteudo");
    alvo.textContent = "";
    alvo.appendChild(h("h3", { id: "modal-titulo", text: "# " + p.nome }));
    alvo.appendChild(h("p", { text: p.resumo }));
    if (p.detalhes && p.detalhes.length) {
      alvo.appendChild(h("h4", { text: "## Destaques" }));
      alvo.appendChild(h("ul", null, p.detalhes.map(function (d) { return h("li", { text: d }); })));
    }
    if (p.tags && p.tags.length) {
      alvo.appendChild(h("h4", { text: "## Stack" }));
      alvo.appendChild(h("div", { class: "repo-tags" }, p.tags.map(function (t) { return h("span", { text: t }); })));
    }
    var barra = barraLinguagens(p.linguagens);
    if (barra) {
      alvo.appendChild(h("h4", { text: "## Linguagens" }));
      alvo.appendChild(barra);
    }
    if (!p.repo) alvo.appendChild(h("p", { class: "mono", style: "margin-top:18px;font-size:13px;color:var(--texto-3)", text: "Repositório privado. Código disponível sob consulta." }));
    alvo.appendChild(botoesProjeto(p, false));
    abrirDialogo($("#modal-proj"));
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
      dlg.addEventListener("click", function (e) { if (e.target === dlg) fecharDialogo(dlg); });
      $$("[data-fechar]", dlg).forEach(function (b) { b.addEventListener("click", function () { fecharDialogo(dlg); }); });
    });
  }

  /* ============================================================
     Contato
     ============================================================ */
  var EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function montarContato() {
    var c = D.contato;
    var ul = $("#canais");

    function canal(icone, rotulo, valor, attrs) {
      var tag = attrs.href ? "a" : "button";
      if (tag === "button") attrs.type = "button";
      attrs.class = "canal";
      attrs.html = icone;
      var el = h(tag, attrs);
      el.appendChild(h("span", { class: "canal-txt" }, h("b", { text: rotulo }), h("span", { text: valor })));
      ul.appendChild(h("li", null, el));
    }

    if (c.email) {
      canal(ICONES.email, "email", c.email, { href: "mailto:" + c.email });
      canal(ICONES.copiar, "copiar email", "clique para copiar", { onclick: function () { copiar(c.email, "E-mail copiado!"); } });
    }
    if (c.github) canal(ICONES.github, "origin", c.github.replace(/^https?:\/\/(www\.)?/, ""), { href: c.github, target: "_blank", rel: "noopener noreferrer" });
    if (c.linkedin) canal(ICONES.linkedin, "linkedin", c.linkedin.replace(/^https?:\/\/(www\.)?/, ""), { href: c.linkedin, target: "_blank", rel: "noopener noreferrer" });
    if (c.instagram) canal(ICONES.instagram, "instagram", "@" + c.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/+$/, ""), { href: c.instagram, target: "_blank", rel: "noopener noreferrer" });
    if (c.whatsapp) {
      var num = String(c.whatsapp).replace(/\D/g, "");
      canal(ICONES.whatsapp, "whatsapp", "mandar mensagem", { href: "https://wa.me/" + num, target: "_blank", rel: "noopener noreferrer" });
    }
    if (!ul.children.length) ul.appendChild(h("li", { class: "mono", style: "color:var(--texto-3);font-size:13px", text: "Nenhum canal configurado em js/data.js" }));

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
      $("#pr-autor").textContent = campos.nome.value.trim().split(/\s+/)[0] || "visitante";
      return tudoOk;
    }

    form.addEventListener("input", verificar);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tentou = true;
      var status = $("#pr-status");
      if (!verificar()) {
        status.textContent = "✗ Alguns checks falharam. Confira os campos marcados.";
        var primeiro = Object.keys(regras).filter(function (k) { return !regras[k](campos[k].value); })[0];
        if (primeiro) campos[primeiro].focus();
        return;
      }
      if (!c.email) {
        status.textContent = "✗ O e-mail de destino ainda não foi configurado em js/data.js.";
        return;
      }
      var botao = $('button[type="submit"]', form);
      var dados = {
        name: campos.nome.value.trim(),
        email: campos.email.value.trim(),
        _subject: "[Portfólio] " + campos.titulo.value.trim(),
        message: campos.mensagem.value.trim(),
        _template: "box",
        _captcha: "false",
      };

      // Envia direto pelo FormSubmit; se falhar, cai no mailto como antes.
      botao.disabled = true;
      status.textContent = "… Enviando o PR.";
      fetch("https://formsubmit.co/ajax/" + c.email, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(dados),
      })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) !== "true") throw new Error(j.message); }); })
        .then(function () {
          status.textContent = "✓ PR #" + (Math.floor(Math.random() * 90) + 10) + " merged! Mensagem enviada, já já eu respondo.";
          form.reset();
          tentou = false;
          verificar();
        })
        .catch(function () {
          var corpo = dados.message + "\n\n— " + dados.name + " <" + dados.email + ">";
          window.location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent(dados._subject) + "&body=" + encodeURIComponent(corpo);
          status.textContent = "✗ Não deu para enviar direto. Abrindo seu e-mail, ou copie o endereço acima.";
        })
        .then(function () { botao.disabled = false; });
    });
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
    toast("tema: " + novo);
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

    var nos = secoes.map(function (s) {
      var li = h("li", null, h("span", { text: s.getAttribute("data-commit") }));
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
    var alvos = $$(".secao-cab, .git-show, .commit, .tags > li, .repo, .pr, .canais, .filtros");
    if (reduzirMovimento || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        io.unobserve(e.target);
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

    function ir(id) { return function () { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduzirMovimento ? "auto" : "smooth" }); }; }
    var comandos = [
      { rotulo: "Ir para o início", dica: "git checkout main", acao: ir("inicio") },
      { rotulo: "Ir para sobre", dica: "git show sobre", acao: ir("sobre") },
      { rotulo: "Ir para experiência (carreira)", dica: "git log", acao: ir("experiencia") },
      { rotulo: "Ir para certificados", dica: "git tag", acao: ir("certificados") },
      { rotulo: "Ir para projetos", dica: "ls ~/repos", acao: ir("projetos") },
      { rotulo: "Ir para contato", dica: "gh pr create", acao: ir("contato") },
      { rotulo: "Alternar tema claro/escuro", dica: "tema", acao: alternarTema },
    ];
    if (D.contato.email) comandos.push({ rotulo: "Copiar e-mail", dica: D.contato.email, acao: function () { copiar(D.contato.email, "E-mail copiado!"); } });
    if (D.contato.github) comandos.push({ rotulo: "Abrir GitHub", dica: "git remote -v", acao: function () { window.open(D.contato.github, "_blank", "noopener"); } });
    if (D.contato.linkedin) comandos.push({ rotulo: "Abrir LinkedIn", dica: "linkedin", acao: function () { window.open(D.contato.linkedin, "_blank", "noopener"); } });
    if (D.contato.instagram) comandos.push({ rotulo: "Abrir Instagram", dica: "instagram", acao: function () { window.open(D.contato.instagram, "_blank", "noopener"); } });
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
        lista.appendChild(h("li", { class: "nada", text: "comando não encontrado: " + input.value }));
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
    prepararPaleta();
    prepararRolagem();
    iniciarGrafo();
    atualizarCorTema();
    contarNumeros();
    $("#ano").textContent = String(new Date().getFullYear());
    $("#alternar-tema").addEventListener("click", alternarTema);

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
