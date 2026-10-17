/*
 * Visor do tour pelas telas: uma tela grande, a legenda e a faixa de miniaturas.
 * Usado na janela do README (main.js monta o HTML) e na página do projeto
 * (o build já entrega o HTML). Sem JavaScript, cada miniatura é um link para a imagem.
 *
 * Os textos chegam traduzidos no próprio HTML: este arquivo só troca o estado.
 * Uso: Visor.ativar(elementoDoVisor, function aoAmpliar(indice) { ... })
 */
(function () {
  "use strict";

  function ativar(visor, aoAmpliar) {
    if (!visor || visor.dataset.ativo) return;
    visor.dataset.ativo = "1";
    var minis = Array.prototype.slice.call(visor.querySelectorAll(".visor-mini"));
    var tela = visor.querySelector(".visor-tela");
    var img = tela.querySelector("img");
    var num = visor.querySelector(".visor-num");
    var titulo = visor.querySelector(".visor-titulo");
    var texto = visor.querySelector(".visor-texto");
    var rotulo = visor.dataset.rotuloAmpliar || "{titulo}";
    var total = minis.length;
    var atual = 0;
    var vizinhasCarregadas = false;

    function rotular(n) {
      return String(n + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    }

    // As vizinhas só são baixadas depois da primeira interação, para não pesar a abertura
    function preCarregar() {
      [atual + 1, atual - 1].forEach(function (k) {
        new Image().src = minis[(k + total) % total].getAttribute("href");
      });
      vizinhasCarregadas = true;
    }

    function mostrar(i, focar) {
      atual = (i + total) % total;
      var m = minis[atual];
      var href = m.getAttribute("href");
      tela.setAttribute("href", href);
      tela.setAttribute("aria-label", rotulo.replace("{titulo}", m.dataset.titulo));
      if (img.getAttribute("src") !== href) { img.classList.remove("carregou"); img.src = href; } // esqueleto até carregar
      img.alt = m.dataset.alt || m.dataset.titulo;
      num.textContent = rotular(atual);
      titulo.textContent = m.dataset.titulo;
      texto.textContent = m.dataset.texto;
      minis.forEach(function (outra, k) {
        if (k === atual) outra.setAttribute("aria-current", "true");
        else outra.removeAttribute("aria-current");
        outra.tabIndex = k === atual ? 0 : -1;
      });
      // Faixa com rolagem lateral (celular): a miniatura ativa fica à vista
      var faixa = m.parentNode.parentNode;
      if (faixa.scrollWidth > faixa.clientWidth) {
        var rf = faixa.getBoundingClientRect(), rm = m.getBoundingClientRect();
        if (rm.left < rf.left || rm.right > rf.right) {
          faixa.scrollBy({ left: rm.left - rf.left - 8, behavior: "smooth" });
        }
      }
      if (focar) m.focus({ preventScroll: true });
      preCarregar();
    }

    minis.forEach(function (m, i) {
      m.addEventListener("click", function (e) { e.preventDefault(); mostrar(i); });
    });
    visor.querySelector(".visor-ant").addEventListener("click", function () { mostrar(atual - 1); });
    visor.querySelector(".visor-prox").addEventListener("click", function () { mostrar(atual + 1); });

    // Setas, Home e End movem entre as telas; o foco anda junto pelas miniaturas
    visor.addEventListener("keydown", function (e) {
      var destino = { ArrowRight: atual + 1, ArrowLeft: atual - 1, Home: 0, End: total - 1 }[e.key];
      if (destino === undefined || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      mostrar(destino, true);
    });

    tela.addEventListener("click", function (e) {
      if (!aoAmpliar) return; // sem galeria, o link abre a imagem
      e.preventDefault();
      aoAmpliar(atual);
    });

    // Arrastar para o lado no celular
    var x0 = null;
    tela.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") x0 = e.clientX; });
    tela.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) {
        tela.dataset.arrastou = "1";
        mostrar(atual + (dx < 0 ? 1 : -1));
      }
    });
    // Um arrasto não pode virar clique (que abriria a galeria)
    tela.addEventListener("click", function (e) {
      if (!tela.dataset.arrastou) return;
      delete tela.dataset.arrastou;
      e.preventDefault();
      e.stopImmediatePropagation();
    }, true);

    tela.addEventListener("pointerenter", function () { if (!vizinhasCarregadas) preCarregar(); }, { once: true });
    num.textContent = rotular(0);
  }

  window.Visor = { ativar: ativar };
})();
