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

  isExported() {
    if (!this.#name) {
      return false;
    }
    return this.name[0] === this.name[0].toUpperCase();
  }

  static fromSource(struct: Struct, source: string): StructField | undefined {
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
        return struct.addField(name, type + " " + match2[1]);
      }
      return struct.addField(name, type);
    }
  }
}
