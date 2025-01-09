#!/bin/sh

set -ex
mkdir -p out
cp node_modules/tree-sitter-go/tree-sitter-go.wasm ./out/
cp node_modules/web-tree-sitter/tree-sitter.wasm ./out/

