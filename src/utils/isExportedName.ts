export default function isExportedName(name: string): boolean {
  if (!name) {
    return false;
  }
  return name[0] === name[0].toUpperCase();
}
