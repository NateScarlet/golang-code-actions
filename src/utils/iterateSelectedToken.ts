import type { TextEditor } from "vscode";
import { Range } from "vscode";
import StreamParser from "../parser/StreamParser";
import type Token from "../parser/Token";
import iterateTextLines from "./iterateTextLines";

export default function* iterateSelectedToken(
  editor: TextEditor
): Iterable<Token> {
  const { document } = editor;
  const parser = new StreamParser();
  let range = new Range(0, 0, 0, 0);
  for (const line of iterateTextLines(document)) {
    range = range.union(line.range);
    for (const token of parser.parseLine(line.text)) {
      const range1 = range;
      if (editor.selections.some((s) => s.intersection(range1))) {
        yield token;
      }
      range = new Range(line.lineNumber + 1, 0, line.lineNumber + 1, 0);
    }
  }
}
