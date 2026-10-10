#!/usr/bin/env node
/*
 * Confere se todo texto passado para tradução no código tem versão em inglês em js/i18n.js.
 * Procura as chamadas tx("...") / t("...") em js/main.js, pagina.js, analytics.js e tools/build.js.
 * Uso: node tools/checar-traducoes.js   (o build também roda esta checagem)
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");

function dicionario() {
  const ctx = { window: { document: { documentElement: { lang: "en" } } } };
  vm.runInNewContext(fs.readFileSync(path.join(RAIZ, "js/i18n.js"), "utf8"), ctx);
  return ctx.window.I18N.EN;
}

function chamadas(arquivo) {
  const src = fs.readFileSync(path.join(RAIZ, arquivo), "utf8");
  const achados = [];
  const re = /\b(?:tx|t)\(\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src))) achados.push(JSON.parse('"' + m[1] + '"'));
  return achados;
}

function checar() {
  const EN = dicionario();
  const faltando = [];
  ["js/main.js", "js/pagina.js", "js/analytics.js", "tools/build.js"].forEach((arq) => {
    if (!fs.existsSync(path.join(RAIZ, arq))) return;
    chamadas(arq).forEach((txt) => {
      if (!Object.prototype.hasOwnProperty.call(EN, txt)) faltando.push(`${arq}: "${txt}"`);
    });
  });
  return faltando;
}

module.exports = { checar, dicionario };

if (require.main === module) {
  const faltando = checar();
  if (faltando.length) {
    console.error("Textos sem tradução em js/i18n.js:\n  " + faltando.join("\n  "));
    process.exit(1);
  }
  console.log("traduções ok: todos os textos marcados têm versão em inglês");
}
