// Google Analytics 4 (gtag.js) com Google Consent Mode v2 e aviso de cookies (LGPD).
// - Tudo começa negado: sem "Aceitar", o gtag.js nem é baixado e nenhum cookie _ga é gravado.
// - Ao aceitar, só analytics_storage vira "granted" (o site não tem anúncios: ad_* ficam negados).
// - A escolha fica em localStorage ("consentimento": "aceito" | "recusado") e pode ser trocada
//   na página /privacidade (botão com data-consentimento), que chama Consentimento.abrir().
// - O script do Google só é carregado no domínio oficial: localhost e prévias do Vercel mostram
//   o aviso e registram os comandos no dataLayer, mas nada sai para o Google.
(function () {
  var ID = "G-5P9ZC1D2DD";
  var CHAVE = "consentimento";
  var oficial = /(^|\.)alexmatias\.dev\.br$/.test(location.hostname);
  var t = window.I18N ? window.I18N.t : function (s) { return s; };
  var prefixo = window.I18N ? window.I18N.prefixo : "";

  function lerEscolha() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravarEscolha(v) { try { localStorage.setItem(CHAVE, v); } catch (e) { /* sem armazenamento */ } }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  var carregado = false;
  function ligar() {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    if (carregado) return;
    carregado = true;
    window.gtag("js", new Date());
    window.gtag("config", ID);
    if (!oficial) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }

  // Recusou depois de ter aceitado: para de gravar e apaga os cookies que o GA já criou
  function desligar() {
    window.gtag("consent", "update", { analytics_storage: "denied" });
    var dominio = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach(function (c) {
      var nome = c.split("=")[0].trim();
      if (!/^_ga(_|$)/.test(nome)) return;
      ["", "; domain=" + dominio, "; domain=." + dominio].forEach(function (d) {
        document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
      });
    });
  }

  var escolha = lerEscolha();
  if (escolha === "aceito") ligar();

  /* --- Aviso de cookies --- */
  var aviso = null;

  function fecharAviso() {
    if (!aviso) return;
    var el = aviso;
    aviso = null;
    el.classList.remove("mostrar");
    setTimeout(function () { el.remove(); }, 400);
  }

  function decidir(valor) {
    var antes = lerEscolha();
    gravarEscolha(valor);
    if (valor === "aceito") ligar();
    else if (antes === "aceito") desligar();
    fecharAviso();
    // O aviso de idioma (js/i18n.js) espera esta escolha para os dois não aparecerem juntos
    document.dispatchEvent(new CustomEvent("consentimento", { detail: valor }));
  }

  function abrir() {
    if (aviso) return;
    aviso = document.createElement("div");
    aviso.className = "aviso-cookies";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", t("Aviso de cookies"));
    aviso.innerHTML =
      '<p class="aviso-cookies-cmd mono"><span class="sinal">$</span> git config analytics.cookies</p>' +
      '<p class="aviso-cookies-txt"><span></span> <a></a></p>' +
      '<div class="aviso-cookies-botoes">' +
      '<button type="button" class="btn-peq" data-escolha="recusado"></button>' +
      '<button type="button" class="btn-peq btn-demo" data-escolha="aceito"></button>' +
      "</div>";
    aviso.querySelector(".aviso-cookies-txt span").textContent =
      t("Uso o Google Analytics para saber quantas pessoas visitam o site. Ele só grava cookies se você aceitar.");
    var link = aviso.querySelector(".aviso-cookies-txt a");
    link.href = prefixo + "/privacidade";
    link.textContent = t("Saiba mais");
    aviso.querySelector('[data-escolha="recusado"]').textContent = t("Recusar");
    aviso.querySelector('[data-escolha="aceito"]').textContent = t("Aceitar");
    aviso.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-escolha]");
      if (b) decidir(b.getAttribute("data-escolha"));
    });
    document.body.appendChild(aviso);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (aviso) aviso.classList.add("mostrar"); }); });
  }

  window.Consentimento = { escolha: lerEscolha, abrir: abrir };

  function iniciar() {
    if (!escolha) abrir();
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-consentimento]");
      if (b) { e.preventDefault(); abrir(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
