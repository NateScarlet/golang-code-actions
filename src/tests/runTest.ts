import * as path from "path";

import { runTests } from "@vscode/test-electron";
import * as dotenv from "dotenv";
import { Command } from "commander";

async function main() {
  dotenv.config();

  const program = new Command();
  program
    .option(
      "--grep <pattern>",
      "Filter tests by name using a regular expression"
    )
    .parse(process.argv);

  const options = program.opts();

  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./index");

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      version: process.env.CODE_VERSION || undefined,
      extensionTestsEnv: {
        MOCHA_GREP: options.grep || "",
      },
    });
  } catch (err) {
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
