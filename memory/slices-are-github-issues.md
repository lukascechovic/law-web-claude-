---
name: slices-are-github-issues
description: What "slice #N" means here and how to read the issue tracker when gh CLI is unauthenticated
metadata:
  type: project
---

In this repo, **"slice #N" = GitHub issue #N** in `lukascechovic/law-web-claude-`. The slices are the children of epic #1 (the production-ready PRD), created via `/to-issues`. Each is built as a vertical TDD slice; the established workflow is a feature branch + PR whose commits/merges reference `(#N)`.

The local `gh` CLI is **not authenticated** (`gh auth status` fails, no `GH_TOKEN`). To read/list issues, use the **GitHub MCP server** instead — e.g. `mcp__github__list_issues` / `mcp__github__issue_read` with `owner: lukascechovic`, `repo: law-web-claude-`. Don't waste time trying `gh issue list`.

**Why:** the slice plan lives only in GitHub Issues, not in any local file, so identifying "slice #N" requires the tracker.
**How to apply:** at the start of a slice run, list open issues via the MCP server; the one labelled `ready-for-agent` with no blockers is fair game.
