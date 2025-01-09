import path from "path";
import getExtensionContext from "./getExtensionContext";

export default function extensionPath(...parts: string[]): string {
  return path.resolve(
    getExtensionContext()?.extensionPath ?? path.resolve(__dirname, "../.."),
    ...parts
  );
}
