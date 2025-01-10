import snapshot from "@nates/snapshot";

import * as vscode from "vscode";
import assert from "node:assert";
import generateGetter from "../commands/generateGetter";
import sampleFolder from "./sampleFolder";

import useTextDocument from "./useTextDocument";
import toExportedName from "../utils/toExportedName";

suite("generateGetter", () => {
  test("should generate for single line", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(3, 0, 3, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line start", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(5, 0, 5, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line middle", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(6, 0, 6, 0);
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line end", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(8, 0, 8, 0);
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

  test("should generate for multi selection", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selections = [
      new vscode.Selection(3, 0, 3, 0),
      new vscode.Selection(15, 0, 15, 0),
    ];
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate when field commented", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_2.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for embedded field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_3.go")
    );
    editor.selections = [new vscode.Selection(8, 0, 8, 0)];
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for inline field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_4.go")
    );
    editor.selections = [new vscode.Selection(3, 0, 3, 0)];
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should insert after struct", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_2.go")
    );
    await editor.edit((b) => {
      b.insert(
        new vscode.Position(document.lineCount - 1, 0),
        "// last line content"
      );
    });
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should supports generic", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_5.go")
    );
    editor.selections = [new vscode.Selection(3, 0, 4, 0)];
    await generateGetter();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should handle special names", async () => {
    assert.equal(toExportedName("id"), "ID");
    assert.equal(toExportedName("userId"), "UserId");
    assert.equal(toExportedName("userID"), "UserID");
    assert.equal(toExportedName("url"), "URL");
    assert.equal(toExportedName("fileUrl"), "FileUrl");
    assert.equal(toExportedName("fileURL"), "FileURL");
  });
});
