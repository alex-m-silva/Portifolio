#!/usr/bin/env bash
# Regera as imagens de assets/ a partir dos modelos desta pasta, com o Chrome em modo headless.
# Uso (Git Bash, na raiz do projeto): bash tools/gerar-imagens.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
RAIZ="$(pwd -W 2>/dev/null || pwd)"

foto() { # foto <arquivo-saida> <largura> <altura> <pagina?query>
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --default-background-color=00000000 --virtual-time-budget=4000 \
    --window-size="$2,$3" --screenshot="$RAIZ/$1" "file:///$RAIZ/tools/$4" >/dev/null 2>&1
  echo "gerado $1"
}

foto assets/og-image.png        1200 630 "og-image.html"
foto assets/icon-192.png         192 192 "icone.html?tam=192"
foto assets/icon-512.png         512 512 "icone.html?tam=512"
foto assets/icon-maskable-512.png 512 512 "icone.html?tam=512&maskable=1"
foto assets/apple-touch-icon.png 180 180 "icone.html?tam=180&maskable=1"
foto assets/favicon-16.png        16  16 "icone.html?tam=16"
foto assets/favicon-32.png        32  32 "icone.html?tam=32"
foto assets/favicon-48.png        48  48 "icone.html?tam=48"

# Uma imagem de compartilhamento por projeto (assets/og/<slug>.png), lida pelo build
mkdir -p assets/og
for slug in $(node -e "global.window={};global.atob=b=>Buffer.from(b,'base64').toString('binary');eval(require('fs').readFileSync('js/data.js','utf8'));console.log(window.PORTFOLIO.projetos.map(p=>p.slug).join(' '))"); do
  foto "assets/og/$slug.png" 1200 630 "og-projeto.html?slug=$slug"
done

# favicon.ico com 16, 32 e 48 px (PNG dentro do .ico). O Google só usa ícones com tamanho
# múltiplo de 48 px, por isso o de 48 é obrigatório.
python - <<'PY'
import struct
tamanhos = [16, 32, 48]
pngs = [open("assets/favicon-%d.png" % t, "rb").read() for t in tamanhos]
cab = struct.pack("<HHH", 0, 1, len(pngs))
desloc = 6 + 16 * len(pngs)
entradas = b""
for t, png in zip(tamanhos, pngs):
    entradas += struct.pack("<BBBBHHII", t, t, 0, 0, 1, 32, len(png), desloc)
    desloc += len(png)
open("favicon.ico", "wb").write(cab + entradas + b"".join(pngs))
print("gerado favicon.ico (16, 32 e 48 px)")
PY
rm assets/favicon-16.png assets/favicon-32.png assets/favicon-48.png
