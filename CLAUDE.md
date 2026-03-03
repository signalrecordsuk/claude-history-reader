# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page HTML/CSS/JS Electron app for viewing Claude Code session history files (JSONL format). Also works as a standalone browser page (drag-and-drop mode). No framework or bundler — just open `index.html` in a browser or run `npm start` for Electron.

## Architecture

Everything lives in `index.html` — a self-contained viewer with inline CSS and JS. Electron wrappers are `main.js` (main process) and `preload.js` (IPC bridge).

**Data flow:** User drops/picks a `.jsonl` file → `parseAndRender()` parses each line as JSON → `buildToolMappings()` indexes tool_use/result pairs and subagent IDs → `renderMessages()` builds the DOM.

**Message types and their CSS classes:**
- `user` — green border, always expanded
- `assistant` — gray border, text blocks from assistant
- `tool` — blue border, tool_use blocks (non-edit tools shown as JSON)
- `edit` — yellow border, Edit/Write tool_use blocks with file path + old/new strings
- `toolresult` — orange border, user messages containing tool_result arrays
- `summary` — red border, session continuation messages (detected by prefix text)

**Key features:**
- Non-user messages are collapsible (click to toggle, bulk collapse/expand buttons)
- Time-range filtering via datetime-local inputs; UPDATE button applies range, shift+click resets to all
- Cmd+F / Ctrl+F search with highlight, next/prev navigation
- Subagent viewer: VIEW SUBAGENT button on Task tool_use blocks loads the subagent's JSONL inline; Escape returns to parent view (stack-based, supports nesting)
- Load Previous Session: button at top loads earlier session files above current (Electron auto-finds, browser prompts file picker); shift+click replaces current
- Manual Compact mode: mark tool results for removal, commit writes compacted JSONL; Escape exits without saving
- Messages containing `<local-command-caveat>` are silently skipped
- `escapeHtml()` also converts literal `\n` to newlines (`\\n` → `\n`)

## File Structure

- `index.html` — the entire viewer (CSS + JS inline)
- `main.js` — Electron main process (window, IPC handlers for file I/O)
- `preload.js` — Electron preload script (exposes `electronAPI` to renderer)
- `package.json` — Electron + electron-builder config

## Build

```
npm install          # install Electron
npm start            # run in dev mode
npm run build        # build macOS DMG via electron-builder
```

## JSONL Format Expected

Each line is a JSON object with: `{ type: "user"|"assistant", timestamp: string, message: { content: string|array }, isMeta?: boolean }`. Assistant content arrays contain `{ type: "text", text }` and `{ type: "tool_use", name, input }` blocks. Subagent results include `toolUseResult.agentId` linking to files in `<sessionId>/subagents/agent-<agentId>.jsonl`.
