/*
 * Script das páginas internas (projetos e artigos), geradas por tools/build.js.
 * O conteúdo já vem pronto no HTML; aqui ficam só os comportamentos:
 * tema claro/escuro, galeria das telas, vídeo, proteção do texto e links internos.
 */
(function () {
  "use strict";

  var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("mostrar");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("mostrar"); }, 2400);
  }

  function rastrear(evento, params) {
    if (typeof window.gtag === "function") window.gtag("event", evento, params || {});
  }

  /* --- Tema (mesma regra do main.js; o tema salvo já foi aplicado pelo tema.js) --- */
  function temaAtual() {
    var t = document.documentElement.dataset.tema;
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "escuro";
  }
  function prepararTema() {
    var botao = $("#alternar-tema");
    if (!botao) return;
    botao.addEventListener("click", function () {
      var novo = temaAtual() === "claro" ? "escuro" : "claro";
      document.documentElement.dataset.tema = novo;
      try { localStorage.setItem("tema", novo); } catch (e) { /* sem armazenamento */ }
      toast("tema: " + novo);
    });
  }

  /* --- Topo com borda ao rolar --- */
  function prepararTopo() {
    var topo = $(".topo");
    if (!topo) return;
    var aoRolar = function () { topo.classList.toggle("rolou", window.scrollY > 8); };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
  }

  /* --- Links internos da própria página (#apresentacao, #conteudo) sem "#" na barra --- */
  function prepararLinksInternos() {
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      var alvo = document.getElementById(link.getAttribute("href").slice(1));
      if (!alvo) return;
      e.preventDefault();
      if (alvo.id === "conteudo") { alvo.setAttribute("tabindex", "-1"); alvo.focus({ preventScroll: true }); }
      alvo.scrollIntoView({ behavior: reduzirMovimento ? "auto" : "smooth" });
    });
  }

  /* --- Vídeo de apresentação: toca sozinho (mudo) só enquanto está visível --- */
  function prepararVideo() {
    var v = $(".proj-video");
    if (!v) return;
    v.muted = true;
    if (reduzirMovimento || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          var tentativa = v.play();
          if (tentativa && tentativa.catch) tentativa.catch(function () { /* bloqueado: fica o botão play */ });
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.4 }).observe(v);
  }

  /* --- Galeria: as telas abrem ampliadas (sem JS, o link abre a imagem) --- */
  function prepararGaleria() {
    var dlg = $("#galeria");
    var links = $$(".tela-img[data-indice]");
    if (!dlg || !links.length || typeof dlg.showModal !== "function") return;
    var atual = 0;
    var img = $("#galeria-img");

    function mostrar(i) {
      var total = links.length;
      atual = (i + total) % total;
      var l = links[atual];
      img.classList.remove("zoom");
      img.src = l.getAttribute("href");
      img.alt = l.dataset.titulo || "";
      $("#galeria-num").textContent = String(atual + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
      $("#galeria-titulo").textContent = l.dataset.titulo || "";
      $("#galeria-texto").textContent = l.dataset.texto || "";
      $("#galeria-quadro").scrollTo(0, 0);
      [atual + 1, atual - 1].forEach(function (k) { new Image().src = links[(k + total) % total].getAttribute("href"); });
    }

    links.forEach(function (l, i) {
      l.addEventListener("click", function (e) {
        e.preventDefault();
        mostrar(i);
        dlg.showModal();
        rastrear("ver_tela", { tela: l.dataset.titulo });
      });
    });
    $("#galeria-ant").addEventListener("click", function () { mostrar(atual - 1); });
    $("#galeria-prox").addEventListener("click", function () { mostrar(atual + 1); });
    img.addEventListener("click", function () { img.classList.toggle("zoom"); });
    $$("[data-fechar]", dlg).forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); mostrar(atual + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); mostrar(atual - 1); }
    });
    var x0 = null;
    dlg.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") x0 = e.clientX; });
    dlg.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50 && !img.classList.contains("zoom")) mostrar(atual + (dx < 0 ? 1 : -1));
    });
  }

  /* --- Proteção do texto (mesma regra da página inicial; código dos artigos pode ser copiado) --- */
  function protegerConteudo() {
    function liberado(alvo) {
      return !!(alvo && alvo.closest && alvo.closest("input, textarea, [contenteditable], pre.codigo"));
    }
    var ultimoAviso = 0;
    ["copy", "cut"].forEach(function (tipo) {
      document.addEventListener(tipo, function (e) {
        if (liberado(e.target) || liberado(window.getSelection && window.getSelection().anchorNode && window.getSelection().anchorNode.parentElement)) return;
        e.preventDefault();
        if (Date.now() - ultimoAviso > 2500) { ultimoAviso = Date.now(); toast("Conteúdo protegido"); }
      });
    });
    document.addEventListener("contextmenu", function (e) {
      if (liberado(e.target) || (e.target.closest && e.target.closest("a[href]"))) return;
      e.preventDefault();
    });
    document.addEventListener("dragstart", function (e) { if (!liberado(e.target)) e.preventDefault(); });
    document.addEventListener("selectstart", function (e) { if (!liberado(e.target)) e.preventDefault(); });
  }

  function iniciar() {
    prepararTema();
    prepararTopo();
    prepararLinksInternos();
    prepararVideo();
    prepararGaleria();
    protegerConteudo();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
