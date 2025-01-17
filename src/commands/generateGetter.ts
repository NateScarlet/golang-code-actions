import * as vscode from "vscode";
import findStruct from "../parser/findStruct";
import toIdentifier from "../utils/toIdentifier";
import isExportedName from "../utils/isExportedName";
import toExportedName from "../utils/toExportedName";
import parseDocument from "../parser/parseDocument";
import toStructReceiver from "../parser/toStructReceiver";
import toFieldName from "../parser/toFieldName";

export default async function generateGetter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selections } = editor;

  const tree = await parseDocument(document.getText());
  const edits = Array.from(
    (function* edit() {
      for (const struct of findStruct(tree.rootNode)) {
        const structIdentifier = toIdentifier(struct.name);
        for (const field of struct.fields) {
          const fieldName = toFieldName(field);
          if (isExportedName(fieldName)) {
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
          const text = `

func (${structIdentifier} ${toStructReceiver(struct)}) ${toExportedName(
            toIdentifier(fieldName, undefined, true)
          )}() ${field.type} {
\treturn ${structIdentifier}.${fieldName}
}`;
          const location = document.positionAt(struct.node.endIndex);
          yield new vscode.TextEdit(new vscode.Range(location, location), text);
        }
      }
    })()
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
