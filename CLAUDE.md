# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A tiny Chrome extension (Manifest V2, `manifest.json` + `background.js`, no build step) that links
Garmin Connect activity pages to the local GPX viewer. It's the entry point of the "new activity"
workflow described in `../node-gpx-server/CLAUDE.md` and `../node-gpx-server/README.md`: it's how
you jump from a Garmin Connect activity page to previewing that track, before/after manually
exporting the GPX/CSV into `node-gpx-server`'s `activitiesNewMap`
(`~/Downloads/newactivities`) — the extension itself does not download or move any files.

## Loading/developing

No build/package step — load unpacked via `chrome://extensions` (Developer mode → "Load unpacked"
→ this folder). Reload the extension after editing `background.js` or `manifest.json`.

## How it works

- `declarativeContent` rule in `background.js` shows the toolbar page action only when the active
  tab's URL contains `connect.garmin.com`.
- Clicking the page action (`chrome.pageAction.onClicked`) reads the current tab's URL, takes the
  last `/`-separated segment as the Garmin activity id (`getIdFromGarminConnect`), and opens
  `http://viewer2/gpx/activity_<id>.gpx` in a fixed-size popup window.
- `viewer2` is a hostname that must resolve locally (not part of this repo — presumably a hosts
  entry or local DNS) to wherever `ng9-gpx-client` is served; see that project's `vhost.config`.
  A commented-out alternate URL in `background.js`
  (`http://localhost:3016/gpx/activity_@id.gpx`) points directly at `node-gpx-server`, but is
  noted in-code as triggering a file *download* of the GPX instead of opening the viewer — don't
  swap to it without accounting for that.

## Notes

- `manifest_version: 2` — Chrome is deprecating MV2 extensions; a future Chrome upgrade may refuse
  to load this without a Manifest V3 port (service worker instead of persistent background page,
  `declarativeContent`/`pageAction` APIs may need updating).
- Permissions are minimal (`declarativeContent`, `tabs`) — keep it that way; no host permissions
  are requested beyond what `declarativeContent` needs to match the URL.
