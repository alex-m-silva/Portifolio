// Roda no <head>, antes de pintar a página:
// 1. aplica o tema salvo, para não piscar;
// 2. prepara a entrada do topo (nome digitado + menu descendo), feita por main.js;
// 3. marca cada imagem quando termina de carregar (class "carregou"): até lá ela mostra
//    o esqueleto de carregamento (css/style.css). Fica aqui porque roda antes de qualquer imagem.
// Fica num arquivo próprio (e não inline) para funcionar com qualquer política de segurança.
(function () {
  var raiz = document.documentElement;
  try {
    var t = localStorage.getItem("tema");
    if (t === "claro" || t === "escuro") raiz.dataset.tema = t;
  } catch (e) { /* armazenamento indisponível: segue o sistema */ }

  function marcar(e) {
    var alvo = e.target;
    if (alvo && alvo.tagName === "IMG") alvo.classList.add("carregou");
  }
  document.addEventListener("load", marcar, true); // load e error não sobem: só na captura
  document.addEventListener("error", marcar, true);

  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Só na página inicial: as páginas internas (projetos, artigos, 404) não têm essa animação
  var inicial = /^\/(index(\.html)?)?$/.test(location.pathname);
  if (!reduzir && inicial && document.querySelector) {
    raiz.classList.add("intro");
    // Segurança: se o main.js não carregar, o topo aparece normal mesmo assim
    setTimeout(function () { raiz.classList.remove("intro", "intro-menu"); }, 4000);
  }
})();
