import Struct from "./Struct";
import StructField from "./StructField";
import Token from "./Token";

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
    if (this.#parent) {
      const field = StructField.fromSource(this.#parent, this.#b);
      if (field) {
        yield field;
        this.#b = "";
      }
    }
    this.#b += line;
    this.#b += this.#eol;
  }

  *parse(source: string): Iterable<Token> {
    source = this.#b + source;
    this.#b = "";
    for (const line of source.split(this.#eol)) {
      for (const token of this.parseLine(line)) {
        yield token;
      }
    }
  }
}
