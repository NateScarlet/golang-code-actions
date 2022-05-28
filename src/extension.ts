import * as vscode from "vscode";
import CodeActionProvider from "./CodeActionProvider";
import generateConstructor from "./commands/generateConstructor";
import generateGetter from "./commands/generateGetter";

export function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    new CodeActionProvider().register(),
    vscode.commands.registerCommand(
      "golang-code-actions.generate-getter",
      generateGetter
    ),
    vscode.commands.registerCommand(
      "golang-code-actions.generate-constructor",
      generateConstructor
    )
  );
}

export function deactivate() {}
