"use strict";
/**
 * Overlay Manager
 * Shows tweets, images, and other content during gameplay
 * Works on both desktop and mobile with responsive layout
 *
 * Usage in level.js:
 *   OverlayManager.showImage('path/to/image.png', { duration: 3000 });
 *   OverlayManager.showTweet({ name: 'User', handle: 'user', text: '...' });
 *   OverlayManager.showOnTrigger(triggerName, 'path/to/image.png');
 */

var OverlayManager = {

    container: null,
    currentOverlay: null,
    fadeTimer: null,
    pendingTriggers: [],

    /**
     * Initialize the overlay system
     */
    init: function() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'game-overlay';
        document.body.appendChild(this.container);

        // Add responsive styles
        var style = document.createElement('style');
        style.textContent = `
            #game-overlay {
                position: fixed;
                display: none;
                justify-content: center;
                align-items: flex-start;
                z-index: 800;
                pointer-events: none;
            }
            /* Desktop: positioned in top-left like assets */
            @media (min-width: 769px) {
                #game-overlay {
                    top: 20px;
                    left: 120px;
                    width: auto;
                    max-width: 300px;
                }
            }
            /* Mobile: full width at top */
            @media (max-width: 768px) {
                #game-overlay {
                    top: 70px;
                    left: 0;
                    right: 0;
                    width: 100%;
                    padding: 10px;
                    box-sizing: border-box;
                }
            }
            #game-overlay .overlay-content {
                background: rgba(255, 255, 255, 0.98);
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                overflow: hidden;
                animation: overlaySlideIn 0.3s ease;
            }
            @media (max-width: 768px) {
                #game-overlay .overlay-content {
                    width: 100%;
                }
            }
            #game-overlay .overlay-content img {
                display: block;
                max-width: 100%;
                height: auto;
            }
            #game-overlay .overlay-content.fading {
                animation: overlayFadeOut 0.5s ease forwards;
            }
            #game-overlay .tweet-content {
                padding: 15px;
                font-family: system-ui, -apple-system, sans-serif;
            }
            #game-overlay .tweet-header {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            #game-overlay .tweet-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
            }
            #game-overlay .tweet-name {
                font-weight: bold;
                color: #000;
            }
            #game-overlay .tweet-handle {
                color: #666;
                font-size: 14px;
            }
            #game-overlay .tweet-text {
                font-size: 16px;
                line-height: 1.4;
                color: #000;
            }
            #game-overlay .tweet-image {
                margin-top: 10px;
                border-radius: 8px;
            }
            @keyframes overlaySlideIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes overlayFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Show an image overlay
     * @param {string} imagePath - Path to image
     * @param {Object} options - { duration: ms, fadeTime: ms, position: {x, y} }
     */
    showImage: function(imagePath, options) {
        options = options || {};
        var duration = options.duration || 3000;
        var fadeTime = options.fadeTime || 500;

        this.init();
        this.hide();

        var content = document.createElement('div');
        content.className = 'overlay-content';

        var img = document.createElement('img');
        img.src = imagePath;
        content.appendChild(img);

        this.container.innerHTML = '';
        this.container.appendChild(content);
        this.container.style.display = 'flex';
        this.currentOverlay = content;

        // Custom position for desktop
        if (options.position && window.innerWidth > 768) {
            this.container.style.left = options.position.x + 'px';
            this.container.style.top = options.position.y + 'px';
        }

        var that = this;
        this.fadeTimer = setTimeout(function() {
            that.fadeOut(fadeTime);
        }, duration);
    },

    /**
     * Show a tweet-style overlay
     * @param {Object} tweetData - { name, handle, text, avatar?, image? }
     * @param {Object} options - { duration: ms, fadeTime: ms }
     */
    showTweet: function(tweetData, options) {
        options = options || {};
        var duration = options.duration || 4000;
        var fadeTime = options.fadeTime || 500;

        this.init();
        this.hide();

        var content = document.createElement('div');
        content.className = 'overlay-content tweet-content';

        // Header with avatar and user info
        var header = document.createElement('div');
        header.className = 'tweet-header';

        if (tweetData.avatar) {
            var avatar = document.createElement('img');
            avatar.className = 'tweet-avatar';
            avatar.src = tweetData.avatar;
            header.appendChild(avatar);
        }

        var userInfo = document.createElement('div');
        userInfo.innerHTML =
            '<div class="tweet-name">' + (tweetData.name || 'User') + '</div>' +
            '<div class="tweet-handle">@' + (tweetData.handle || 'user') + '</div>';
        header.appendChild(userInfo);
        content.appendChild(header);

        // Tweet text
        var text = document.createElement('div');
        text.className = 'tweet-text';
        text.textContent = tweetData.text || '';
        content.appendChild(text);

        // Optional image
        if (tweetData.image) {
            var img = document.createElement('img');
            img.className = 'tweet-image';
            img.src = tweetData.image;
            content.appendChild(img);
        }

        this.container.innerHTML = '';
        this.container.appendChild(content);
        this.container.style.display = 'flex';
        this.currentOverlay = content;

        var that = this;
        this.fadeTimer = setTimeout(function() {
            that.fadeOut(fadeTime);
        }, duration);
    },

    /**
     * Show content when a game trigger fires
     * @param {string} triggerName - Event trigger name (e.g. ADD_POLICEMEN_FINISHED)
     * @param {string} imagePath - Path to image to show
     * @param {Object} options - Display options
     */
    showOnTrigger: function(triggerName, imagePath, options) {
        var that = this;
        var handler = {
            bang: function(name) {
                that.showImage(imagePath, options);
                // Remove trigger after firing once
                A.bus.removeTrigger(triggerName, handler);
            }
        };
        A.bus.addTrigger(triggerName, handler);
        this.pendingTriggers.push({ name: triggerName, handler: handler });
    },

    /**
     * Show tweet when a game trigger fires
     * @param {string} triggerName - Event trigger name
     * @param {Object} tweetData - Tweet content
     * @param {Object} options - Display options
     */
    showTweetOnTrigger: function(triggerName, tweetData, options) {
        var that = this;
        var handler = {
            bang: function(name) {
                that.showTweet(tweetData, options);
                A.bus.removeTrigger(triggerName, handler);
            }
        };
        A.bus.addTrigger(triggerName, handler);
        this.pendingTriggers.push({ name: triggerName, handler: handler });
    },

    /**
     * Fade out current overlay
     */
    fadeOut: function(duration) {
        if (!this.currentOverlay) return;

        this.currentOverlay.classList.add('fading');

        var that = this;
        setTimeout(function() {
            that.hide();
        }, duration || 500);
    },

    /**
     * Immediately hide overlay
     */
    hide: function() {
        if (this.fadeTimer) {
            clearTimeout(this.fadeTimer);
            this.fadeTimer = null;
        }

        if (this.container) {
            this.container.style.display = 'none';
            this.container.innerHTML = '';
            // Reset position for next overlay
            this.container.style.left = '';
            this.container.style.top = '';
        }
        this.currentOverlay = null;
    },

    /**
     * Clean up all pending triggers (call when level ends)
     */
    cleanup: function() {
        this.hide();
        for (var i = 0; i < this.pendingTriggers.length; i++) {
            var t = this.pendingTriggers[i];
            A.bus.removeTrigger(t.name, t.handler);
        }
        this.pendingTriggers = [];
    },

    /**
     * Check if overlay is currently visible
     */
    isVisible: function() {
        return this.currentOverlay !== null;
    }
};
