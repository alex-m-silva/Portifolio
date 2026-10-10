#!/usr/bin/env node
/*
 * ============================================================
 *  Build do portfólio
 * ============================================================
 *  Gera o site final em dist/ a partir dos arquivos da raiz, de js/data.js
 *  e de js/i18n.js, em português ("/") e inglês ("/en"):
 *
 *  1. index.html com o conteúdo já no HTML (sobre, stack, experiência, formação,
 *     certificados e projetos), para o Google ler sem depender do JavaScript.
 *     No navegador, o main.js monta tudo de novo por cima (animações, filtros etc.).
 *     A versão em inglês traduz os textos marcados com data-t / data-ta.
 *  2. Uma página por projeto em /projetos/<slug> e /en/projetos/<slug>, com texto,
 *     vídeo, galeria de telas, dados estruturados e links para os outros projetos.
 *  3. Artigos em /artigos/<slug> a partir de artigos/*.md, só em português (os
 *     marcados como rascunho só são gerados com --rascunhos, sem índice e fora do sitemap).
 *  4. sitemap.xml (com as versões de cada idioma) e robots.txt.
 *
 *  Para antes de tudo se algum texto marcado não tiver tradução em js/i18n.js.
 *
 *  Uso:  node tools/build.js              (o Vercel roda isto a cada deploy)
 *        node tools/build.js --rascunhos  (inclui os rascunhos, para revisar)
 *  Ver:  node tools/servidor.js           (serve dist/ em http://localhost:5510)
 *
 *  Sem dependências: só Node.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");
const DIST = path.join(RAIZ, "dist");
const SITE = "https://www.alexmatias.dev.br";
const IDIOMAS = ["pt", "en"];
const COM_RASCUNHOS = process.argv.includes("--rascunhos");
const HOJE = new Date().toISOString().slice(0, 10);

// Data e hora no formato que o Google aceita em datePublished/dateModified (ISO 8601 com fuso):
// "2026-10-10T14:32:05-03:00". Sem argumento, usa o momento do build; com "AAAA-MM-DD", meio-dia nesse dia.
function dataHoraBr(aaaammdd) {
  const d = aaaammdd ? new Date(aaaammdd + "T12:00:00-03:00") : new Date();
  const local = new Date(d.getTime() - 3 * 3600 * 1000); // horário de Brasília (UTC-3)
  return local.toISOString().slice(0, 19) + "-03:00";
}

/* ============================================================
   Utilitários
   ============================================================ */
const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Mesmo hash curto do main.js (FNV-1a), para os "commits" baterem com o que o JS desenha
function hashCurto(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ("0000000" + (h >>> 0).toString(16)).slice(-7);
}

// "GestaoComercial" → "gestao-comercial"
const slugify = (s) => String(s)
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CORES = ["--menta", "--ceu", "--lilas", "--ambar", "--coral"];
const CORES_LINGUAGEM = { "C#": "--lilas", "SQL": "--ambar", "WiX": "--coral", "JavaScript": "--ambar", "TypeScript": "--ceu", "HTML": "--coral", "CSS": "--ceu", "Python": "--menta" };

const ler = (rel) => fs.readFileSync(path.join(RAIZ, rel), "utf8");
function gravar(rel, conteudo) {
  const destino = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, conteudo);
}
function copiar(rel) {
  const origem = path.join(RAIZ, rel);
  if (!fs.existsSync(origem)) return;
  fs.cpSync(origem, path.join(DIST, rel), { recursive: true });
}
const existe = (rel) => fs.existsSync(path.join(RAIZ, rel));

// Troca o que estiver entre <!--pre:nome--> e <!--/pre:nome--> (os marcadores ficam)
function preencher(html, nome, conteudo) {
  const ini = `<!--pre:${nome}-->`, fim = `<!--/pre:${nome}-->`;
  const a = html.indexOf(ini), b = html.indexOf(fim);
  if (a < 0 || b < 0) throw new Error(`Marcador ${nome} não encontrado no index.html`);
  return html.slice(0, a + ini.length) + conteudo + html.slice(b);
}

function trocarUmaVez(html, de, para) {
  if (html.split(de).length !== 2) throw new Error(`Esperava achar uma vez no index.html: ${de}`);
  return html.replace(de, para);
}

/* ============================================================
   Idiomas
   ------------------------------------------------------------
   `I` é o ajudante do idioma da página que está sendo gerada
   (vem de js/i18n.js): I.t(), I.periodo(), I.duracao() etc.
   ============================================================ */
const I18N = (function () {
  const ctx = { window: { document: { documentElement: { lang: "pt" } } } };
  vm.runInNewContext(ler("js/i18n.js"), ctx, { filename: "js/i18n.js" });
  return ctx.window.I18N;
})();
let I = I18N.criar("pt");
const tx = (s, vars) => I.t(s, vars);

// Endereço de uma página num idioma. caminho: "/" ou "/projetos/x". O inglês da página
// inicial é "/en" (sem barra no fim, como o Vercel serve com trailingSlash: false).
const caminhoEm = (lang, caminho) => (lang === "en" ? (caminho === "/" ? "/en" : "/en" + caminho) : caminho);
const urlEm = (lang, caminho) => SITE + caminhoEm(lang, caminho);
const hreflang = (lang) => (lang === "en" ? "en" : "pt-BR");
const ogLocale = (lang) => (lang === "en" ? "en_US" : "pt_BR");

// Tags <link rel="alternate" hreflang> de uma página que existe nos dois idiomas
const tagsAlternadas = (caminho) => IDIOMAS.map((l) => `  <link rel="alternate" hreflang="${hreflang(l)}" href="${urlEm(l, caminho)}">`).join("\n") +
  `\n  <link rel="alternate" hreflang="x-default" href="${urlEm("pt", caminho)}">`;

// Seletor pt | en do topo. `caminhos`: endereço desta página em cada idioma (ou da página inicial)
function seletorIdioma(lang, caminhos) {
  return `<div class="idiomas mono" role="group" aria-label="${esc(tx("Idioma"))}">` +
    IDIOMAS.map((l) => `<a href="${caminhos[l]}" hreflang="${hreflang(l)}" lang="${hreflang(l)}" data-idioma="${l}"${l === lang ? ' aria-current="true"' : ""}>${l}</a>`).join("\n        ") +
    `</div>`;
}

