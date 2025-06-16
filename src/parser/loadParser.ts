import Parser from "web-tree-sitter";
import * as vscode from "vscode";
import extensionUri from "../utils/extensionUri";

export type { Parser };

function toFile(uri: vscode.Uri): string {
  if (vscode.env.uiKind === vscode.UIKind.Web) {
    return uri.toString();
  }
  return uri.fsPath;
}

async function load() {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "initiating parser",
    },
    async (progress) => {
      progress.report({ message: "load parser" });
      await Parser.init({
        locateFile: (pathArg: string): string => {
          return toFile(extensionUri("out", pathArg));
        },
      });
      const parser = new Parser();
      progress.report({ message: "load golang grammar" });
      const Go = await Parser.Language.load(
        toFile(extensionUri("out", "tree-sitter-go.wasm"))
      );
      parser.setLanguage(Go);
      return parser;
    }
  );
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
