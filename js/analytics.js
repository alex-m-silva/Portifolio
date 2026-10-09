// Google Analytics 4 (gtag.js).
// Só liga no domínio oficial: visitas de localhost e de prévias do Vercel não entram nas estatísticas.
(function () {
  var ID = "G-5P9ZC1D2DD";
  if (!/(^|\.)alexmatias\.dev\.br$/.test(location.hostname)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", ID);

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  document.head.appendChild(s);
})();
