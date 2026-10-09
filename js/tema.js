// Roda no <head>, antes de pintar a página:
// 1. aplica o tema salvo, para não piscar;
// 2. prepara a entrada do topo (nome digitado + menu descendo), feita por main.js.
// Fica num arquivo próprio (e não inline) para funcionar com qualquer política de segurança.
(function () {
  var raiz = document.documentElement;
  try {
    var t = localStorage.getItem("tema");
    if (t === "claro" || t === "escuro") raiz.dataset.tema = t;
  } catch (e) { /* armazenamento indisponível: segue o sistema */ }

  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduzir && document.querySelector) {
    raiz.classList.add("intro");
    // Segurança: se o main.js não carregar, o topo aparece normal mesmo assim
    setTimeout(function () { raiz.classList.remove("intro", "intro-menu"); }, 4000);
  }
})();
