import StructField from "./StructField";

export default class Struct {
  #name: string;
  #fields: StructField[];
  constructor(name: string) {
    this.#name = name;
    this.#fields = [];
  }
  get name() {
    return this.#name;
  }

  get fields(): readonly StructField[] {
    return this.#fields;
  }

  addField(name: string, type: string): StructField {
    const v = new StructField(this, name, type);
    this.#fields.push(v);
    return v;
  }

  static formSource(line: string): Struct | undefined {
    const match = /^type\s+([a-zA-Z]\S*)\s+struct\s*{/.exec(line);
    if (match) {
      return new Struct(match[1]);
    }
  }
}
