import * as vscode from "vscode";
import Struct from "../parser/Struct";
import StructField from "../parser/StructField";

function* iterateStructFields(lines: Iterable<string>): Iterable<StructField> {
  let struct: Struct | undefined;
  let b = "";
  for (const line of lines) {
    const newStruct = Struct.parseLine(line);
    if (newStruct) {
      struct = newStruct;
      b = "";
      continue;
    }
    if (struct) {
      b += line;
      const field = StructField.parseLine(struct, b);
      if (field) {
        yield field;
        b = "";
      }
    }
  }
}

function upperFirst(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

function eolText(eol: vscode.EndOfLine): string {
  switch (eol) {
    case vscode.EndOfLine.CRLF:
      return "\r\n";
    case vscode.EndOfLine.LF:
      return "\n";
    default:
      throw new Error(`unsupported eol: ${eol}`);
  }
}

function* iterateSource(editor: vscode.TextEditor): Iterable<string> {
  const { document } = editor;

  let lineGte = editor.selection.start.line;
  let lineLte = editor.selection.end.line;
  if (lineLte === editor.document.lineCount) {
    lineLte -= 1;
  }
  while (
    lineGte > 0 &&
    Struct.parseLine(document.lineAt(lineGte).text) == null
  ) {
    lineGte -= 1;
  }
  for (let lineNumber = lineGte; lineNumber <= lineLte; lineNumber += 1) {
    const line = document.lineAt(lineNumber);
    const v = line.text + eolText(document.eol);
    yield v;
  }
}

export default async function generateGetter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }
  const { document } = editor;

  let fieldCount = 0;
  const s = new vscode.SnippetString();
  const eol = eolText(document.eol);
  s.appendText(eol);
  for (const i of iterateStructFields(iterateSource(editor))) {
    if (i.isExported()) {
      continue;
    }
    fieldCount += 1;
    s.appendText(eol);
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
  }

  if (fieldCount === 0) {
    vscode.window.showInformationMessage(
      "no un-exported struct field detected in selection"
    );
    return;
  }

  await editor.insertSnippet(s, new vscode.Position(document.lineCount + 1, 0));
}
