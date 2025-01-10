import lowerFirst from "./lowerFirst";

export default function defaultIdentifier(
  input: string,
  existing?: string[]
): string {
  for (const alternative of (function* alternatives() {
    if (input) {
      const lastWord = input.split(/(?=[A-Z])/).pop();
      if (lastWord) {
        yield lastWord[0].toLowerCase();
      }
      yield input[0].toLowerCase();
      yield lowerFirst(input);
    }
    yield "obj";
    for (let i = 0; i < 100; i += 1) {
      yield `obj${i}`;
    }
  })()) {
    if (!alternative) {
      continue;
    }
    if (existing?.includes(alternative)) {
      continue;
    }
    return alternative;
  }
  return "\u0054\u004F\u0044\u004F"; // "T/O/D/O" without slash (avoid code search)
}
