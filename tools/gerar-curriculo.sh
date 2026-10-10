#!/usr/bin/env bash
# Gera assets/curriculo/Alex-Matias-CV-en.pdf a partir de tools/curriculo-en.html,
# imprimindo a página com o Edge (ou o Chrome) sem abrir janela. Só no Windows.
# Uso: bash tools/gerar-curriculo.sh
set -euo pipefail
cd "$(dirname "$0")/.."

NAVEGADOR=""
for c in "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
         "/c/Program Files/Microsoft/Edge/Application/msedge.exe" \
         "/c/Program Files/Google/Chrome/Application/chrome.exe"; do
  if [ -f "$c" ]; then NAVEGADOR="$c"; break; fi
done
[ -n "$NAVEGADOR" ] || { echo "Edge ou Chrome não encontrado"; exit 1; }

ORIGEM="$(cygpath -w "$PWD/tools/curriculo-en.html")"
DESTINO="$(cygpath -w "$PWD/assets/curriculo/Alex-Matias-CV-en.pdf")"
PERFIL="$(mktemp -d)"
"$NAVEGADOR" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf-no-header \
  --user-data-dir="$(cygpath -w "$PERFIL")" --print-to-pdf="$DESTINO" "file:///${ORIGEM//\\//}" 2>/dev/null || true
rm -rf "$PERFIL"
[ -s "assets/curriculo/Alex-Matias-CV-en.pdf" ] && echo "ok → assets/curriculo/Alex-Matias-CV-en.pdf"