// Traduz os textos fixos marcados no HTML (data-t: o texto do elemento; data-ta: atributos)
// e tira as marcas. Para se faltar tradução, para nada ir ao ar pela metade.
function traduzirMarcados(html, lang) {
  const EN = I18N.EN;
  const traduzir = (txt) => {
    if (lang !== "en") return txt;
    const chave = txt.trim();
    if (!Object.prototype.hasOwnProperty.call(EN, chave)) throw new Error(`Sem tradução em js/i18n.js: "${chave}"`);
    return txt.replace(chave, EN[chave]);
  };
  html = html.replace(/<([a-z][a-z0-9]*)\b([^>]*?)\sdata-t(?=[\s>])([^>]*)>([^<]*)<\/\1>/g,
    (m, tag, antes, depois, texto) => `<${tag}${antes}${depois}>${traduzir(texto)}</${tag}>`);
  html = html.replace(/<([a-z][a-z0-9]*)\b([^>]*?)\sdata-ta="([^"]*)"([^>]*)>/g, (m, tag, antes, lista, depois) => {
    let attrs = antes + depois;
    lista.split(/\s+/).filter(Boolean).forEach((nome) => {
      attrs = attrs.replace(new RegExp("(\\s" + nome + '=")([^"]*)(")'), (mm, a, valor, b) => a + esc(traduzir(valor.replace(/&quot;/g, '"'))) + b);
    });
    return `<${tag}${attrs}>`;
  });
  if (/\sdata-t(?=[\s>])|\sdata-ta=/.test(html)) throw new Error("Sobrou marca data-t sem tratar (elemento com outro elemento dentro?)");
  return html;
}

/* ============================================================
   Dados
   ============================================================ */
function carregarDadosBrutos() {
  const ctx = { window: {}, atob: (b) => Buffer.from(b, "base64").toString("binary") };
  vm.runInNewContext(ler("js/data.js"), ctx, { filename: "js/data.js" });
  if (!ctx.window.PORTFOLIO) throw new Error("js/data.js não definiu window.PORTFOLIO");
  return ctx.window.PORTFOLIO;
}

function dadosEm(bruto) {
  const D = I.resolver(bruto);
  D.projetos.forEach((p) => { p.slug = p.slug || slugify(p.nome); });
  return D;
}

/* ============================================================
   Pedaços de HTML reaproveitados
   ============================================================ */
function barraLinguagens(linguagens) {
  const nomes = Object.keys(linguagens || {});
  if (!nomes.length) return "";
  const cor = (n) => `var(${CORES_LINGUAGEM[n] || "--ceu"})`;
  const rotulo = nomes.map((n) => `${n} ${linguagens[n]}%`).join(", ");
  return `<div><div class="lang-barra" role="img" aria-label="${esc(rotulo)}">` +
    nomes.map((n) => `<span style="width:${linguagens[n]}%;background:${cor(n)}"></span>`).join("") +
    `</div><div class="lang-legenda" style="margin-top:8px" aria-hidden="true">` +
    nomes.map((n) => `<span><i style="background:${cor(n)}"></i>${esc(n)} ${linguagens[n]}%</span>`).join("") +
    `</div></div>`;
}

const chips = (lista, classe) => `<div class="${classe}">${(lista || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>`;

const ICONE_REPO = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.07 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.09a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>';
const ICONE_GITHUB = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>';
const ICONE_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.8v10.4a.8.8 0 0 0 1.22.68l8.3-5.2a.8.8 0 0 0 0-1.36l-8.3-5.2A.8.8 0 0 0 4 2.8Z"/></svg>';
const ICONE_LIVRO = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.25c1.2 0 2.27.56 3 1.44A3.75 3.75 0 0 1 11 1h4.25a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H10.8a2.25 2.25 0 0 0-2.05 1.32.75.75 0 0 1-1.38.02l-.05-.1A2.25 2.25 0 0 0 5.2 13H.75a.75.75 0 0 1-.75-.75Zm7.25 2.5A2.25 2.25 0 0 0 5 2.5H1.5v9h3.7c.75 0 1.47.22 2.05.6Zm1.5 7.85a3.74 3.74 0 0 1 2.05-.6h3.7v-9H11a2.25 2.25 0 0 0-2.25 2.25Z"/></svg>';
const ICONE_ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.25 4.24a1 1 0 0 1-1.42 1.42l-4.24-4.25A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 2a1 1 0 0 1 1 1v1.5H13a1 1 0 1 1 0 2h-1.5V13a1 1 0 1 1-2 0v-1.5H8a1 1 0 1 1 0-2h1.5V8a1 1 0 0 1 1-1Z"/></svg>';

/* ============================================================
   1. Página inicial: conteúdo no HTML
   ============================================================ */
