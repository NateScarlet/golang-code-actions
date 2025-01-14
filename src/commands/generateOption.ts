import * as vscode from "vscode";
import upperFirst from "../utils/upperFirst";
import parseDocument from "../parser/parseDocument";
import getOptionTypeNames from "../parser/getOptionTypeNames";
import findStruct from "../parser/findStruct";
import isExportedName from "../utils/isExportedName";
import toStructReceiver from "../parser/toStructReceiver";
import toReceiverParameters from "../parser/toReceiverParameters";
import toIdentifier from "../utils/toIdentifier";
import toFieldName from "../parser/toFieldName";

function defaultOptionTypeName(structName: string): string {
  return `${upperFirst(structName)}Option`.replace(/OptionsOption$/, "Option");
}

export default async function generateOption() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selections } = editor;

  const tree = await parseDocument(document.getText());
  const optionTypeNames = getOptionTypeNames(tree.rootNode);

  const edits = Array.from(
    (function* edit() {
      for (const struct of findStruct(tree.rootNode)) {
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
          let optionTypeDecl = optionTypeNames.get(struct.name);
          if (!optionTypeDecl) {
            optionTypeDecl = {
              name: defaultOptionTypeName(struct.name),
              node: struct.node,
            };
            optionTypeNames.set(struct.name, optionTypeDecl);
            const location = document.positionAt(struct.node.endIndex);
            yield new vscode.TextEdit(
              new vscode.Range(location, location),
              `

type ${optionTypeDecl.name}${
                struct.typeParamDecl || " ="
              } func(opts *${toStructReceiver(struct)})`
            );
          }

          let argType = field.type;
          const argIdent = toIdentifier(field.name, ["opts"], true);
          let argAssign = argIdent;
          if (argType.startsWith("[]")) {
            argType = `...${argType.slice(2)}`;
          } else if (argType.startsWith("*")) {
            argType = argType.slice(1);
            argAssign = `&${argAssign}`;
          }
          const prefix = optionTypeDecl.name.replace(/Option$/, "With");
          let funcName = prefix;
          const fieldName = toFieldName(field);
          if (!funcName.includes(upperFirst(fieldName))) {
            funcName += upperFirst(fieldName).replace(/By$/, "");
          }
          const text = `

func ${funcName}${struct.typeParamDecl}(${argIdent} ${argType}) ${
            optionTypeDecl.name
          }${toReceiverParameters(struct)} {
\treturn func(opts *${toStructReceiver(struct)}) {
\t\topts.${fieldName} = ${argAssign}
\t}
}`;
          const location = document.positionAt(optionTypeDecl.node.endIndex);
          yield new vscode.TextEdit(new vscode.Range(location, location), text);
        }
      }
    })()
  );

  if (edits.length === 0) {
    vscode.window.showInformationMessage(
      "no struct field detected in selection"
    );
    return;
  }
  const edit = new vscode.WorkspaceEdit();
  edit.set(document.uri, edits);
  await vscode.workspace.applyEdit(edit);
}
