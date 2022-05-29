import * as vscode from "vscode";
import StructField from "../parser/StructField";
import eolText from "../utils/eolText";
import iterateSelectedToken from "../utils/iterateSelectedToken";
import iterateTextLines from "../utils/iterateTextLines";
import upperFirst from "../utils/upperFirst";

export default async function generateOption() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document } = editor;

  let fieldCount = 0;
  let structCount = 0;
  const structNames = new Set();
  const s = new vscode.SnippetString();
  const eol = eolText(document.eol);
  s.appendText(eol);

  const optionTypeNames = new Map<string, string>();
  for (const line of iterateTextLines(document)) {
    const match =
      /^type ([a-zA-Z]\S+)\s+(?:=\s*)?func\s*\((?:[a-zA-Z]\S+ )? *\*(.+)\);?/.exec(
        line.text
      );
    if (match) {
      optionTypeNames.set(match[2], match[1]);
    }
  }
  for (const i of iterateSelectedToken(editor)) {
    if (!(i instanceof StructField)) {
      continue;
    }

    if (!structNames.has(i.parent.name)) {
      structNames.add(i.parent.name);
      structCount += 1;
    }

    fieldCount += 1;
    let optionTypeName = optionTypeNames.get(i.parent.name);
    if (!optionTypeName) {
      optionTypeName = `${upperFirst(i.parent.name)}Option`;
      optionTypeNames.set(i.parent.name, optionTypeName);
      s.appendText("type ");
      s.appendPlaceholder(optionTypeName, structCount);
      s.appendText(" = func(opts *");
      s.appendText(i.parent.name);
      s.appendText(")");
      s.appendText(eol);
      s.appendText(eol);
    }
    let argType = i.type;
    let argAssign = "v";
    if (i.type.startsWith("[]")) {
      argType = `...${i.type.slice(2)}`;
    } else if (i.type.startsWith("*")) {
      argType = i.type.slice(1);
      argAssign = "&v";
    }
    s.appendText("func ");
    s.appendPlaceholder(optionTypeName, structCount);
    s.appendText(upperFirst(i.name));
    s.appendText("(v ");
    s.appendText(argType);
    s.appendText(") ");
    s.appendText(optionTypeName);
    s.appendText(" {");
    s.appendText(eol);
    s.appendText(`    return func(opts *${i.parent.name}) {`);
    s.appendText(eol);
    s.appendText(`        opts.${i.name} = ${argAssign}`);
    s.appendText(eol);
    s.appendText("    }");
    s.appendText(eol);
    s.appendText("}");
    s.appendText(eol);
    s.appendText(eol);
  }

  if (fieldCount === 0) {
    vscode.window.showInformationMessage(
      "no struct field detected in selection"
    );
    return;
  }

  await editor.insertSnippet(s, new vscode.Position(document.lineCount + 1, 0));
}
