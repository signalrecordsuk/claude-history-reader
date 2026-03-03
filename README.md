# Claude History Reader

A viewer for Claude Code session history files (JSONL format). 

Runs as a standalone HTML page in any browser or as a native macOS Electron app with full file-system access.

## Download

Grab the latest `.dmg` from the [Releases](../../releases) page.

Or just open `index.html` in your browser — drag and drop any `.jsonl` file to view it.

## Live Demo

https://signalrecords.co.uk/apps/claude-history-viewer/index.html
(all files stay local only, nothing gets uploaded to the web)

## Features

- **Message view** — color-coded by type: user (green), assistant (gray), tool calls (blue), edits (yellow), tool results (orange), session summaries (red)

- **Collapsible messages** — click any non-user message to collapse/expand; bulk collapse/expand button in toolbar

- **Time-range filtering** — set start/end times and click UPDATE to filter; shift+click UPDATE to reset to all

- **Search** — Cmd+F / Ctrl+F opens an inline search bar with match highlighting and next/prev navigation

- **Subagent viewer** — VIEW SUBAGENT button on Agent/Task blocks loads the subagent's chat history inline; press Escape to return (supports nested subagents)

- **Load Previous Session** — button at the top of the chat loads the previous session above the current one; shift+click replaces the current session entirely

- **Manual Compact (EXPERIMENTAL FEATURE)** — select messages to remove manually from context, plus auto-mark tool results etc for removal, then commit to write a compacted JSONL (with backup). Unedited version is retained and linked at each deletion point in case Claude needs to reread anythign that was removed. End claude session then resume with claude -r to pick up the edited context.

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

## License

MIT
