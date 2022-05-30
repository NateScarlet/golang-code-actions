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
    editor.selection = new vscode.Selection(3, 0, 3, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should not generate for next line", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(
      document.lineAt(3).range.start,
      document.lineAt(4).range.end
    );
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for multi line start", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(5, 0, 5, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line middle", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(6, 0, 6, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
  test("should generate for multi line end", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_1.go")
    );
    editor.selection = new vscode.Selection(8, 0, 8, 0);
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
    editor.selection = new vscode.Selection(0, 0, document.lineCount, 0);
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should reuse option type alias", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_2.go")
    );
    editor.selections = [new vscode.Selection(3, 0, 3, 0)];
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
      new vscode.Selection(4, 0, 4, 0),
      new vscode.Selection(16, 0, 16, 0),
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
    editor.selections = [new vscode.Selection(3, 0, 3, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should use variadic function for slice", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_4.go")
    );
    editor.selections = [new vscode.Selection(3, 0, 3, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate when field commented", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_5.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should avoid OptionsOption as default type name", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_6.go")
    );
    editor.selections = [new vscode.Selection(4, 0, 4, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for embedded field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_7.go")
    );
    editor.selections = [new vscode.Selection(8, 0, 8, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });

  test("should generate for inline field", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_option_8.go")
    );
    editor.selections = [new vscode.Selection(3, 0, 3, 0)];
    await generateOption();
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
});
