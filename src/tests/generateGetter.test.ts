import snapshot from "@nates/snapshot";
import * as assert from "assert";

import * as vscode from "vscode";
import generateGetter from "../commands/generateGetter";
import sampleFolder from "./sampleFolder";

import useTextDocument from "./useTextDocument";

suite("generateGetter", () => {
  test("should generate for single line", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(5, 0, 5, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line start", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(6, 0, 6, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line middle", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(7, 0, 7, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line end", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(9, 0, 9, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for all", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(0, 0, document.lineCount, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
});
