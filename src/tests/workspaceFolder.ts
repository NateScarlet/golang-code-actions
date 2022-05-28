import path = require("path");

const root = path.resolve(__dirname, "../..");

export default function workspaceFolder(...parts: string[]): string {
  return path.resolve(root, ...parts);
}
