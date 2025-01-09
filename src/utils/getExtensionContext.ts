import type * as vscode from "vscode";

let value: vscode.ExtensionContext | undefined;

export function setExtensionContext(ctx: vscode.ExtensionContext) {
  value = ctx;
}

export default function getExtensionContext():
  | vscode.ExtensionContext
  | undefined {
  return value;
}
