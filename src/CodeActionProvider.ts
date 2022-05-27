import * as vscode from "vscode";

export default class CodeActionProvider implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return undefined;
    }

    // const line = document.lineAt(editor.selection.start.line);
    // document.getText(editor.selection);
    // if (!fnRegex.test(line.text)) {
    //   return undefined;
    // }
    const action = new vscode.CodeAction(
      "Generate getter for un-exported fields",
      vscode.CodeActionKind.RefactorRewrite
    );
    action.command = {
      command: "golang-code-actions.generate-getter",
      title: "generate getter for un-exported fields",
    };
    return [action];
  }

  register(): vscode.Disposable {
    return vscode.languages.registerCodeActionsProvider("go", this, {
      providedCodeActionKinds: [vscode.CodeActionKind.RefactorRewrite],
    });
  }
}
