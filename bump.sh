#!/bin/bash
# 새 버전 배포: ./bump.sh  → 버전 번호를 1 올리고 커밋·푸시
set -e
cd "$(dirname "$0")"
cur=$(grep -o 'const APP_VER="[0-9]*"' index.html | grep -o '[0-9]*')
new=$((cur+1))
sed -i '' "s/const APP_VER=\"$cur\"/const APP_VER=\"$new\"/" index.html
sed -i '' "s/travel-lingo-v$cur/travel-lingo-v$new/" sw.js
echo "{\"v\":\"$new\"}" > version.json
git add -A && git commit -q -m "v$new 배포" && git push -q origin main
echo "배포됨: v$cur -> v$new"
