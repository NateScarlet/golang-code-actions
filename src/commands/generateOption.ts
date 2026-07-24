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

          const argType = field.type;
          const fieldName = toFieldName(field);

          if (argType === "bool") {
            let stem = fieldName;
            let negated = false;
            if (/^no[A-Z]/.test(fieldName)) {
              stem = fieldName[2].toLowerCase() + fieldName.slice(3);
              negated = true;
            } else if (/^disable[A-Z]/.test(fieldName)) {
              stem = fieldName[7].toLowerCase() + fieldName.slice(8);
              negated = true;
            }

            const withVal = negated ? "false" : "true";
            const withoutVal = negated ? "true" : "false";
            const exportedStem = upperFirst(stem).replace(/By$/, "");

            const withPrefix = optionTypeDecl.name.replace(/Option$/, "With");
            let withName = withPrefix;
            if (!withName.includes(exportedStem)) {
              withName += exportedStem;
            }

            const withoutPrefix = optionTypeDecl.name.replace(
              /Option$/,
              "Without"
            );
            let withoutName = withoutPrefix;
            if (!withoutName.includes(exportedStem)) {
              withoutName += exportedStem;
            }

            const text = `

func ${withName}${struct.typeParamDecl}() ${
              optionTypeDecl.name
            }${toReceiverParameters(struct)} {
\treturn func(opts *${toStructReceiver(struct)}) {
\t\topts.${fieldName} = ${withVal}
\t}
}

func ${withoutName}${struct.typeParamDecl}() ${
              optionTypeDecl.name
            }${toReceiverParameters(struct)} {
\treturn func(opts *${toStructReceiver(struct)}) {
\t\topts.${fieldName} = ${withoutVal}
\t}
}`;
            const location = document.positionAt(optionTypeDecl.node.endIndex);
            yield new vscode.TextEdit(
              new vscode.Range(location, location),
              text
            );
          } else {
            const argIdent = toIdentifier(field.name, ["opts"], true);
            let resolvedArgType = argType;
            let argAssign = argIdent;
            if (resolvedArgType.startsWith("[]")) {
              resolvedArgType = `...${resolvedArgType.slice(2)}`;
            } else if (resolvedArgType.startsWith("*")) {
              resolvedArgType = resolvedArgType.slice(1);
              argAssign = `&${argAssign}`;
            }
            const prefix = optionTypeDecl.name.replace(/Option$/, "With");
            let funcName = prefix;
            if (!funcName.includes(upperFirst(fieldName))) {
              funcName += upperFirst(fieldName).replace(/By$/, "");
            }
            const text = `

func ${funcName}${struct.typeParamDecl}(${argIdent} ${resolvedArgType}) ${
              optionTypeDecl.name
            }${toReceiverParameters(struct)} {
\treturn func(opts *${toStructReceiver(struct)}) {
\t\topts.${fieldName} = ${argAssign}
\t}
}`;
            const location = document.positionAt(optionTypeDecl.node.endIndex);
            yield new vscode.TextEdit(
              new vscode.Range(location, location),
              text
            );
          }
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
