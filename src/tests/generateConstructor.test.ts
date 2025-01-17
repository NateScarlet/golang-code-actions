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

  test("should generate when field commented", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_2.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for embedded field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_3.go")
    );
    editor.selections = [new vscode.Selection(8, 0, 8, 0)];
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for inline field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_4.go")
    );
    editor.selections = [new vscode.Selection(3, 0, 3, 0)];
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should only generate for selected field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_1.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 5, 0)];
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should supports generic", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_constructor_5.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 5, 0)];
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should supports embed field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("embed_fields.go")
    );
    editor.selections = [new vscode.Selection(8, 0, 8, 0)];
    await generateConstructor();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
});
