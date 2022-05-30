import type Struct from "./Struct";

export default class StructField {
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

  static *fromSource(struct: Struct, source: string): Iterable<StructField> {
    const match =
      /^\s*((?:[a-zA-Z]\S*,? )*)\s*((?:\[\d*\]|\*)*[a-zA-Z]\S*)/.exec(source);
    if (match) {
      let type = match[2];
      if (/^(?:\[\d*\]|\*)*(struct|interface)$/.test(type)) {
        const match2 = /^\s*({.+})/s.exec(source.slice(match[0].length));
        if (!match2) {
          // incomplete
          return;
        }
        type = `${type} ${match2[1]}`;
      }
      for (const i of match[1].trim().split(/,\s*/)) {
        const name = i || type;
        yield struct.addField(name, type);
      }
    }
  }

  isExported() {
    if (!this.#name) {
      return false;
    }
    return this.name[0] === this.name[0].toUpperCase();
  }
}
