#!/bin/sh

set -ex
rm -rf out 
. ./scripts/copy-static.sh
npx esbuild ./src/extension.ts --bundle --outfile=out/extension.js --external:vscode --format=cjs --platform=node $*