function htmlExperiencia(exp) {
  return exp.map((e, i) => {
    const atual = !e.fim;
    return `<li class="commit" style="--cor: var(${CORES[i % CORES.length]})">` +
      `<p class="commit-meta mono"><span class="amarelo">commit ${hashCurto(e.empresa + e.inicio)}</span>` +
      (atual ? `<span class="ref ref-atual">(HEAD → main)</span>` : "") +
      `<span class="commit-data">${esc(I.periodo(e.inicio, e.fim))}<span class="commit-duracao"> · ${esc(I.duracao(e.inicio, e.fim))}</span></span></p>` +
      `<h3>${esc(e.cargo)}<span class="commit-empresa"> @ ${esc(e.empresa)}</span></h3>` +
      (e.local ? `<p class="commit-local mono">${esc(e.local)}</p>` : "") +
      (e.resumo ? `<p class="commit-resumo">${esc(e.resumo)}</p>` : "") +
      ((e.destaques || []).length ? `<ul class="commit-itens">${e.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : "") +
      ((e.stack || []).length ? chips(e.stack, "tag-skills") : "") +
      `</li>`;
  }).join("");
}

function htmlFormacao(form) {
  return form.map((f) => `<li class="commit" style="--cor: var(--ambar)">` +
    `<p class="commit-meta mono"><span class="amarelo">commit ${hashCurto(f.instituicao + f.curso)}</span>` +
    `<span class="commit-data">${esc(I.periodo(f.inicio, f.fim))}</span></p>` +
    `<h3>${esc(f.curso)}<span class="commit-empresa"> @ ${esc(f.instituicao)}</span></h3></li>`).join("");
}

function htmlCertificados(certificados) {
  // Mesma ordem e versões do main.js: o mais antigo é v1.0.0, a lista mostra do mais novo
  const certs = certificados.slice().sort((a, b) => String(a.data).localeCompare(String(b.data)))
    .map((c, i) => Object.assign({}, c, { versao: "v1." + i + ".0", cor: CORES[i % CORES.length] }))
    .reverse();
  return certs.map((c) => {
    const corpo = `<div class="tag-topo"><span class="tag-versao">${c.versao}</span>` +
      `<span class="tag-data">${esc(I.formatarMes(c.data))}</span></div>` +
      `<h3>${esc(c.titulo)}</h3><p class="tag-emissor">${esc(c.emissor)}</p>` +
      chips(c.skills, "tag-skills") +
      `<span class="tag-verificar${c.url ? "" : " sem-link"}">${c.url ? tx("verificar →") : tx("link em breve")}</span>`;
    return `<li>` + (c.url
      ? `<a class="tag" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" style="--cor: var(${c.cor})">${corpo}</a>`
      : `<div class="tag" style="--cor: var(${c.cor})">${corpo}</div>`) + `</li>`;
  }).join("");
}

function htmlCardsProjetos(projetos) {
  const ordem = projetos.slice().sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
  return ordem.map((p) => {
    const pagina = caminhoEm(I.idioma, `/projetos/${p.slug}`);
    return `<article class="repo${p.destaque ? " destaque" : ""}">` +
      `<div class="repo-cab">${ICONE_REPO}<h3><a href="${pagina}">${esc(p.nome)}</a></h3>` +
      `<span class="repo-visib">${p.repo ? tx("público") : tx("privado")}</span></div>` +
      `<p class="repo-resumo">${esc(p.resumo)}</p>` +
      barraLinguagens(p.linguagens) +
      chips(p.tags, "repo-tags") +
      `<div class="repo-acoes"><a class="btn-peq" href="${pagina}">${ICONE_LIVRO} ${tx("detalhes")}</a>` +
      (p.repo ? `<a class="btn-peq" href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">${ICONE_GITHUB} ${tx("código")}</a>` : "") +
      (p.demo ? `<a class="btn-peq btn-demo" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">${ICONE_PLAY} demo</a>` : "") +
      `</div></article>`;
  }).join("");
}

// JSON-LD extra da página inicial: a lista de projetos com link para a página de cada um
function jsonLdProjetos(D) {
  const dados = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": tx("Lista de projetos de {nome}", { nome: D.perfil.nome }),
    "itemListElement": D.projetos.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": urlEm(I.idioma, `/projetos/${p.slug}`),
      "name": p.nome,
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(dados)}</script>`;
}

// O JSON-LD principal (ProfilePage + WebSite + Person) vem escrito no index.html em português;
// aqui ele ganha a data de publicação e, na versão em inglês, os textos e endereços em inglês.
function ajustarJsonLdPrincipal(html, D) {
  const re = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/;
  const m = re.exec(html);
  if (!m) throw new Error("JSON-LD principal não encontrado no index.html");
  const dados = JSON.parse(m[2]);
  const no = (tipo) => dados["@graph"].find((n) => n["@type"] === tipo);
  const pagina = no("ProfilePage"), site = no("WebSite"), pessoa = no("Person");
  pagina.dateModified = dataHoraBr();
  pessoa.knowsLanguage = ["pt-BR", "en"];
  site.inLanguage = ["pt-BR", "en"];
  if (I.idioma === "en") {
    pagina.url = urlEm("en", "/");
    pagina["@id"] = urlEm("en", "/") + "#pagina";
    pagina.name = tx("Alex Matias · Desenvolvedor de Software .NET");
    pagina.inLanguage = "en";
    pessoa.jobTitle = D.perfil.cargo;
    pessoa.description = D.perfil.sobre[0];
  }
  return html.replace(re, (mm, a, b, c) => a + "\n  " + JSON.stringify(dados, null, 2).replace(/\n/g, "\n  ") + "\n  " + c);
}

const NOSCRIPT_EN = `
    <div class="noscript">
      <p><strong>Alex Matias, .NET Software Developer</strong> based in Divinópolis, Brazil. Over 3 years building, modernizing and integrating business systems with C#, .NET, Entity Framework, SQL Server, MySQL and ASP.NET Core.</p>
      <p>Currently at CartSys Software (ERP for notary and registry offices). Before that: Condumig (industrial automation) and Petrarca Software. Bachelor's in Computer Science from Faculdade Pitágoras.</p>
      <p>Turn on JavaScript to see the full experience, certificates and projects, or reach me on <a href="https://www.linkedin.com/in/alex-matias-silva">LinkedIn</a> or <a href="https://github.com/alex-m-silva">GitHub</a>.</p>
    </div>
  `;

function gerarIndex(D, artigos) {
  const lang = I.idioma;
  let html = ler("index.html");
  const p = D.perfil;
  html = ajustarJsonLdPrincipal(html, D);
  html = preencher(html, "frase", esc(p.frase));
  html = preencher(html, "sobre", p.sobre.map((t) => `<p>${esc(t)}</p>`).join(""));
  html = preencher(html, "stack", p.stack.map((t, i) => `<li style="--i:${i}">${esc(t)}</li>`).join(""));
  html = preencher(html, "experiencia", htmlExperiencia(D.experiencia || []));
  html = preencher(html, "formacao", htmlFormacao(D.formacao || []));
  if ((D.formacao || []).length) html = html.replace('<div id="bloco-formacao" hidden>', '<div id="bloco-formacao">');
  html = preencher(html, "certificados", htmlCertificados(D.certificados || []));
  html = preencher(html, "projetos", htmlCardsProjetos(D.projetos));
  html = preencher(html, "jsonld-projetos", jsonLdProjetos(D));
  // Artigos só existem em português
  const comArtigos = lang === "pt" && artigos.length;
  html = preencher(html, "artigos", comArtigos ? htmlSecaoArtigos(artigos) : "");
  html = preencher(html, "nav-artigos", comArtigos
    ? `<li><a href="#artigos"><span class="ramo" aria-hidden="true">⎇</span> artigos</a></li>` : "");

  if (lang === "en") {
    html = trocarUmaVez(html, '<html lang="pt-BR">', '<html lang="en">');
    html = trocarUmaVez(html, '<link rel="canonical" href="https://www.alexmatias.dev.br/">', `<link rel="canonical" href="${urlEm("en", "/")}">`);
    html = trocarUmaVez(html, '<meta property="og:url" content="https://www.alexmatias.dev.br/">', `<meta property="og:url" content="${urlEm("en", "/")}">`);
    html = trocarUmaVez(html, '<a href="/" hreflang="pt-BR" lang="pt-BR" data-idioma="pt" aria-current="true">pt</a>', '<a href="/" hreflang="pt-BR" lang="pt-BR" data-idioma="pt">pt</a>');
    html = trocarUmaVez(html, '<a href="/en" hreflang="en" lang="en" data-idioma="en">en</a>', '<a href="/en" hreflang="en" lang="en" data-idioma="en" aria-current="true">en</a>');
    html = preencher(html, "noscript", NOSCRIPT_EN);
  }
  html = trocarUmaVez(html, `<meta property="og:locale" content="pt_BR">`,
    `<meta property="og:locale" content="${ogLocale(lang)}">\n  <meta property="og:locale:alternate" content="${ogLocale(lang === "en" ? "pt" : "en")}">`);
  html = traduzirMarcados(html, lang);
  gravar(lang === "en" ? "en/index.html" : "index.html", html);
}

/* ============================================================
   Moldura comum das páginas internas (projetos e artigos)
   ============================================================ */
// caminho: endereço da página sem o prefixo do idioma ("/projetos/x"); bilingue: se existe em inglês também
function cabecalho({ caminho, bilingue, titulo, descricao, imagem, imagemAlt, tipoOg, jsonLd, noindex, preloadImagem }) {
  const lang = I.idioma;
  const url = urlEm(lang, caminho);
  const base = I.prefixo; // "" ou "/en": links do menu levam à página inicial do mesmo idioma
  const caminhos = bilingue ? { pt: caminhoEm("pt", caminho), en: caminhoEm("en", caminho) } : { pt: caminhoEm("pt", caminho), en: "/en" };
  return `<!doctype html>
