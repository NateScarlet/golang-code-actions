import snapshot from "@nates/snapshot";

import * as vscode from "vscode";
import generateConstructor from "../commands/generateConstructor";
import sampleFolder from "./sampleFolder";

import useTextDocument from "./useTextDocument";

suite("generateConstructor", () => {
  test("should generate for single line", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_1.go")
    );
    editor.selection = new vscode.Selection(4, 0, 4, 0);
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for all", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_1.go")
    );
    editor.selection = new vscode.Selection(0, 0, document.lineCount, 0);
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for multi selection", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_1.go")
    );
    editor.selections = [
      new vscode.Selection(5, 0, 5, 0),
      new vscode.Selection(17, 0, 17, 0),
    ];
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
});
