<div align="center">

# 🌸 Facebook Sponsored Post Blocker

**Tired of scrolling past sponsored junk on Facebook? This tiny script says "nope" — quietly, in the background, so you don't have to see a single ad.** ✨

[![Version](https://img.shields.io/badge/version-2.0.0-ffb6c1?style=for-the-badge&labelColor=ffe4e1)](https://github.com/SaifMahmud366/facebook-sponsored-post-blocker/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-ffd1dc?style=for-the-badge&labelColor=ffe4e1)](./LICENSE)
[![Userscript](https://img.shields.io/badge/userscript-Tampermonkey%20%7C%20ScriptCat%20%7C%20Violentmonkey-ffb7c5?style=for-the-badge&labelColor=ffe4e1)](https://github.com/SaifMahmud366/facebook-sponsored-post-blocker)
[![Made with love](https://img.shields.io/badge/made%20with-%F0%9F%92%96%20and%20%E2%98%95-ffa5b8?style=for-the-badge&labelColor=ffe4e1)](#)

[**🚀 Install**](#-installation) · [**✨ Features**](#-features) · [**🧠 How it works**](#-how-it-works) · [**📖 Changelog**](./CHANGELOG.md)

</div>

---

## 🌷 What is this?

A **lightweight userscript** that hides sponsored posts from your Facebook feed, so your scroll stays clean and ad-free. It runs quietly in the background, catches sponsored posts the moment they appear, and tucks them out of sight. 🫧

> 🌱 No tracking. No data collection. No remote calls. Just a small script doing one job well.

---

## ✨ Features

| | |
|---|---|
| 🌸 | **Hides sponsored posts in real time** as you scroll |
| ⚡ | **Minimal CPU usage** — debounced MutationObserver, no busy loops |
| 🌐 | **Works on** `facebook.com` and `web.facebook.com` |
| 🪶 | **Zero dependencies** — pure vanilla JavaScript |
| 🔒 | **Fully local** — nothing leaves your browser |
| 🎀 | **Small, readable source** — read it, audit it, fork it |

---

## 🚀 Installation

### 1. Install a userscript manager

Pick your favorite — all three work perfectly:

| Manager | Browser | Link |
|---|---|---|
| 🐱 **ScriptCat** | Chrome, Edge, Firefox | [scriptcat.org](https://scriptcat.org/) |
| 🐵 **Tampermonkey** | Chrome, Edge, Firefox, Safari | [tampermonkey.net](https://www.tampermonkey.net/) |
| 🦊 **Violentmonkey** | Chrome, Edge, Firefox | [violentmonkey.github.io](https://violentmonkey.github.io/) |

### 2. Click to install the script

<div align="center">

### [💖 **Install Facebook Sponsored Post Blocker** 💖](https://raw.githubusercontent.com/SaifMahmud366/facebook-sponsored-post-blocker/main/fb_sponsored_post_blocker.user.js)

</div>

Your userscript manager will pop up a shiny install dialog. Hit **Install** — and that's it. 🎉

### 3. Open Facebook

Scroll your feed. Sponsored posts will quietly vanish. ✨

---

## 🧠 How it works

Facebook wraps the *"Sponsored"* label inside a link pointing to `/ads/about`. That URL shows up **only** on sponsored posts — never on regular ones.

The script:

1. 🔍 Finds every `a[href*="/ads/about"]` link on the page
2. 🪜 Walks up the DOM to the containing post (`div[role="article"]`)
3. 🙈 Sets `display: none` on it
4. 🏷️ Tags it with `data-ad-blocked="true"` so it's never reprocessed

A `MutationObserver` watches the DOM for new posts as you scroll, so anything that slips in later gets caught too. Everything is debounced to **200 ms** so it stays light even on a busy feed. 🍃

---

## 🛠️ Development

Want to tweak it or contribute? Easy:

```bash
# Clone
git clone https://github.com/SaifMahmud366/facebook-sponsored-post-blocker.git

# Edit the source
# fb_sponsored_post_blocker.user.js

# Test locally by installing the file into your userscript manager
