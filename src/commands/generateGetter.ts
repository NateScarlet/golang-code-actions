import * as vscode from "vscode";
import StructField from "../parser/StructField";
import eolText from "../utils/eolText";
import iterateSelectedToken from "../utils/iterateSelectedToken";
import upperFirst from "../utils/upperFirst";

export default async function generateGetter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document } = editor;

  let fieldCount = 0;
  const s = new vscode.SnippetString();
  const eol = eolText(document.eol);
  s.appendText(eol);
  for (const i of iterateSelectedToken(editor)) {
    if (!(i instanceof StructField)) {
      continue;
    }
    if (i.isExported()) {
      continue;
    }
    fieldCount += 1;
    s.appendText("func (");
    s.appendPlaceholder("obj", 1);
    s.appendText(" ");
    s.appendText(i.parent.name);
    s.appendText(") ");
    s.appendTabstop(2);
    s.appendText(upperFirst(i.name));
    s.appendText("() ");
    s.appendText(i.type);
    s.appendText(" {");
    s.appendText(eol);
    s.appendText("    return ");
    s.appendPlaceholder("obj", 1);
    s.appendText(".");
    s.appendText(i.name);
    s.appendText(eol);
    s.appendText("}");
    s.appendText(eol);
    s.appendText(eol);
  }

  if (fieldCount === 0) {
    vscode.window.showInformationMessage(
      "no un-exported struct field detected in selection"
    );
    return;
  }

  await editor.insertSnippet(
    s,
    document.lineAt(document.lineCount - 1).range.end
  );
}