<html lang="${hreflang(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}">
  <meta name="author" content="Alex Matias">
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}">
  <meta name="color-scheme" content="dark light">
  <meta name="theme-color" content="#0b0f14">
  <link rel="canonical" href="${url}">
${bilingue ? tagsAlternadas(caminho) + "\n" : ""}  <meta property="og:type" content="${tipoOg || "website"}">
  <meta property="og:locale" content="${ogLocale(lang)}">${bilingue ? `
  <meta property="og:locale:alternate" content="${ogLocale(lang === "en" ? "pt" : "en")}">` : ""}
  <meta property="og:site_name" content="Alex Matias">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descricao)}">
  <meta property="og:image" content="${imagem}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(imagemAlt || titulo)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(titulo)}">
  <meta name="twitter:description" content="${esc(descricao)}">
  <meta name="twitter:image" content="${imagem}">
  <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
  <link rel="icon" href="/assets/icon-192.png" sizes="192x192" type="image/png">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <!-- Fontes no próprio site (sem esperar o Google Fonts): pré-carregadas para o texto aparecer logo -->
  <link rel="preload" href="/assets/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/jetbrains-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/style.css">${preloadImagem ? `
  <link rel="preload" href="${preloadImagem}" as="image" fetchpriority="high">` : ""}
  <script src="/js/tema.js"></script>
  <script src="/js/i18n.js"></script>
  <script async src="/js/analytics.js"></script>
  <script defer src="/js/pagina.js"></script>
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="pagina-interna">
  <a class="pular" href="#conteudo">${esc(tx("Pular para o conteúdo"))}</a>
  <header class="topo">
    <a class="marca" href="${base || "/"}" aria-label="${esc(tx("~/alex-matias: ir para o início"))}">
      <span class="marca-prompt">~/</span><span>alex-matias</span><span class="marca-cursor" aria-hidden="true"></span>
    </a>
    <nav class="nav" aria-label="${esc(tx("Seções"))}">
      <ul>
        <li><a href="${base}/#sobre"><span class="ramo" aria-hidden="true">⎇</span> ${tx("sobre")}</a></li>
        <li><a href="${base}/#experiencia"><span class="ramo" aria-hidden="true">⎇</span> ${tx("carreira")}</a></li>
        <li><a href="${base}/#certificados"><span class="ramo" aria-hidden="true">⎇</span> ${tx("certificados")}</a></li>
        <li><a href="${base}/#projetos"><span class="ramo" aria-hidden="true">⎇</span> ${tx("projetos")}</a></li>
        <li><a href="${base}/#contato"><span class="ramo" aria-hidden="true">⎇</span> ${tx("contato")}</a></li>
      </ul>
    </nav>
    <div class="topo-acoes">
      ${seletorIdioma(lang, caminhos)}
      <button class="btn-icone" type="button" id="alternar-tema" aria-label="${esc(tx("Alternar tema claro e escuro"))}">
        <svg class="ico-sol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></svg>
        <svg class="ico-lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>
      </button>
    </div>
  </header>
`;
}

function rodape() {
  return `
  <footer class="rodape">
    <p class="mono"><span class="ref">HEAD → main</span> · ${tx("feito à mão com HTML, CSS e JavaScript, sem framework")} · ${new Date().getFullYear()}</p>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
</body>
</html>
`;
}

const migalhas = (itens) => `<nav aria-label="${esc(tx("Você está em"))}"><ol class="migalhas">` +
  itens.map((it, i) => i === itens.length - 1
    ? `<li aria-current="page">${esc(it.nome)}</li>`
    : `<li><a href="${it.url}">${esc(it.nome)}</a></li>`).join("") + `</ol></nav>`;

const jsonLdMigalhas = (itens) => ({
  "@type": "BreadcrumbList",
  "itemListElement": itens.map((it, i) => ({ "@type": "ListItem", "position": i + 1, "name": it.nome, "item": SITE + it.url })),
});

const PESSOA = { "@type": "Person", "@id": `${SITE}/#alex`, "name": "Alex Matias", "url": `${SITE}/` };

