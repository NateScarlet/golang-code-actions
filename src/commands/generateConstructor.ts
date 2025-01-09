import * as vscode from "vscode";
import lowerFirst from "../utils/lowerFirst";
import upperFirst from "../utils/upperFirst";
import findStruct from "../parser/findStruct";
import arrayFromAsync from "../utils/arrayFromAsync";

export default async function generateConstructor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selections } = editor;

  const edits = Array.from(
    await arrayFromAsync(
      (async function* edit() {
        for await (const struct of findStruct(document.getText())) {
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
          if (
            selectedFields.length === 0 ||
            selections.every((i) => i.isEmpty)
          ) {
            selectedFields = struct.fields;
          }
          // 选中所有字段时，使用匿名分配并只用一个返回值。
          const compact = selectedFields.length === struct.fields.length;

          const paramNames =
            struct.typeParams.length > 0
              ? `[${struct.typeParams.map((i) => i.name).join(",")}]`
              : "";
          let text = `\
func New${upperFirst(struct.name)}${struct.typeParamDecl}(${
            selectedFields.length > 0
              ? `
${selectedFields.map((f) => `\t${lowerFirst(f.name)} ${f.type},`).join("\n")}
`
              : ""
          }) `;
          if (compact) {
            text += `*${struct.name}${paramNames} {
\treturn &${struct.name}${paramNames}{
${selectedFields.map((i) => `\t\t${lowerFirst(i.name)},`).join("\n")}
\t}
}
`;
          } else {
            text += `(obj *${struct.name}${paramNames}, err error) {
\tobj = &${struct.name}${paramNames}{
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
    )
  );

  if (edits.length === 0) {
    vscode.window.showInformationMessage("no struct detected in selection");
    return;
  }

  const edit = new vscode.WorkspaceEdit();
  edit.set(document.uri, edits);
  await vscode.workspace.applyEdit(edit);
}
