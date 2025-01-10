import * as vscode from "vscode";
import findStruct from "../parser/findStruct";
import arrayFromAsync from "../utils/arrayFromAsync";
import defaultIdentifier from "../utils/defaultIdentifier";
import isExportedName from "../utils/isExportedName";
import toExportedName from "../utils/toExportedName";

export default async function generateGetter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selections } = editor;

  const edits = Array.from(
    await arrayFromAsync(
      (async function* edit() {
        for await (const struct of findStruct(document.getText())) {
          const structIdentifier = defaultIdentifier(struct.name);
          for (const field of struct.fields) {
            if (isExportedName(field.name)) {
              continue;
            }
            const range = new vscode.Range(
              document.positionAt(field.node.startIndex),
              document.positionAt(field.typeNode.endIndex)
            );
            const expandedRange = new vscode.Range(
              document.lineAt(range.start).range.start,
              document.lineAt(range.end).range.end
            );
            const isSelected = selections.some((i) =>
              i.intersection(i.isEmpty ? expandedRange : range)
            );
            if (!isSelected) {
              continue;
            }
            const paramNames =
              struct.typeParams.length > 0
                ? `[${struct.typeParams.map((i) => i.name).join(",")}]`
                : "";
            const text = `

func (${structIdentifier} ${struct.name}${paramNames}) ${toExportedName(
              field.name
            )}() ${field.type} {
\treturn ${structIdentifier}.${field.name}
}`;
            const location = document.positionAt(struct.node.endIndex);
            yield new vscode.TextEdit(
              new vscode.Range(location, location),
              text
            );
          }
        }
      })()
    )
  );
  if (edits.length === 0) {
    vscode.window.showInformationMessage(
      "no un-exported struct field detected in selection"
    );
    return;
  }
  const edit = new vscode.WorkspaceEdit();
  edit.set(document.uri, edits);
  await vscode.workspace.applyEdit(edit);
}
