import * as vscode from "vscode";
import lowerFirst from "../utils/lowerFirst";
import upperFirst from "../utils/upperFirst";
import findStruct from "../parser/findStruct";
import parseDocument from "../parser/parseDocument";
import toStructReceiver from "../parser/toStructReceiver";

export default async function generateConstructor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selections } = editor;
  const tree = await parseDocument(document.getText());
  const edits = Array.from(
    (function* edit() {
      for (const struct of findStruct(tree.rootNode)) {
        const range = new vscode.Range(
          document.positionAt(struct.node.startIndex),
          document.positionAt(struct.node.endIndex)
        );
        const isSelected = selections.some((i) => i.intersection(range));
        if (!isSelected) {
          continue;
        }

        let selectedFields = struct.fields.filter((field) => {
          const range = new vscode.Range(
            document.positionAt(field.node.startIndex),
            document.positionAt(field.node.endIndex)
          );
          const isSelected = selections.some((i) => i.intersection(range));
          return isSelected;
        });
        // 不选中字段视为选中所有字段。
        if (selectedFields.length === 0 || selections.every((i) => i.isEmpty)) {
          selectedFields = struct.fields;
        }
        // 选中所有字段时，使用匿名分配并只用一个返回值。
        const compact = selectedFields.length === struct.fields.length;

        const receiver = toStructReceiver(struct);
        let text = `\
func New${upperFirst(struct.name)}${struct.typeParamDecl}(${
          selectedFields.length > 0
            ? `
${selectedFields.map((f) => `\t${lowerFirst(f.name)} ${f.type},`).join("\n")}
`
            : ""
        }) `;
        if (compact) {
          text += `*${receiver} {
\treturn &${receiver}{
${selectedFields.map((i) => `\t\t${lowerFirst(i.name)},`).join("\n")}
\t}
}
`;
        } else {
          text += `(obj *${receiver}, err error) {
\tobj = &${receiver}{
${selectedFields.map((f) => `\t\t${f.name}: ${lowerFirst(f.name)},`).join("\n")}
\t}
\treturn
}
`;
        }
        text += "\n";

        const location = document.positionAt(struct.node.startIndex);
        yield new vscode.TextEdit(new vscode.Range(location, location), text);
      }
    })()
  );

  if (edits.length === 0) {
    vscode.window.showInformationMessage("no struct detected in selection");
    return;
  }

  const edit = new vscode.WorkspaceEdit();
  edit.set(document.uri, edits);
  await vscode.workspace.applyEdit(edit);
}
