#!/usr/bin/env node
/*
 * Servidor local que imita o Vercel, para testar o resultado do build:
 * serve dist/ com os cabeçalhos do vercel.json, endereços sem ".html" (cleanUrls)
 * e a página 404.html.
 *
 * Uso:  node tools/build.js && node tools/servidor.js   →  http://localhost:5510
 *       PORTA=8080 node tools/servidor.js
 */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
const DIST = path.join(RAIZ, "dist");
const PORTA = Number(process.env.PORTA) || 5510;
const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, "vercel.json"), "utf8"));
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".mp4": "video/mp4", ".pdf": "application/pdf",
  ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

if (!fs.existsSync(DIST)) {
  console.error("Pasta dist/ não existe. Rode antes: node tools/build.js");
  process.exit(1);
}

function arquivoDe(url) {
  let p = path.join(DIST, decodeURIComponent(url));
  if (!p.startsWith(DIST)) return null; // não sai da pasta dist
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  else if (!fs.existsSync(p) && fs.existsSync(p + ".html")) p += ".html";
  return fs.existsSync(p) ? p : null;
}

http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  for (const regra of cfg.headers || []) {
    const re = new RegExp("^" + regra.source.replace("(.*)", ".*") + "$");
    if (re.test(url)) regra.headers.forEach((h) => res.setHeader(h.key, h.value));
  }
  res.setHeader("Cache-Control", "no-store"); // sempre a versão mais nova durante os testes
  const arq = arquivoDe(url);
  if (!arq) {
    res.writeHead(404, { "Content-Type": TIPOS[".html"] });
    return res.end(fs.readFileSync(path.join(DIST, "404.html")));
  }
  if (!res.getHeader("Content-Type")) res.setHeader("Content-Type", TIPOS[path.extname(arq)] || "application/octet-stream");

  // Vídeos: responde por partes (Range), como um servidor de verdade, para o player conseguir avançar
  const tamanho = fs.statSync(arq).size;
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (range) {
    const ini = range[1] ? Number(range[1]) : 0;
    const fim = range[2] ? Number(range[2]) : tamanho - 1;
    res.writeHead(206, { "Content-Range": `bytes ${ini}-${fim}/${tamanho}`, "Accept-Ranges": "bytes", "Content-Length": fim - ini + 1 });
    return fs.createReadStream(arq, { start: ini, end: fim }).pipe(res);
  }
  res.setHeader("Content-Length", tamanho);
  fs.createReadStream(arq).pipe(res);
}).listen(PORTA, () => console.log(`servindo dist/ em http://localhost:${PORTA}`));
