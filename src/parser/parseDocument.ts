import type { Parser } from "./loadParser";
import loadParser from "./loadParser";

/**
 * @link https://github.com/tree-sitter/tree-sitter-go/blob/master/grammar.js
 */
export default async function parseDocument(input: string | Parser.Input) {
  const parser = await loadParser();
  return parser.parse(input);
}
