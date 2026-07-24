## 技术栈

- **运行时:** VS Code Extension API（兼容桌面端与 vscode.dev）
- **语言:** TypeScript (4.9), esbuild 打包
- **解析引擎:** web-tree-sitter + tree-sitter-go (WASM)
- **测试:** Mocha + @vscode/test-electron + @vscode/test-web + @nates/snapshot
- **无 Go 运行时依赖** — 全部解析在客户端完成

## Agent skills

### Issue tracker

Issues live in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage labels using default names. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (repo root `CONTEXT.md` + `docs/adr/`). See `docs/agents/domain.md`.
