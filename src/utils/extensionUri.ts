import { Uri } from "vscode";
import getExtensionContext from "./getExtensionContext";

export default function extensionUri(...parts: string[]): Uri {
  return Uri.joinPath(
    getExtensionContext()?.extensionUri ??
      Uri.joinPath(Uri.file(__dirname), "../.."),
    ...parts
  );
}
