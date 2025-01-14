import type { StructField } from "./findStruct";

export default function toFieldName(field: StructField): string {
  if (field.embeded) {
    return field.name.split(".").pop() ?? field.name;
  }
  return field.name;
}
