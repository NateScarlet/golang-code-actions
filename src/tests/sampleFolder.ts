import path = require("path");
import workspaceFolder from "./workspaceFolder";

const root = workspaceFolder("src", "tests", "samples");

export default function sampleFolder(...parts: string[]): string {
  return path.resolve(root, ...parts);
}
