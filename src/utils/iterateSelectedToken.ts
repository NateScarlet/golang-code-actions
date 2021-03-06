import { Range } from "vscode";
import type { TextEditor } from "vscode";
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
    let tokenCount = 0;
    for (const token of parser.parseLine(line.text)) {
      tokenCount += 1;
      const range1 = range;
      if (
        editor.selections.some((s) => {
          const selected = s.intersection(range1);
          if (!s.isEmpty && selected?.isEmpty) {
            return false;
          }
          return selected != null;
        })
      ) {
        yield token;
      }
    }
    if (tokenCount > 0) {
      range = new Range(range.end, range.end);
    }
  }
}
