import * as vscode from "vscode";

export default async function useTextDocument(path: string) {
  const uri = vscode.Uri.file(path);
  const document = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(document);
  if (document.isDirty) {
    await vscode.commands.executeCommand("workbench.action.files.revert");
  }
  return {
    document,
    editor,
  };
}
