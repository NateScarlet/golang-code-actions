export default class Comment {
  #content: string;

  constructor(content: string) {
    this.#content = content;
  }

  get content() {
    return this.#content;
  }

  static fromSource(s: string): Comment | undefined {
    const match = /^\s*\/\/\s*(.+)$/.exec(s);
    if (match) {
      return new Comment(match[1]);
    }
  }
}
