# Claude History Reader

A viewer for Claude Code session history files (JSONL format). 

Runs as a standalone HTML page in any browser or as a native macOS Electron app with full file-system access.

## Download

Grab the latest `.dmg` from the [Releases](../../releases) page.

Or just open `index.html` in your browser — drag and drop any `.jsonl` file to view it.

## Live Demo

https://signalrecords.co.uk/apps/claude-history-viewer/index.html

(all files stay local only, nothing gets uploaded to the web. For the manual compaction feature, direct file editing from the web version is not possible... you must download the edited file then replace the original with it. Please keep a backup of the original too to avoid any risk of data loss if the process somehow corrupts upon download).

## Features

- **Message view** — color-coded by type: user (green), assistant (gray), tool calls (blue), edits (yellow), tool results (orange), session summaries (red)

- **Collapsible messages** — click any non-user message to collapse/expand; bulk collapse/expand button in toolbar

- **Time-range filtering** — set start/end times and click UPDATE to filter; shift+click UPDATE to reset to all

- **Search** — Cmd+F / Ctrl+F opens an inline search bar with match highlighting and next/prev navigation

- **Subagent viewer** — VIEW SUBAGENT button on Agent/Task blocks loads the subagent's chat history inline; press Escape to return (supports nested subagents)

- **Load Previous Session** — button at the top of the chat loads the previous session above the current one; shift+click replaces the current session entirely

- **Manual Compact** - Instructions:
1. End claude session (CTRL+C x2) when you need to manually compact (when context warning shows between 1% and 10%, Not possible when it hits 0%).
2. open the current chat history JSONL file with this tool, then press MANUAL COMPACT.
3. select irrelevant long messages to remove manually from context (optional)
4. auto-mark tool results etc for removal (recommended to choose SELECT ALL, possibly unchecking 'code edits' if anything critical is ongoing).
5. press COMMIT to write a compacted JSONL (with a renamed backup of the original one).
6. Unedited version is retained and linked at each deletion point, in case Claude needs to reread anything that was removed.
7. Resume with 'claude -r'. Initially it will not show context having been reduced, but should self-correct after 1 message. Do not let context get down to 0% or this will fail. If context is very low (<3%), send this message "Do NOT compact. Say 'ok' then do nothing else".

- **Electron extras** — project picker, auto-load from `~/.claude/projects/`, direct file read/write for compaction


## Running from source

```bash
# Install dependencies
npm install

# Run in Electron
npm start

# Build macOS DMG
npm run build
```

Or just open `index.html` directly in a browser (no install needed — drag-and-drop mode).

## Session files

Claude Code stores session history in `~/.claude/projects/<project-slug>/<session-id>.jsonl`. Subagent histories live in `<session-id>/subagents/agent-<agent-id>.jsonl`.

## Contributing

Fork, branch, PR. The entire app is in `index.html` — inline CSS and JS, no build step, no framework.

## Disclaimer

This tool can modify your chat history files (via Manual Compact). **Always back up your session files before use.** The authors are not responsible for any data loss or corruption. See the [MIT License](LICENSE.txt) for full terms.

## License

MIT — see [LICENSE.txt](LICENSE.txt)
