import { EndOfLine } from "vscode";

export default function eolText(eol: EndOfLine): string {
  switch (eol) {
    case EndOfLine.CRLF:
      return "\r\n";
    case EndOfLine.LF:
      return "\n";
    default:
      throw new Error(`unsupported eol: ${eol}`);
  }
}
