import type * as vscode from "vscode";

export default function* iterateTextLines(
  document: vscode.TextDocument
): Iterable<vscode.TextLine> {
  for (let i = 0; i < document.lineCount; i += 1) {
    yield document.lineAt(i);
  }
}
