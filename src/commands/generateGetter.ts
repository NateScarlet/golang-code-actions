import * as vscode from "vscode";
import findStruct, { type Struct } from "../parser/findStruct";
import toIdentifier from "../utils/toIdentifier";
import isExportedName from "../utils/isExportedName";
import toExportedName from "../utils/toExportedName";
import parseDocument from "../parser/parseDocument";
import toStructReceiver from "../parser/toStructReceiver";
import toFieldName from "../parser/toFieldName";
import findStructMethod from "../parser/findStructMethod";

export default async function generateGetter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selections } = editor;

  const tree = await parseDocument(document.getText());

  const receiverPrefixCache = new Map<string, "" | "*">();

  function receiverPrefix(struct: Struct) {
    const v = receiverPrefixCache.get(struct.name);
    if (v != null) {
      return v;
    }
    let pointerCount = 0;
    let valueCount = 0;
    for (const method of findStructMethod(tree.rootNode)) {
      if (method.receiver !== struct.name) {
        continue;
      }
      if (method.isPointerReceiver) {
        pointerCount += 1;
      } else {
        valueCount += 1;
      }
    }
    // 默认使用指针接收，如果需要值接收，用户可以自己调整代码。
    const vv = valueCount > pointerCount ? "" : "*";
    receiverPrefixCache.set(struct.name, vv);
    return vv;
  }

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
          let text = "";
          for (const line of (function* lines() {
            yield "";
            const rp = receiverPrefix(struct);
            const returnDecl = rp === "*" ? `(_ ${field.type})` : field.type;
            yield `func (${structIdentifier} ${rp}${toStructReceiver(
              struct
            )}) ${toExportedName(
              toIdentifier(fieldName, undefined, true)
            )}() ${returnDecl} {`;
            if (rp === "*") {
              yield `\tif ${structIdentifier} == nil {`;
              yield `\t\treturn`;
              yield `\t}`;
            }
            yield `\treturn ${structIdentifier}.${fieldName}`;
            yield `}`;
          })()) {
            text += "\n";
            text += line;
          }
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
