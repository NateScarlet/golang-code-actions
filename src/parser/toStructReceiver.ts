import type { Struct } from "./findStruct";
import toReceiverParameters from "./toReceiverParameters";

export default function toStructReceiver(struct: Struct): string {
  return `${struct.name}${toReceiverParameters(struct)}`;
}
