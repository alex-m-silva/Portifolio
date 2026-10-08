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
foto assets/favicon-32.png        32  32 "icone.html?tam=32"

# favicon.ico com o PNG de 32px dentro (formato aceito por todos os navegadores atuais)
python - <<'PY'
import struct
png = open("assets/favicon-32.png", "rb").read()
cab = struct.pack("<HHH", 0, 1, 1) + struct.pack("<BBBBHHII", 32, 32, 0, 0, 1, 32, len(png), 6 + 16)
open("favicon.ico", "wb").write(cab + png)
print("gerado favicon.ico")
PY
rm assets/favicon-32.png
