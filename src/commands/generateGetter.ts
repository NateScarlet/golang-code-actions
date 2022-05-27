import * as vscode from "vscode";

class Struct {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  get name() {
    return this.#name;
  }

  field(name: string, type: string): StructField {
    return new StructField(this, name, type);
  }
}

class StructField {
  #name: string;
  #type: string;
  #parent: Struct;
  constructor(parent: Struct, name: string, type: string) {
    this.#name = name;
    this.#type = type;
    this.#parent = parent;
  }
  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  get parent() {
    return this.#parent;
  }

  isExported() {
    if (!this.#name) {
      return false;
    }
    return this.name[0] === this.name[0].toUpperCase();
  }
}

function parseStruct(line: string): Struct | undefined {
  const match = /^type\s+([a-zA-Z]\S*)\s+struct\s*{/.exec(line);
  if (match) {
    return new Struct(match[1]);
  }
}

function parseStructField(
  struct: Struct,
  source: string
): StructField | undefined {
  const match = /^\s*([a-zA-Z]\S*)\s+((?:\[\d*\]|\*)*[a-zA-Z][^\s{]*)/.exec(
    source
  );
  if (match) {
    const name = match[1];
    const type = match[2];
    if (/^(?:\[\d*\]|\*)*(struct|interface)$/.test(type)) {
      const match2 = /^\s*({.+})/s.exec(source.slice(match[0].length));
      if (!match2) {
        return;
      }
      return struct.field(name, type + " " + match2[1]);
    }
    return struct.field(name, type);
  }
}

function* iterateStructFields(lines: Iterable<string>): Iterable<StructField> {
  let struct: Struct | undefined;
  let b = "";
  for (const line of lines) {
    const newStruct = parseStruct(line);
    if (newStruct) {
      struct = newStruct;
      b = "";
      continue;
    }
    if (struct) {
      b += line;
      const field = parseStructField(struct, b);
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

  let startLine = editor.selection.start.line;
  while (parseStruct(document.lineAt(startLine).text) == null) {
    startLine -= 1;
    if (startLine < 0) {
      return;
    }
  }
  for (
    let lineNumber = startLine;
    lineNumber <= editor.selection.end.line;
    lineNumber += 1
  ) {
    const line = document.lineAt(lineNumber);
    const v = line.text + eolText(document.eol);
    yield v;
  }
}

export default function generateGetter() {
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

  editor.insertSnippet(s, new vscode.Position(document.lineCount + 1, 0));
}

