import StructField from "./StructField";

export default class Struct {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  get name() {
    return this.#name;
  }

  field(name: string, type: string): StructField {
    return new StructField(this, name, type);
  }

  static formSource(line: string): Struct | undefined {
    const match = /^type\s+([a-zA-Z]\S*)\s+struct\s*{/.exec(line);
    if (match) {
      return new Struct(match[1]);
    }
  }
}
