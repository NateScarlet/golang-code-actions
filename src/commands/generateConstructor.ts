import * as vscode from "vscode";
import Struct from "../parser/Struct";
import StructField from "../parser/StructField";
import eolText from "../utils/eolText";
import iterateSelectedToken from "../utils/iterateSelectedToken";
import lowerFirst from "../utils/lowerFirst";
import upperFirst from "../utils/upperFirst";

export default async function generateConstructor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document } = editor;

  const s = new vscode.SnippetString();
  const eol = eolText(document.eol);
  s.appendText(eol);
  const structs: Struct[] = [];
  for (const i of iterateSelectedToken(editor)) {
    if (i instanceof Struct) {
      structs.push(i);
    }
    if (i instanceof StructField && !structs.includes(i.parent)) {
      structs.push(i.parent);
    }
  }
  if (structs.length === 0) {
    vscode.window.showInformationMessage("no struct detected in selection");
    return;
  }

  structs.forEach((i) => {
    s.appendText(eol);
    s.appendText("func ");
    s.appendPlaceholder(`New${upperFirst(i.name)}`);
    s.appendText("(");
    if (i.fields.length > 0) {
      s.appendText(eol);
      i.fields.forEach((f) => {
        s.appendText("    ");
        s.appendText(lowerFirst(f.name));
        s.appendText(" ");
        s.appendText(f.type);
        s.appendText(",");
        s.appendText(eol);
      });
    }

    s.appendText(") (obj *");
    s.appendText(i.name);
    s.appendPlaceholder(", err error");
    s.appendText(") {");
    s.appendText(eol);
    s.appendText("    obj = &");
    s.appendText(i.name);
    s.appendText("{");
    s.appendText(eol);
    i.fields.forEach((f) => {
      s.appendText("        ");
      s.appendText(f.name);
      s.appendText(": ");
      s.appendText(lowerFirst(f.name));
      s.appendText(",");
      s.appendText(eol);
    });
    s.appendText("    }");
    s.appendText(eol);
    s.appendText("    return");
    s.appendText(eol);
    s.appendText("}");
    s.appendText(eol);
  });

  await editor.insertSnippet(s, new vscode.Position(document.lineCount + 1, 0));
}
