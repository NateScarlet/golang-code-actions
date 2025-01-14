export default function isExportedName(name: string): boolean {
  if (!name) {
    return false;
  }
  const lastPart = name.split(".").pop() ?? name;
  return lastPart[0] === lastPart[0].toUpperCase();
}