/* ============================================================
   2. Páginas dos projetos
   ============================================================ */
function imagemDoProjeto(p) {
  if (existe(`assets/og/${p.slug}.png`)) return `${SITE}/assets/og/${p.slug}.png`;
  return `${SITE}/assets/og-image.png`;
}

function galeriaDialogo() {
  return `
  <dialog class="galeria" id="galeria" aria-labelledby="galeria-titulo">
    <div class="galeria-corpo">
      <div class="galeria-barra mono">
        <span id="galeria-num"></span>
        <span class="galeria-dica">${tx("clique na imagem para ver no tamanho real")}</span>
        <button class="btn-icone" type="button" data-fechar aria-label="${esc(tx("Fechar"))}">✕</button>
      </div>
      <div class="galeria-quadro" id="galeria-quadro"><img id="galeria-img" alt=""></div>
      <button class="galeria-seta galeria-ant" id="galeria-ant" type="button" aria-label="${esc(tx("Tela anterior"))}">‹</button>
      <button class="galeria-seta galeria-prox" id="galeria-prox" type="button" aria-label="${esc(tx("Próxima tela"))}">›</button>
      <div class="galeria-legenda"><h3 id="galeria-titulo"></h3><p id="galeria-texto"></p></div>
    </div>
  </dialog>`;
}

function paginaProjeto(p, D) {
  const lang = I.idioma;
  const base = I.prefixo;
  const caminho = `/projetos/${p.slug}`;
  const url = urlEm(lang, caminho);
  const seo = p.seo || {};
  const titulo = (seo.titulo || `${p.nome}: ${p.resumo}`) + " · Alex Matias";
  const descricao = seo.descricao || p.resumo;
  const a = p.apresentacao;
  const pasta = a ? "/" + String(a.pasta || "").replace(/^\/+/, "") : "";
  const trilha = [
    { nome: tx("Início"), url: base || "/" },
    { nome: tx("Projetos"), url: `${base}/#projetos` },
    { nome: p.nome, url: caminhoEm(lang, caminho) },
  ];

  const app = {
    "@type": "SoftwareApplication",
    "@id": url + "#software",
    "name": p.nome,
    "description": descricao,
    "url": url,
    "image": imagemDoProjeto(p),
    "applicationCategory": seo.categoria || "BusinessApplication",
    "operatingSystem": seo.sistema || "Windows",
    "inLanguage": hreflang(lang),
    "author": PESSOA,
    "keywords": (p.tags || []).join(", "),
  };
  if (p.demo) app.sameAs = p.demo;
  if (a) app.screenshot = a.telas.map((t) => `${SITE}${pasta}telas/${t.arquivo}.jpg`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, "url": url, "name": titulo, "description": descricao, "inLanguage": hreflang(lang), "about": { "@id": app["@id"] }, "isPartOf": { "@id": `${SITE}/#site` } },
      app,
      jsonLdMigalhas(trilha),
    ],
  };
  if (p.repo) jsonLd["@graph"].push({ "@type": "SoftwareSourceCode", "name": p.nome, "codeRepository": p.repo, "programmingLanguage": Object.keys(p.linguagens || {}), "author": PESSOA });

  const acoes = `<div class="projeto-acoes">` +
    (p.demo ? `<a class="btn btn-primario" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">${ICONE_PLAY} ${tx("abrir a demo")}</a>` : "") +
    (!p.demo && a ? `<a class="btn btn-primario" href="#apresentacao">${ICONE_PLAY} ${tx("ver a demonstração")}</a>` : "") +
    (p.repo ? `<a class="btn btn-secundario" href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">${ICONE_GITHUB} ${tx("código no GitHub")}</a>` : "") +
    `<a class="btn btn-secundario" href="${base}/#contato">${tx("falar comigo →")}</a></div>` +
    (p.repo ? "" : `<p class="projeto-nota mono">${tx("Repositório privado: código disponível sob consulta.")}</p>`);

  const apresentacao = a ? `
      <section class="projeto-secao" id="apresentacao" aria-labelledby="t-apresentacao">
        <h2 id="t-apresentacao"><span class="sinal mono">##</span> ${tx("Apresentação")}</h2>
        <video class="proj-video" src="${pasta}${esc(a.video)}"${a.capa ? ` poster="${pasta}${esc(a.capa)}"` : ""} controls playsinline preload="none" aria-label="${esc(tx("Vídeo de apresentação do {nome}", { nome: p.nome }))}"></video>
      </section>
      <section class="projeto-secao" aria-labelledby="t-tour">
        <h2 id="t-tour"><span class="sinal mono">##</span> ${tx("Tour pelas telas")}</h2>
        ${a.intro ? `<p class="tour-intro">${esc(a.intro)}</p>` : ""}
        <ol class="tour">
          ${a.telas.map((t, i) => `<li class="tela">
            <a class="tela-img" href="${pasta}telas/${t.arquivo}.jpg" data-indice="${i}" data-titulo="${esc(t.titulo)}" data-texto="${esc(t.texto)}" aria-label="${esc(tx("Ampliar: {titulo}", { titulo: t.titulo }))}">
              <img src="${pasta}telas/mini/${t.arquivo}.webp" alt="${esc(p.nome)}: ${esc(t.titulo)}" loading="lazy" width="720" height="405">
              <span class="tela-zoom" aria-hidden="true">${ICONE_ZOOM}</span>
            </a>
            <div class="tela-txt"><b><span class="tela-num mono">${String(i + 1).padStart(2, "0")}</span>${esc(t.titulo)}</b><span>${esc(t.texto)}</span></div>
          </li>`).join("\n          ")}
        </ol>
      </section>` : "";

  const outros = D.projetos.filter((x) => x !== p);
  const preloadImagem = a && a.capa ? `${pasta}${a.capa}` : "";
  const html = cabecalho({ caminho, bilingue: true, titulo, descricao, imagem: imagemDoProjeto(p), imagemAlt: `${p.nome}: ${p.resumo}`, jsonLd, preloadImagem }) + `
  <main id="conteudo" class="pagina">
    ${migalhas(trilha)}
    <header class="pagina-cab">
      <p class="secao-cmd mono"><span class="sinal">$</span> cd ~/repos/${esc(p.slug)}</p>
      <h1>${esc(p.nome)}</h1>
      <p class="pagina-lead">${esc(p.resumo)}</p>
      ${chips(p.tags, "repo-tags")}
      ${acoes}
    </header>
    ${apresentacao}
    <section class="projeto-secao" aria-labelledby="t-sobre">
      <h2 id="t-sobre"><span class="sinal mono">##</span> ${tx("Sobre o projeto")}</h2>
      <div class="pagina-texto">${(p.sobre && p.sobre.length ? p.sobre : [p.resumo]).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
    </section>
    ${(p.detalhes || []).length ? `<section class="projeto-secao" aria-labelledby="t-destaques">
      <h2 id="t-destaques"><span class="sinal mono">##</span> ${tx("Destaques")}</h2>
      <ul class="commit-itens">${p.detalhes.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
    </section>` : ""}
    <section class="projeto-secao" aria-labelledby="t-stack">
      <h2 id="t-stack"><span class="sinal mono">##</span> ${tx("Stack e linguagens")}</h2>
      ${chips(p.tags, "repo-tags")}
      <div class="pagina-linguagens">${barraLinguagens(p.linguagens)}</div>
    </section>
    <section class="projeto-secao" aria-labelledby="t-outros">
      <h2 id="t-outros"><span class="sinal mono">##</span> ${tx("Outros projetos")}</h2>
      <ul class="outros-projetos">
        ${outros.map((o) => `<li><a href="${caminhoEm(lang, `/projetos/${o.slug}`)}"><b>${esc(o.nome)}</b><span>${esc(o.resumo)}</span></a></li>`).join("\n        ")}
      </ul>
    </section>
    <aside class="pagina-cta">
      <div>
        <h2>${tx("Precisa de um sistema assim?")}</h2>
        <p>${tx("Sistemas de gestão, integrações e APIs em C# e .NET. Me conta o que você precisa.")}</p>
      </div>
      <a class="btn btn-primario" href="${base}/#contato">${tx("abrir um PR →")}</a>
    </aside>
  </main>` + (a ? galeriaDialogo() : "") + rodape();

  gravar(`${lang === "en" ? "en/" : ""}projetos/${p.slug}.html`, html);
}

