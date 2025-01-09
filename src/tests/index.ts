import path from "path";
import Mocha from "mocha";
import glob from "glob";
import snapshot from "@nates/snapshot";
import workspaceFolder from "./workspaceFolder";

// eslint-disable-next-line import/prefer-default-export
export function run(): Promise<void> {
  const testsRoot = path.resolve(__dirname);
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    grep: process.env.MOCHA_GREP,
    rootHooks: {
      beforeEach: [
        function setupSnapshot(this: Mocha.Context) {
          snapshot.currentTest.file = path.resolve(
            workspaceFolder("src"),
            path.relative(workspaceFolder("out"), this.currentTest?.file ?? "")
          );
          snapshot.currentTest.key =
            this.currentTest?.titlePath().join("/") ?? "";
        },
      ],
    },
    timeout: process.env.NO_MOCHA_TIMEOUT === "true" ? Infinity : undefined,
  });

  // mocha.addFile(testsRoot + "/setup.js");

  return new Promise((c, e) => {
    glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        return e(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (err) {
        console.error(err);
        e(err);
      }
    });
  });
}
