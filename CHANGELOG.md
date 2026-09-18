# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2026-09-18

### Added
- Remote configuration support — fetches `patterns.json` from the repository at runtime, so detection patterns and settings can be updated without shipping a new script version
- Expanded ad-link patterns beyond `/ads/about`: `/ad/preferences`, `/business/help`, `/ads/`, `/help/ads`, `/ad/`, `/privacy/ads`
- Multilingual ad-label fallback: detects small leaf `<span>` elements with localized ad text (English, German, French, Spanish, Italian, Bengali, Hindi, Korean, Japanese, Chinese, and more)
- Geometry-based post card detection via configurable `minWidth` / `maxWidth` / `minHeight` thresholds
- `looksLikePost()` sanity check to avoid hiding shell containers that don't resemble real posts
- Configurable debug logging (`behavior.debug`) and debounce interval (`behavior.debounceMs`, default 150ms)
- Graceful startup: runs immediately with hardcoded defaults, then re-runs after remote config loads

### Changed
- Observer target changed from `document.body` to `document.documentElement` to catch mutations earlier
- Startup flow now waits for `DOMContentLoaded` when the document is still loading, then runs detection, loads remote config, and installs the observer
- Label-text fallback only runs when href-based detection finds nothing in a given pass

### Fixed
- Reduced false positives from the label-based detection path
- Improved resilience against Facebook's frequently changing DOM structure

## [2.0.0] - 2025-09-17

### Changed
- Rewrote sponsored-post detection to match Facebook's current markup
- Now targets the `/ads/about` link, present only on sponsored posts
- Switched to `@run-at document-start` to catch the initial feed render
- Replaced reset-on-every-mutation debounce with a coalescing 200ms debounce

### Added
- `dataset.adBlocked` guard so hidden posts are skipped on later scans
- Support for `web.facebook.com`

### Removed
- Messenger support (current selector does not apply to Messenger's DOM)
- Pinned commit hash from download/update URLs

## [1.0.0] - 2025-05-21

### Added
- Initial release
- Hides sponsored posts on Facebook and Messenger
- MutationObserver with debouncing
