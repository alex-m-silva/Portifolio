// Aplica o tema salvo antes de pintar a página, para não piscar.
// Fica num arquivo próprio (e não inline) para funcionar com qualquer política de segurança.
(function () {
  try {
    var t = localStorage.getItem("tema");
    if (t === "claro" || t === "escuro") document.documentElement.dataset.tema = t;
  } catch (e) { /* armazenamento indisponível: segue o sistema */ }
})();
