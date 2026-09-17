// ==UserScript==
// @name         Facebook Sponsored Post Blocker
// @namespace    http://tampermonkey.net/
// @version      2.0
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

    // Facebook wraps the "Ad"/"Sponsored" label in a link to this URL.
    // That URL appears ONLY on sponsored posts.
    const AD_LINK_SELECTOR = 'a[href*="/ads/about"]';

    function hideAdPosts(root = document) {
        root.querySelectorAll(AD_LINK_SELECTOR).forEach(link => {
            // Walk up to the containing post
            const post = link.closest('div[role="article"]');
            if (!post || post.dataset.adBlocked) return;

            post.style.display = 'none';
            post.dataset.adBlocked = 'true';
            console.log('[FB AdBlock] Hid sponsored post', post);
        });
    }

    // Debounced runner
    let timer = null;
    function schedule() {
        if (timer) return;
        timer = setTimeout(() => {
            timer = null;
            hideAdPosts();
        }, 200);
    }

    hideAdPosts();
    new MutationObserver(schedule).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
