import * as vscode from "vscode";
import iterateSelectedToken from "./utils/iterateSelectedToken";

export default class CodeActionProvider implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const actions: vscode.CodeAction[] = [];

    const action1 = new vscode.CodeAction(
      "Generate getter for un-exported fields",
      vscode.CodeActionKind.RefactorRewrite
    );
    action1.command = {
      command: "golang-code-actions.generate-getter",
      title: "generate getter for un-exported fields",
    };
    actions.push(action1);

    const action2 = new vscode.CodeAction(
      "Generate constructor for struct",
      vscode.CodeActionKind.RefactorRewrite
    );
    action2.command = {
      command: "golang-code-actions.generate-constructor",
      title: "generate constructor for struct",
    };
    actions.push(action2);

    return actions;
  }

  register(): vscode.Disposable {
    return vscode.languages.registerCodeActionsProvider("go", this, {
      providedCodeActionKinds: [vscode.CodeActionKind.RefactorRewrite],
    });
  }
}
