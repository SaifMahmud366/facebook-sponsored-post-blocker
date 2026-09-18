// ==UserScript==
// @name         Facebook Sponsored Post Blocker
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hides sponsored posts of Facebook.
// @author       Saif Mahmud
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/SaifMahmud366/facebook-sponsored-post-blocker/main/fb_sponsored_post_blocker.user.js
// @updateURL    https://raw.githubusercontent.com/SaifMahmud366/facebook-sponsored-post-blocker/main/fb_sponsored_post_blocker.user.js
// ==/UserScript==

/*
 * See CHANGELOG.md in the repository for version history:
 * https://github.com/SaifMahmud366/facebook-sponsored-post-blocker/blob/main/CHANGELOG.md
 */

(function () {
    'use strict';

    // ─── Hardcoded defaults ───────────────────────────────────────────
    const DEFAULT_CONFIG = {
        adLinkPatterns: [
            '/ads/about',
            '/ad/preferences',
            '/business/help',
            '/ads/',
            '/help/ads',
            '/ad/',
            '/privacy/ads',
        ],
        adLabelTexts: [
            'Ad', 'Sponsored',
            'Gesponsert', 'Anzeige',
            'Sponsorisé', 'Commandité',
            'Patrocinado', 'Anuncio',
            'Sponsorizzato', 'Sponsorizzata',
            'প্রযোজিত', 'বিজ্ঞাপন',
            'प्रायोजित',
            '광고', '広告', '赞助', '贊助',
        ],
        geometry: {
            minWidth: 400,
            maxWidth: 900,
            minHeight: 150,
        },
        behavior: {
            debug: true,
            debounceMs: 150,
        },
    };

    const CONFIG_URL =
        'https://raw.githubusercontent.com/SaifMahmud366/facebook-sponsored-post-blocker/main/patterns.json';

    // Live config — starts as a deep copy of defaults, gets patched by remote
    let CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    const log = (...a) =>
        CONFIG.behavior.debug && console.log('[FB AdBlock]', ...a);

    // ─── Remote config loader ─────────────────────────────────────────
    async function loadRemoteConfig() {
        try {
            const res = await fetch(CONFIG_URL + '?t=' + Date.now(), {
                cache: 'no-store',
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const remote = await res.json();

            CONFIG = {
                ...CONFIG,
                ...remote,
                geometry: { ...CONFIG.geometry, ...(remote.geometry || {}) },
                behavior: { ...CONFIG.behavior, ...(remote.behavior || {}) },
            };
            log('remote config loaded:', CONFIG);
        } catch (e) {
            log('remote config unavailable, using defaults:', e.message);
        }
    }

    // ─── Card detection ───────────────────────────────────────────────
    function findPostCard(signalEl) {
        const { minWidth, maxWidth, minHeight } = CONFIG.geometry;
        let node = signalEl.parentElement;

        for (let i = 0; i < 25 && node && node !== document.body; i++) {
            const r = node.getBoundingClientRect();
            if (r.width >= minWidth && r.width <= maxWidth && r.height >= minHeight) {
                return node;
            }
            node = node.parentElement;
        }
        return null;
    }

    function looksLikePost(el) {
        if (el.querySelector('img, video')) return true;
        if ((el.textContent || '').length > 40) return true;
        return false;
    }

    // ─── Signal 1: ad-link hrefs ──────────────────────────────────────
    function findAdAnchors() {
        if (!CONFIG.adLinkPatterns.length) return [];
        const sel = CONFIG.adLinkPatterns
            .map(p => `a[href*="${p}"]`)
            .join(',');
        return [...document.querySelectorAll(sel)];
    }

    // ─── Signal 2: small leaf spans with ad label text ────────────────
    function findAdLabelSpans() {
        if (!CONFIG.adLabelTexts.length) return [];
        const wanted = new Set(CONFIG.adLabelTexts);
        const results = [];
        for (const s of document.querySelectorAll('span')) {
            if (s.children.length > 0) continue;
            const t = (s.textContent || '').trim();
            if (!wanted.has(t)) continue;
            const r = s.getBoundingClientRect();
            if (r.width > 120 || r.height > 30) continue;
            results.push(s);
        }
        return results;
    }

    // ─── Main pass ────────────────────────────────────────────────────
    function hideAdPosts() {
        let count = 0;
        const seen = new Set();

        // Primary: href-based
        for (const anchor of findAdAnchors()) {
            const card = findPostCard(anchor);
            if (!card || seen.has(card) || card.dataset.adBlocked) continue;
            if (!looksLikePost(card)) {
                log('skipped shell:', card);
                continue;
            }
            card.style.display = 'none';
            card.dataset.adBlocked = 'true';
            seen.add(card);
            count++;
            log('hid via href:', card);
        }

        // Fallback: only if primary found nothing
        if (count === 0) {
            for (const span of findAdLabelSpans()) {
                const card = findPostCard(span);
                if (!card || seen.has(card) || card.dataset.adBlocked) continue;
                if (!looksLikePost(card)) continue;
                card.style.display = 'none';
                card.dataset.adBlocked = 'true';
                seen.add(card);
                count++;
                log('hid via label fallback:', card);
            }
        }

        if (count) log(`hid ${count} post(s) this pass`);
    }

    // ─── Debounced scheduling ─────────────────────────────────────────
    let timer = null;
    function schedule() {
        if (timer) return;
        timer = setTimeout(() => {
            timer = null;
            hideAdPosts();
        }, CONFIG.behavior.debounceMs);
    }

    // ─── Bootstrap ────────────────────────────────────────────────────
    function startObserver() {
        new MutationObserver(schedule).observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
        log('observer installed');
    }

    function start() {
        // Run immediately with defaults so ads are hidden ASAP
        hideAdPosts();

        // Load remote config, then re-run with the latest patterns
        loadRemoteConfig().then(() => hideAdPosts());

        startObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
