// Codifica um contato para js/data.js (base64 do texto ao contrário), lido pela função revelar().
// Uso: node tools/codificar.js "seu@email.com"
var texto = process.argv[2];
if (!texto) {
  console.log('Uso: node tools/codificar.js "texto"');
  process.exit(1);
}
var codigo = Buffer.from(texto.split("").reverse().join(""), "utf8").toString("base64");
console.log('revelar("' + codigo + '")');
