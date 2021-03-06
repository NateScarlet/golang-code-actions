import Comment from "./Comment";
import Struct from "./Struct";
import StructField from "./StructField";
import type Token from "./Token";

export default class StreamParser {
  #b: string;

  #eol: string;

  #parent: Struct | undefined;

  constructor({ eol = "\n" }: { eol?: string } = {}) {
    this.#b = "";
    this.#eol = eol;
  }

  *parseLine(line: string): Iterable<Token> {
    const newStruct = Struct.formSource(line);
    if (newStruct) {
      this.#parent = newStruct;
      this.#b = "";
      yield newStruct;
      return;
    }
    const comment = Comment.fromSource(line);
    if (comment) {
      yield comment;
      return;
    }
    this.#b += line;
    this.#b += this.#eol;
    if (this.#parent) {
      for (const field of StructField.fromSource(this.#parent, this.#b)) {
        yield field;
        this.#b = "";
      }
    }
  }

  *parse(source: string): Iterable<Token> {
    const b = this.#b + source;
    this.#b = "";
    for (const line of b.split(this.#eol)) {
      for (const token of this.parseLine(line)) {
        yield token;
      }
    }
  }
}
