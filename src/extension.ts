import * as vscode from "vscode";
import CodeActionProvider from "./CodeActionProvider";
import generateGetter from "./commands/generateGetter";

export function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    new CodeActionProvider().register(),
    vscode.commands.registerCommand(
      "golang-code-actions.generate-getter",
      generateGetter
    )
  );
}

export function deactivate() {}
