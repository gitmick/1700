"use strict";
/**
 * Story Screen
 * Full-screen narrative display system with tap-to-advance
 * Visual novel style text sequences
 */

var StoryScreen = {

    container: null,
    currentSequence: null,
    currentPageIndex: 0,
    callback: null,
    autoAdvanceTimer: null,
    isVisible: false,

    // Visual styles for different text types
    styles: {
        location: {
            fontSize: '48px',
            color: '#ff7700',
            textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
            animation: 'fadeIn'
        },
        headline: {
            fontSize: '28px',
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            animation: 'slideUp'
        },
        narrative: {
            fontSize: '20px',
            color: '#cccccc',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            animation: 'fadeIn'
        },
        title: {
            fontSize: '56px',
            color: '#ff7700',
            textShadow: '4px 4px 8px rgba(0,0,0,0.9)',
            fontWeight: 'bold',
            animation: 'scaleIn'
        },
        small: {
            fontSize: '16px',
            color: '#888888',
            animation: 'fadeIn'
        },
        quote: {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'italic',
            lineHeight: '1.6',
            maxWidth: '600px',
            animation: 'fadeIn'
        },
        attribution: {
            fontSize: '16px',
            color: '#ff7700',
            marginTop: '20px',
            animation: 'fadeIn'
        }
    },

    /**
     * Initialize the story screen system
     */
    init: function() {
        // Create main container
        this.container = document.createElement('div');
        this.container.id = 'story-screen';
        this.container.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'display:none;flex-direction:column;align-items:center;justify-content:center;' +
            'background:rgba(0,0,0,0.95);font-family:Visitor,monospace;' +
            'z-index:1000;transition:background 0.5s ease;';
        document.body.appendChild(this.container);

        // Add CSS animations
        this.addAnimationStyles();

        // Bind click/tap handler
        var that = this;
        this.container.addEventListener('click', function(e) {
            e.preventDefault();
            that.nextPage();
        });
        this.container.addEventListener('touchstart', function(e) {
            e.preventDefault();
            that.nextPage();
        });
    },

    /**
     * Add CSS keyframe animations
     */
    addAnimationStyles: function() {
        var style = document.createElement('style');
        style.textContent = `
            @keyframes storyFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes storySlideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes storyScaleIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes storyPulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            #story-screen.sepia {
                background: rgba(30, 20, 10, 0.95);
            }
            #story-screen .story-text {
                text-align: center;
                padding: 0 20px;
                max-width: 90%;
            }
            #story-screen .tap-hint {
                position: absolute;
                bottom: 40px;
                color: #555;
                font-size: 14px;
                animation: storyPulse 2s infinite;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Show a story sequence
     * @param {Object|Array} sequence - Sequence object with pages array, or just pages array
     * @param {Function} callback - Called when sequence completes
     */
    showSequence: function(sequence, callback) {
        // Handle both {pages:[...]} and direct [...] array
        if (Array.isArray(sequence)) {
            this.currentSequence = { pages: sequence };
        } else {
            this.currentSequence = sequence;
        }

        this.currentPageIndex = 0;
        this.callback = callback;
        this.show();
        this.showCurrentPage();
    },

    /**
     * Show the overlay
     */
    show: function() {
        if (this.container) {
            this.container.style.display = 'flex';
            this.isVisible = true;

            // Hide game elements
            var canvas = document.getElementById('canvas');
            if (canvas) canvas.style.opacity = '0.3';
            var mobileContainer = document.getElementById('mobile-container');
            if (mobileContainer) mobileContainer.style.opacity = '0.3';
        }
    },

    /**
     * Hide the overlay
     */
    hide: function() {
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }

        if (this.container) {
            this.container.style.display = 'none';
            this.container.classList.remove('sepia');
            this.isVisible = false;

            // Restore game elements
            var canvas = document.getElementById('canvas');
            if (canvas) canvas.style.opacity = '1';
            var mobileContainer = document.getElementById('mobile-container');
            if (mobileContainer) mobileContainer.style.opacity = '1';
        }

        this.currentSequence = null;
        this.currentPageIndex = 0;
    },

    /**
     * Show current page of the sequence
     */
    showCurrentPage: function() {
        if (!this.currentSequence || !this.currentSequence.pages) {
            this.complete();
            return;
        }

        var pages = this.currentSequence.pages;
        if (this.currentPageIndex >= pages.length) {
            this.complete();
            return;
        }

        var page = pages[this.currentPageIndex];
        this.renderPage(page);

        // Apply effects
        if (page.effect === 'sepia') {
            this.container.classList.add('sepia');
        }

        // Auto-advance if duration is set
        if (page.duration) {
            var that = this;
            this.autoAdvanceTimer = setTimeout(function() {
                that.nextPage();
            }, page.duration);
        }
    },

    /**
     * Render a single page
     */
    renderPage: function(page) {
        this.container.innerHTML = '';

        // Get style configuration
        var styleConfig = this.styles[page.style] || this.styles.narrative;

        // Create text element
        var textEl = document.createElement('div');
        textEl.className = 'story-text';
        textEl.textContent = page.text;

        // Apply styles
        textEl.style.fontSize = styleConfig.fontSize || '20px';
        textEl.style.color = styleConfig.color || '#ffffff';
        if (styleConfig.textShadow) textEl.style.textShadow = styleConfig.textShadow;
        if (styleConfig.fontStyle) textEl.style.fontStyle = styleConfig.fontStyle;
        if (styleConfig.fontWeight) textEl.style.fontWeight = styleConfig.fontWeight;
        if (styleConfig.lineHeight) textEl.style.lineHeight = styleConfig.lineHeight;
        if (styleConfig.maxWidth) textEl.style.maxWidth = styleConfig.maxWidth;
        if (styleConfig.marginTop) textEl.style.marginTop = styleConfig.marginTop;

        // Apply animation
        var animName = 'storyFadeIn';
        if (styleConfig.animation === 'slideUp') animName = 'storySlideUp';
        if (styleConfig.animation === 'scaleIn') animName = 'storyScaleIn';
        textEl.style.animation = animName + ' 0.5s ease forwards';

        this.container.appendChild(textEl);

        // Add tap hint (unless auto-advancing)
        if (!page.duration) {
            var hint = document.createElement('div');
            hint.className = 'tap-hint';
            hint.textContent = 'Tippe um fortzufahren';
            this.container.appendChild(hint);
        }
    },

    /**
     * Advance to next page
     */
    nextPage: function() {
        if (!this.isVisible) return;

        // Clear auto-advance timer
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }

        this.currentPageIndex++;
        this.showCurrentPage();
    },

    /**
     * Complete the sequence
     */
    complete: function() {
        console.log('StoryScreen.complete called');
        var cb = this.callback;
        this.hide();
        if (cb) {
            console.log('Calling StoryScreen callback');
            cb();
        }
    },

    /**
     * Show game intro sequence
     */
    showGameIntro: function(callback) {
        if (typeof StoryContent !== 'undefined' && StoryContent.gameIntro) {
            this.showSequence(StoryContent.gameIntro, callback);
        } else {
            // Fallback if StoryContent not loaded
            this.showSequence([
                { text: 'Wien, 2025', style: 'location', duration: 2000 },
                { text: 'Die 1700.', style: 'title', duration: 2000 },
                { text: 'Wien, 2014', style: 'location', effect: 'sepia', duration: 2000 }
            ], callback);
        }
    },

    /**
     * Show a quote
     */
    showQuote: function(zitat, callback) {
        if (!zitat) {
            if (callback) callback();
            return;
        }

        var sequence;
        if (typeof StoryContent !== 'undefined' && StoryContent.formatQuote) {
            sequence = StoryContent.formatQuote(zitat);
        } else {
            // Fallback formatting
            var attribution = '— ' + zitat.author;
            if (zitat.year) attribution += ', ' + zitat.year;
            sequence = {
                pages: [
                    { text: '"' + zitat.text + '"', style: 'quote' },
                    { text: attribution, style: 'attribution', duration: 2000 }
                ]
            };
        }

        this.showSequence(sequence, callback);
    },

    /**
     * Show level intro with enhanced formatting
     */
    showLevelIntro: function(levelData, callback) {
        var pages = [];

        // Add year/location if flashback
        if (levelData.isFlashback && levelData.year) {
            pages.push({
                text: 'Wien, ' + levelData.year,
                style: 'location',
                effect: 'sepia',
                duration: 2000
            });
        }

        // Add title
        if (levelData.title) {
            pages.push({
                text: levelData.title,
                style: 'headline',
                duration: 2000
            });
        }

        // Add intro text
        if (levelData.introText) {
            pages.push({
                text: levelData.introText,
                style: 'narrative'
            });
        }

        if (pages.length === 0) {
            if (callback) callback();
            return;
        }

        this.showSequence(pages, callback);
    },

    /**
     * Show flashback transition
     */
    showFlashbackTransition: function(fromLevel, toLevel, callback) {
        var transition = null;
        if (typeof StoryContent !== 'undefined') {
            transition = StoryContent.getFlashbackTransition(fromLevel, toLevel);
        }

        if (transition) {
            this.showSequence(transition, callback);
        } else {
            // Default flashback transition
            this.showSequence([
                { text: '...', style: 'narrative', duration: 1500 },
                { text: 'Wien, 2014', style: 'location', effect: 'sepia', duration: 2000 }
            ], callback);
        }
    },

    /**
     * Show act intro
     */
    showActIntro: function(actNumber, callback) {
        var intro = null;
        if (typeof StoryContent !== 'undefined') {
            intro = StoryContent.getActIntro(actNumber);
        }

        if (intro) {
            this.showSequence(intro, callback);
        } else if (callback) {
            callback();
        }
    },

    /**
     * Show game ending
     */
    showEnding: function(callback) {
        if (typeof StoryContent !== 'undefined' && StoryContent.ending) {
            this.showSequence(StoryContent.ending, callback);
        } else if (callback) {
            callback();
        }
    }
};
