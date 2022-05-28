import { Range, TextEditor } from "vscode";
import StreamParser from "../parser/StreamParser";
import Token from "../parser/Token";
import iterateTextLines from "./iterateTextLines";

export default function* iterateSelectedToken(
  editor: TextEditor
): Iterable<Token> {
  const { document } = editor;
  var parser = new StreamParser();
  let range = new Range(0, 0, 0, 0);
  for (const line of iterateTextLines(document)) {
    range = range.union(line.range);
    for (const token of parser.parseLine(line.text)) {
      if (editor.selections.some((s) => s.intersection(range))) {
        yield token;
      }
      range = new Range(line.lineNumber + 1, 0, line.lineNumber + 1, 0);
    }
  }
}
