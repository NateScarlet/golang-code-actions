import type { Struct } from "./findStruct";

export default function toReceiverParameters(struct: Struct): string {
  return struct.typeParams.length > 0
    ? `[${struct.typeParams.map((i) => i.name).join(",")}]`
    : "";
}
