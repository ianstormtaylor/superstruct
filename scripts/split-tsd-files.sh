#!/bin/bash

set -euo pipefail

find dist -name '*.d.ts' -print0 | while IFS= read -r -d $'\0' file; do
  echo "  $file -> ${file%.d.ts}.d.cts"
  cp "$file" "${file%.d.ts}.d.cts"
  echo "  $file -> ${file%.d.ts}.d.mts"
  cp "$file" "${file%.d.ts}.d.mts"
  rm "$file"
done

find dist -name '*.d.cts' -print0 | while IFS= read -r -d $'\0' file; do
  echo "  $file"
  sed -e 's/\.d\.ts/.d.cts/' -i.bak "$file"
  sed -e 's/\.js/.cjs/' -i.bak "$file"
done

find dist -name '*.d.mts' -print0 | while IFS= read -r -d $'\0' file; do
  echo "  $file"
  sed -e 's/\.d\.ts/.d.mts/' -i.bak "$file"
  sed -e 's/\.js/.mjs/' -i.bak "$file"
done

find dist -name '*.bak' -print0 | xargs -0 rm
