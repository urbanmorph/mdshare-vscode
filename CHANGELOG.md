# Changelog

## 0.3.4 (2026-05-21)

- Send a `User-Agent: mdshare-vscode/<version>` header on upload requests so
  the backend can attribute traffic to this integration. No personal
  identifiers — the header carries only the client software name and version.

## 0.3.3 (2026-05-20)

- Republish at a fresh version. No functional changes.

## 0.3.2 (2026-05-10)

- Improved menu placement — "Share on mdshare" now appears near the top of the right-click menu
- Added a share icon to the editor toolbar — one-click share from any open markdown file
- Explicit activation events for older VS Code / Cursor / Windsurf versions

## 0.1.0

- Share markdown files from Explorer context menu
- Share selected text from editor context menu
- Admin URL auto-copied to clipboard
