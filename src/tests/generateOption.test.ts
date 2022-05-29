import snapshot from "@nates/snapshot";

import * as vscode from "vscode";
import generateOption from "../commands/generateOption";
import sampleFolder from "./sampleFolder";

import useTextDocument from "./useTextDocument";

suite("generateOption", () => {
  test("should generate for single line", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(5, 0, 5, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line start", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(6, 0, 6, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line middle", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(7, 0, 7, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line end", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(9, 0, 9, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for all", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(0, 0, document.lineCount, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should reuse option type declaration", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selections = [new vscode.Selection(17, 0, 17, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should reuse option type alias", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_2.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for multi selection", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selections = [
      new vscode.Selection(5, 0, 5, 0),
      new vscode.Selection(17, 0, 17, 0),
    ];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should indirect pointer", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_3.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should use variadic function for slice", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_4.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
});
