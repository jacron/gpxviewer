# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A tiny Chrome extension (Manifest V3, `manifest.json` + `background.js` service worker, no build
step) that links
Garmin Connect activity pages to the local GPX viewer. It's the entry point of the "new activity"
workflow described in `../node-gpx-server/CLAUDE.md` and `../node-gpx-server/README.md`: it's how
you jump from a Garmin Connect activity page to previewing that track, before/after manually
exporting the GPX/CSV into `node-gpx-server`'s `activitiesNewMap`
(`~/Downloads/newactivities`) — the extension itself does not download or move any files.

## Loading/developing

No build/package step — load unpacked via `chrome://extensions` (Developer mode → "Load unpacked"
→ this folder). Reload the extension after editing `background.js` or `manifest.json`.

## How it works

- The toolbar action is disabled by default (`chrome.action.disable()` in the `onInstalled`
  listener) and only re-enabled per-tab via a `declarativeContent` rule
  (`chrome.declarativeContent.ShowAction`) when the tab's URL contains `connect.garmin.com` — this
  reproduces MV2's `page_action` (hidden-by-default) behavior on top of MV3's `action`
  (visible-by-default) API.
- Clicking the action (`chrome.action.onClicked`) reads `tab.url` from the click event, takes the
  last `/`-separated segment as the Garmin activity id (`getIdFromGarminConnect`), and opens
  `http://viewer2/gpx/activity_<id>.gpx` via `chrome.windows.create` (a fixed-size popup window;
  service workers have no `window` global, so this can't use `window.open` like the old MV2
  version did).
- `viewer2` is a hostname that must resolve locally (not part of this repo — presumably a hosts
  entry or local DNS) to wherever `ng9-gpx-client` is served; see that project's `vhost.config`.
  A commented-out alternate URL in `background.js`
  (`http://localhost:3016/gpx/activity_@id.gpx`) points directly at `node-gpx-server`, but is
  noted in-code as triggering a file *download* of the GPX instead of opening the viewer — don't
  swap to it without accounting for that.

## Notes

- `manifest_version: 3`, background runs as a service worker (`background.service_worker` in the
  manifest) — it's unloaded when idle, so all state must come from the manifest/event listeners,
  never module-level state that's expected to persist between clicks.
- Permissions are minimal (`declarativeContent`, `tabs`) — keep it that way; no host permissions
  are requested beyond what `declarativeContent` needs to match the URL. `tabs` is what makes
  `tab.url` populated in the `action.onClicked` callback.
