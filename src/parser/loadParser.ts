import Parser from "web-tree-sitter";
// import { Wasm } from "@vscode/wasm-wasi/v1";
import * as vscode from "vscode";
import extensionPath from "../utils/extensionPath";

export type { Parser };

async function load() {
  // const wasm = await Wasm.load();
  await Parser.init({
    locateFile: (pathArg: string): string => {
      return vscode.Uri.file(extensionPath("out", pathArg)).fsPath;
    },
  });
  const parser = new Parser();
  const Go = await Parser.Language.load(
    vscode.Uri.file(extensionPath("out", "tree-sitter-go.wasm")).fsPath
  );
  parser.setLanguage(Go);
  return parser;
}

let loadOnce: ReturnType<typeof load> | undefined;

export default function loadParser() {
  if (!loadOnce) {
    loadOnce = load();
    loadOnce.catch(() => {
      loadOnce = undefined;
    });
  }
  return loadOnce;
}