/* ============================================================
   3. Artigos (artigos/*.md), só em português
   ============================================================ */
// Cabeçalho do arquivo entre "---": linhas "chave: valor"; listas como [a, b]
function lerFrontMatter(texto) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(texto);
  if (!m) return { meta: {}, corpo: texto };
  const meta = {};
  m[1].split(/\r?\n/).forEach((linha) => {
    const i = linha.indexOf(":");
    if (i < 0) return;
    const chave = linha.slice(0, i).trim();
    let valor = linha.slice(i + 1).trim();
    if (/^\[.*\]$/.test(valor)) valor = valor.slice(1, -1).split(",").map((v) => v.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    else if (valor === "true" || valor === "false") valor = valor === "true";
    else valor = valor.replace(/^["']|["']$/g, "");
    meta[chave] = valor;
  });
  return { meta, corpo: m[2] };
}

// Markdown simples: títulos, parágrafos, listas, citações, código, tabelas, negrito, itálico, links e linha
function markdown(md) {
  const inline = (t) => esc(t)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^\w*])_([^_]+)_(?=[^\w]|$)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m0, txt, href) => {
      const externo = /^https?:/.test(href.replace(/&amp;/g, "&"));
      return `<a href="${href}"${externo ? ' target="_blank" rel="noopener noreferrer"' : ""}>${txt}</a>`;
    });
  const linhas = md.replace(/\r\n/g, "\n").split("\n");
  const saida = [];
  let i = 0;
  while (i < linhas.length) {
    const l = linhas[i];
    if (/^```/.test(l)) {
      const lang = l.slice(3).trim();
      const codigo = [];
      i++;
      while (i < linhas.length && !/^```/.test(linhas[i])) codigo.push(linhas[i++]);
      i++;
      saida.push(`<pre class="codigo"${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${esc(codigo.join("\n"))}</code></pre>`);
      continue;
    }
    const titulo = /^(#{2,4})\s+(.*)$/.exec(l);
    if (titulo) {
      const n = titulo[1].length;
      const id = slugify(titulo[2]);
      saida.push(`<h${n} id="${id}">${inline(titulo[2])}</h${n}>`);
      i++;
      continue;
    }
    if (/^---\s*$/.test(l)) { saida.push("<hr>"); i++; continue; }
    // Tabela: | a | b |  seguida de |---|---|
    if (/^\|.*\|\s*$/.test(l) && i + 1 < linhas.length && /^\|[\s:|-]+\|\s*$/.test(linhas[i + 1])) {
      const celulas = (linha) => linha.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const cab = celulas(l);
      i += 2;
      const corpo = [];
      while (i < linhas.length && /^\|.*\|\s*$/.test(linhas[i])) corpo.push(celulas(linhas[i++]));
      saida.push(`<div class="tabela"><table><thead><tr>${cab.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>` +
        `<tbody>${corpo.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^>\s?/.test(l)) {
      const bloco = [];
      while (i < linhas.length && /^>\s?/.test(linhas[i])) bloco.push(linhas[i++].replace(/^>\s?/, ""));
      saida.push(`<blockquote><p>${inline(bloco.join(" "))}</p></blockquote>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l)) {
      const ordenada = /^\s*\d+\./.test(l);
      const itens = [];
      while (i < linhas.length && (ordenada ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/).test(linhas[i])) {
        itens.push(linhas[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
      }
      const tag = ordenada ? "ol" : "ul";
      saida.push(`<${tag}>${itens.map((t) => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
      continue;
    }
    if (!l.trim()) { i++; continue; }
    const par = [];
    while (i < linhas.length && linhas[i].trim() && !/^(```|#{2,4}\s|>|\s*[-*]\s|\s*\d+\.\s|---\s*$|\|)/.test(linhas[i])) par.push(linhas[i++]);
    saida.push(`<p>${inline(par.join(" "))}</p>`);
  }
  return saida.join("\n");
}

function carregarArtigos() {
  const pasta = path.join(RAIZ, "artigos");
  if (!fs.existsSync(pasta)) return [];
  return fs.readdirSync(pasta).filter((f) => f.endsWith(".md")).map((arquivo) => {
    const { meta, corpo } = lerFrontMatter(fs.readFileSync(path.join(pasta, arquivo), "utf8"));
    const palavras = corpo.split(/\s+/).filter(Boolean).length;
    return {
      slug: meta.slug || arquivo.replace(/\.md$/, ""),
      titulo: meta.titulo || arquivo,
      descricao: meta.descricao || "",
      data: meta.data || HOJE,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      rascunho: meta.rascunho === true,
      atualizado: meta.atualizado || "", // opcional: data da última revisão do artigo
      leitura: Math.max(1, Math.round(palavras / 200)),
      html: markdown(corpo),
    };
  }).filter((a) => !a.rascunho || COM_RASCUNHOS)
    .sort((a, b) => b.data.localeCompare(a.data));
}

const dataLonga = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

function paginaArtigo(art) {
  const caminho = `/artigos/${art.slug}`;
  const url = SITE + caminho;
  const titulo = `${art.titulo} · Alex Matias`;
  const trilha = [{ nome: "Início", url: "/" }, { nome: "Artigos", url: "/artigos" }, { nome: art.titulo, url: caminho }];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle", "@id": url, "headline": art.titulo, "description": art.descricao,
        "datePublished": dataHoraBr(art.data), "dateModified": dataHoraBr(art.atualizado || art.data), "inLanguage": "pt-BR",
        "author": PESSOA, "publisher": PESSOA, "mainEntityOfPage": url, "keywords": art.tags.join(", "),
        "image": `${SITE}/assets/og-image.png`,
      },
      jsonLdMigalhas(trilha),
    ],
  };
  const html = cabecalho({ caminho, bilingue: false, titulo, descricao: art.descricao, imagem: `${SITE}/assets/og-image.png`, tipoOg: "article", jsonLd, noindex: art.rascunho }) + `
  <main id="conteudo" class="pagina">
    ${migalhas(trilha)}
    <article class="artigo">
      <header class="pagina-cab">
        ${art.rascunho ? `<p class="selo-rascunho mono">rascunho · não publicado</p>` : ""}
        <p class="secao-cmd mono"><span class="sinal">$</span> cat artigos/${esc(art.slug)}.md</p>
        <h1>${esc(art.titulo)}</h1>
        <p class="pagina-lead">${esc(art.descricao)}</p>
        <p class="artigo-meta mono"><time datetime="${art.data}">${dataLonga(art.data)}</time> · ${art.leitura} min de leitura · por <a href="/">Alex Matias</a></p>
        ${chips(art.tags, "repo-tags")}
      </header>
      <div class="artigo-corpo">${art.html}</div>
    </article>
    <aside class="pagina-cta">
      <div>
        <h2>Ficou alguma dúvida?</h2>
        <p>Me chama para conversar sobre o assunto, ou sobre um projeto.</p>
      </div>
      <a class="btn btn-primario" href="/#contato">abrir um PR →</a>
    </aside>
  </main>` + rodape();
  gravar(`artigos/${art.slug}.html`, html);
}

