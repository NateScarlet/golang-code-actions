import snapshot from "@nates/snapshot";
import * as assert from "assert";

import * as vscode from "vscode";
import generateGetter from "../commands/generateGetter";
import sampleFolder from "./sampleFolder";

import useTextDocument from "./useTextDocument";

suite("generateGetter", () => {
  test("should create for selection", async () => {
    const { document, editor } = await useTextDocument(
      sampleFolder("generate_getter_1.go")
    );
    editor.selection = new vscode.Selection(9, 0, 10, 0);
    await generateGetter();
    // await editor.insertSnippet(new vscode.SnippetString("aaa"));
    // console.log(document.getText())
    await snapshot.match(document.getText(), {
      ext: ".go",
    });
  });
});
