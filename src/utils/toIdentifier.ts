import lowerFirst from "./lowerFirst";

export default function toIdentifier(
  input: string,
  existing?: readonly string[],
  preferFullName?: boolean
): string {
  for (const alternative of (function* alternatives() {
    if (input) {
      if (preferFullName) {
        yield lowerFirst(input);
      }
      const lastPart = input.split(".").pop() ?? "";
      switch (lastPart) {
        case "Context":
          yield "ctx";
          break;
        case "Error":
          yield "err";
          break;
        case "Request":
          yield "req";
          break;
        case "Response":
          yield "resp";
          break;
        case "Database":
          yield "db";
          break;
        case "Config":
          yield "cfg";
          break;
        case "Client":
          yield "cli";
          break;
        case "Service":
          yield "svc";
          break;
        case "Repository":
          yield "repo";
          break;
        case "Message":
          yield "msg";
          break;
        case "Buffer":
          yield "buf";
          break;
        case "String":
          yield "str";
          break;
        case "Boolean":
          yield "bool";
          break;
        case "Channel":
          yield "ch";
          break;
        case "WaitGroup":
          yield "wg";
          break;
        case "Mutex":
          yield "mu";
          break;
        case "Pointer":
          yield "ptr";
          break;
        default:
      }
      if (preferFullName) {
        yield lowerFirst(lastPart);
      }

      const lastWord = lastPart.split(/(?=[A-Z])/).pop();
      if (lastWord) {
        yield lastWord[0].toLowerCase();
      }
      yield lastPart[0].toLowerCase();
      if (!preferFullName) {
        yield lowerFirst(lastPart);
        yield lowerFirst(input);
      }
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
    if (alternative.includes(".")) {
      continue;
    }
    return alternative;
  }
  return "\u0054\u004F\u0044\u004F"; // "T/O/D/O" without slash (avoid code search)
}