const cartaoArtigo = (art) => `<li><a class="artigo-card" href="/artigos/${art.slug}">` +
  `<span class="artigo-meta mono"><time datetime="${art.data}">${dataLonga(art.data)}</time> · ${art.leitura} min</span>` +
  `<b>${esc(art.titulo)}</b><span>${esc(art.descricao)}</span></a></li>`;

function htmlSecaoArtigos(artigos) {
  return `<section class="secao" id="artigos" data-commit="blog">
      <header class="secao-cab">
        <p class="secao-cmd mono"><span class="sinal">$</span> ls ~/artigos</p>
        <h2>Artigos</h2>
        <p class="secao-sub">O que aprendi resolvendo problemas de verdade em sistemas .NET.</p>
      </header>
      <ul class="lista-artigos">${artigos.slice(0, 4).map(cartaoArtigo).join("")}</ul>
      ${artigos.length > 4 ? `<p><a class="btn btn-secundario" href="/artigos">todos os artigos →</a></p>` : ""}
    </section>`;
}

function paginaIndiceArtigos(artigos) {
  const caminho = "/artigos";
  const url = SITE + caminho;
  const titulo = "Artigos sobre C#, .NET e Entity Framework · Alex Matias";
  const descricao = "Artigos de Alex Matias sobre C#, .NET, Entity Framework, SQL e performance, a partir de problemas reais em sistemas corporativos.";
  const trilha = [{ nome: "Início", url: "/" }, { nome: "Artigos", url: caminho }];
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "Blog", "@id": url, "name": "Artigos de Alex Matias", "url": url, "author": PESSOA, "inLanguage": "pt-BR",
      "blogPost": artigos.map((a) => ({ "@type": "TechArticle", "headline": a.titulo, "url": `${SITE}/artigos/${a.slug}`, "datePublished": dataHoraBr(a.data) })) },
    jsonLdMigalhas(trilha),
  ] };
  const html = cabecalho({ caminho, bilingue: false, titulo, descricao, imagem: `${SITE}/assets/og-image.png`, jsonLd }) + `
  <main id="conteudo" class="pagina">
    ${migalhas(trilha)}
    <header class="pagina-cab">
      <p class="secao-cmd mono"><span class="sinal">$</span> ls ~/artigos</p>
      <h1>Artigos</h1>
      <p class="pagina-lead">O que aprendi resolvendo problemas de verdade em sistemas .NET.</p>
    </header>
    <ul class="lista-artigos">${artigos.map(cartaoArtigo).join("")}</ul>
  </main>` + rodape();
  gravar("artigos/index.html", html);
}

/* ============================================================
   4. sitemap.xml e robots.txt
   ------------------------------------------------------------
   Páginas nos dois idiomas entram uma vez por idioma, cada uma
   com os links (xhtml:link) para a versão no outro idioma.
   ============================================================ */
