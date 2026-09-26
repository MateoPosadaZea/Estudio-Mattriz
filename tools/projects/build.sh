#!/usr/bin/env bash
# Regenera los modelos de proyecto desde el HTML guardado del vivo y procesa sus medios (con caché).
# Uso: bash tools/projects/build.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
tmp=$(mktemp -d)
for f in reference/html/project_*.html; do
  slug=${f#reference/html/project_}; slug=${slug%.html}
  [ "$slug" = gravity-font ] && continue   # 404 en el vivo
  python3 tools/projects/extract.py "$f" > "$tmp/$slug.json"
done
python3 tools/projects/media.py "$tmp" public/media/projects src/data/projects | grep -v '^ok' || true
rm -rf "$tmp"