function gerarSitemap(D, artigos) {
  const urls = [];
  const entrada = (loc, { imagens, prioridade, alternadas }) => urls.push(
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${HOJE}</lastmod>\n    <priority>${prioridade}</priority>\n` +
    (alternadas || []).map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}"/>\n`).join("") +
    (imagens || []).map((im) => `    <image:image><image:loc>${im}</image:loc></image:image>\n`).join("") +
    `  </url>`);
  const bilingue = (caminho, opcoes) => {
    const alternadas = IDIOMAS.map((l) => ({ lang: hreflang(l), href: urlEm(l, caminho) }))
      .concat([{ lang: "x-default", href: urlEm("pt", caminho) }]);
    IDIOMAS.forEach((l) => entrada(urlEm(l, caminho), Object.assign({}, opcoes, { alternadas })));
  };

  bilingue("/", { imagens: [`${SITE}/assets/og-image.png`], prioridade: "1.0" });
  D.projetos.forEach((p) => {
    const a = p.apresentacao;
    const pasta = a ? "/" + String(a.pasta || "").replace(/^\/+/, "") : "";
    bilingue(`/projetos/${p.slug}`, {
      imagens: a ? a.telas.map((t) => `${SITE}${pasta}telas/${t.arquivo}.jpg`) : [imagemDoProjeto(p)],
      prioridade: p.destaque ? "0.8" : "0.6",
    });
  });
  const publicados = artigos.filter((a) => !a.rascunho);
  if (publicados.length) {
    entrada(`${SITE}/artigos`, { prioridade: "0.7" });
    publicados.forEach((a) => entrada(`${SITE}/artigos/${a.slug}`, { prioridade: "0.7" }));
  }
  gravar("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>\n`);
  return urls.length;
}

function gerarRobots() {
  gravar("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
}

/* ============================================================
   5. Otimização: CSS compactado e versão nos arquivos
   ------------------------------------------------------------
   O CSS perde comentários e espaços (os textos entre aspas ficam
   intactos). Cada referência a css/*.css e js/*.js nas páginas
   ganha "?v=<hash do conteúdo>": o Vercel pode guardar esses
   arquivos em cache por um ano, e quando um deles muda o
   endereço muda junto e o navegador baixa a versão nova.
   ============================================================ */
function minificarCss(css) {
  // Separa os textos entre aspas, que não podem ser mexidos (ex.: content: " →")
  return css.split(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/).map((parte, i) => {
    if (i % 2 === 1) return parte;
    return parte
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{};,])\s*/g, "$1")
      .replace(/:\s+/g, ":") // só o espaço DEPOIS dos dois-pontos: ".x :not(a)" continua igual
      .replace(/;}/g, "}");
  }).join("").trim();
}

function otimizarArquivos() {
  const crypto = require("crypto");
  const css = path.join(DIST, "css", "style.css");
  const original = fs.statSync(css).size;
  fs.writeFileSync(css, minificarCss(fs.readFileSync(css, "utf8")));
  const versao = {};
  const arquivos = ["css/style.css"].concat(fs.readdirSync(path.join(DIST, "js")).map((f) => "js/" + f));
  arquivos.forEach((rel) => {
    versao[rel] = crypto.createHash("sha1").update(fs.readFileSync(path.join(DIST, rel))).digest("hex").slice(0, 8);
  });
  const paginas = [];
  (function varrer(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
      const p = path.join(dir, d.name);
      if (d.isDirectory()) varrer(p);
      else if (d.name.endsWith(".html")) paginas.push(p);
    });
  })(DIST);
  paginas.forEach((pagina) => {
    const html = fs.readFileSync(pagina, "utf8").replace(/(href|src)="(\/?)(css\/[\w.-]+\.css|js\/[\w.-]+\.js)"/g,
      (m, attr, barra, rel) => (versao[rel] ? `${attr}="${barra}${rel}?v=${versao[rel]}"` : m));
    fs.writeFileSync(pagina, html);
  });
  return { cssAntes: original, cssDepois: fs.statSync(css).size, paginas: paginas.length };
}

/* ============================================================
   Execução
   ============================================================ */
function main() {
  const inicio = Date.now();

  // Para antes de tudo se algum texto do código estiver sem tradução
  const faltando = require("./checar-traducoes").checar();
  if (faltando.length) throw new Error("Textos sem tradução em js/i18n.js:\n  " + faltando.join("\n  "));

  const bruto = carregarDadosBrutos();
  const artigos = carregarArtigos();
  const publicados = artigos.filter((a) => !a.rascunho);

  // Esvazia dist/ (sem apagar a pasta em si, que no Windows pode estar aberta num terminal)
  fs.mkdirSync(DIST, { recursive: true });
  fs.readdirSync(DIST).forEach((item) => fs.rmSync(path.join(DIST, item), { recursive: true, force: true }));
  ["css", "js", "assets", "404.html", "favicon.ico", "site.webmanifest"].forEach(copiar);

  let D = null;
  IDIOMAS.forEach((lang) => {
    I = I18N.criar(lang);
    D = dadosEm(bruto);
    gerarIndex(D, publicados);
    D.projetos.forEach((p) => paginaProjeto(p, D));
  });

  // Artigos, sitemap e robots (em português)
  I = I18N.criar("pt");
  D = dadosEm(bruto);
  artigos.forEach(paginaArtigo);
  if (publicados.length) paginaIndiceArtigos(publicados);
  const n = gerarSitemap(D, artigos);
  gerarRobots();
  const otim = otimizarArquivos();

  console.log(`build ok em ${Date.now() - inicio} ms → dist/`);
  console.log(`  idiomas: ${IDIOMAS.join(", ")} (/ e /en)`);
  console.log(`  páginas de projeto: ${D.projetos.map((p) => "/projetos/" + p.slug).join(", ")} (e /en/projetos/...)`);
  console.log(`  artigos: ${publicados.length} publicado(s)` + (COM_RASCUNHOS ? `, ${artigos.length - publicados.length} rascunho(s) gerado(s) para revisão` : ""));
  console.log(`  sitemap: ${n} endereço(s)`);
  console.log(`  css: ${(otim.cssAntes / 1024).toFixed(1)} KB → ${(otim.cssDepois / 1024).toFixed(1)} KB; versão nos arquivos de ${otim.paginas} página(s)`);
}

main();
