"use strict";
/**
 * Timeline UI
 * Visual timeline showing player progress through 2014/2025 levels
 *
 * Layout:
 * 2025 ●────●────●────●────●────●────●────●──→ SANTA MARX
 *                       ╲         ╲       ╲
 * 2014 ●────●────●───────●─────────●───────●
 */

var TimelineUI = {

    container: null,
    isVisible: false,

    // Timeline configuration
    config: {
        dotRadius: 12,
        lineWidth: 3,
        yearLabelWidth: 60,
        dotSpacing: 70,
        rowSpacing: 100,
        colors: {
            completed: '#ff7700',
            current: '#ffaa00',
            locked: '#444444',
            line: '#333333',
            flashbackLine: '#664400'
        }
    },

    // Flashback connections (St. Marx level → 2014 flashback)
    flashbackConnections: [
        { from: 'stapelweise', to: 'Mullberg2' },
        { from: 'betretenVerboten', to: 'absperrungen' },
        { from: 'letzteZugabe', to: 'derFluch' },
        { from: 'fortschrittWartet', to: 'panzerLevel' }
    ],

    /**
     * Initialize timeline UI
     */
    init: function() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'timeline-ui';
        this.container.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'display:none;flex-direction:column;align-items:center;justify-content:center;' +
            'background:rgba(0,0,0,0.95);font-family:Visitor,monospace;z-index:900;' +
            'overflow-y:auto;padding:20px;box-sizing:border-box;';
        document.body.appendChild(this.container);

        // Add styles
        var style = document.createElement('style');
        style.textContent = `
            #timeline-ui .timeline-title {
                font-size: 32px;
                color: #ff7700;
                margin-bottom: 30px;
                text-align: center;
            }
            #timeline-ui .timeline-container {
                position: relative;
                width: 100%;
                max-width: 800px;
                min-height: 300px;
            }
            #timeline-ui .timeline-row {
                display: flex;
                align-items: center;
                margin: 20px 0;
                position: relative;
            }
            #timeline-ui .year-label {
                font-size: 24px;
                color: #888;
                width: 60px;
                text-align: right;
                margin-right: 20px;
            }
            #timeline-ui .level-dots {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
            }
            #timeline-ui .level-dot {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                border: 3px solid transparent;
            }
            #timeline-ui .level-dot.completed {
                background: #ff7700;
                color: #000;
            }
            #timeline-ui .level-dot.current {
                background: #ffaa00;
                color: #000;
                animation: currentPulse 1.5s infinite;
                border-color: #fff;
            }
            #timeline-ui .level-dot.locked {
                background: #333;
                color: #666;
                cursor: not-allowed;
            }
            #timeline-ui .level-dot.unlocked {
                background: #555;
                color: #fff;
                border-color: #ff7700;
            }
            #timeline-ui .level-dot:hover:not(.locked) {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(255,119,0,0.5);
            }
            #timeline-ui .act-separator {
                width: 2px;
                height: 40px;
                background: #444;
                margin: 0 15px;
            }
            #timeline-ui .back-button {
                margin-top: 30px;
                padding: 15px 40px;
                font-size: 18px;
                font-family: Visitor, monospace;
                background: #555;
                color: #fff;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            }
            #timeline-ui .back-button:hover {
                background: #666;
            }
            #timeline-ui .santa-marx {
                font-size: 20px;
                color: #ff7700;
                margin-left: 20px;
            }
            #timeline-ui .level-tooltip {
                position: absolute;
                background: rgba(0,0,0,0.9);
                border: 1px solid #ff7700;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 14px;
                color: #fff;
                pointer-events: none;
                z-index: 1000;
                max-width: 200px;
            }
            @keyframes currentPulse {
                0%, 100% { box-shadow: 0 0 10px rgba(255,170,0,0.5); }
                50% { box-shadow: 0 0 20px rgba(255,170,0,0.8); }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Show the timeline
     */
    show: function() {
        if (!this.container) this.init();

        this.render();
        this.container.style.display = 'flex';
        this.isVisible = true;
    },

    /**
     * Hide the timeline
     */
    hide: function() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        this.isVisible = false;
    },

    /**
     * Render the timeline
     */
    render: function() {
        this.container.innerHTML = '';

        // Title
        var title = document.createElement('div');
        title.className = 'timeline-title';
        title.textContent = 'Timeline';
        this.container.appendChild(title);

        // Timeline container
        var timelineContainer = document.createElement('div');
        timelineContainer.className = 'timeline-container';
        this.container.appendChild(timelineContainer);

        // Get levels organized by year
        var levels2025 = [];
        var levels2014 = [];
        var levels2016 = [];

        if (typeof LevelRegistry !== 'undefined') {
            var allLevels = LevelRegistry.levels;
            for (var i = 0; i < allLevels.length; i++) {
                var lvl = allLevels[i];
                if (lvl.year === 2025) {
                    levels2025.push(lvl);
                } else if (lvl.year === 2014) {
                    levels2014.push(lvl);
                } else if (lvl.year === 2016) {
                    levels2016.push(lvl);
                }
            }
        }

        // Render 2025 row
        this.renderYearRow(timelineContainer, 2025, levels2025, true);

        // Render 2014 row
        this.renderYearRow(timelineContainer, 2014, levels2014.concat(levels2016), false);

        // Button container
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex;gap:20px;margin-top:30px;flex-wrap:wrap;justify-content:center;';

        // Reset progress button
        var that = this;
        var resetBtn = document.createElement('button');
        resetBtn.className = 'back-button';
        resetBtn.style.background = '#442222';
        resetBtn.style.fontSize = '14px';
        resetBtn.textContent = 'Fortschritt zurücksetzen';
        resetBtn.addEventListener('click', function() {
            if (confirm('Wirklich allen Fortschritt löschen?')) {
                if (typeof GameState !== 'undefined') {
                    GameState.reset();
                    that.render();
                }
            }
        });
        buttonContainer.appendChild(resetBtn);

        this.container.appendChild(buttonContainer);
    },

    /**
     * Start Fluch endless runner mode
     */
    startFluchMode: function() {
        this.hide();

        // Ensure canvas is visible
        var canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.style.display = 'block';
            canvas.style.opacity = '1';
        }

        // Hide mobile navigation
        if (typeof MobileNavigation !== 'undefined') {
            MobileNavigation.hide();
        }

        // Start Fluch game
        if (typeof FluchGame !== 'undefined') {
            game = new FluchGame();
            game.currentScroll = 0;
            game.level.start(game.machine);
        }
    },

    /**
     * Render a year row
     */
    renderYearRow: function(container, year, levels, isMainTimeline) {
        var row = document.createElement('div');
        row.className = 'timeline-row';

        // Year label
        var yearLabel = document.createElement('div');
        yearLabel.className = 'year-label';
        yearLabel.textContent = year;
        row.appendChild(yearLabel);

        // Level dots container
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'level-dots';

        var currentLevel = null;
        if (typeof GameState !== 'undefined') {
            currentLevel = GameState.getCurrentLevel();
        }

        var lastAct = -1;
        for (var i = 0; i < levels.length; i++) {
            var lvl = levels[i];

            // Add act separator
            if (lvl.act !== lastAct && lastAct !== -1) {
                var separator = document.createElement('div');
                separator.className = 'act-separator';
                dotsContainer.appendChild(separator);
            }
            lastAct = lvl.act;

            // Create level dot
            var dot = this.createLevelDot(lvl, currentLevel);
            dotsContainer.appendChild(dot);
        }

        // Add Santa Marx indicator for 2025 timeline
        if (isMainTimeline) {
            var santa = document.createElement('span');
            santa.className = 'santa-marx';
            santa.textContent = '→ SANTA MARX';
            dotsContainer.appendChild(santa);
        }

        row.appendChild(dotsContainer);
        container.appendChild(row);
    },

    /**
     * Create a level dot element
     */
    createLevelDot: function(lvl, currentLevel) {
        var dot = document.createElement('div');
        dot.className = 'level-dot';

        var isCompleted = false;
        var isUnlocked = false;
        var isCurrent = currentLevel === lvl.id;

        if (typeof GameState !== 'undefined') {
            isCompleted = GameState.isLevelCompleted(lvl.id);
            isUnlocked = GameState.isLevelUnlocked(lvl.id);
        }

        // Set state class
        if (isCurrent) {
            dot.classList.add('current');
        } else if (isCompleted) {
            dot.classList.add('completed');
        } else if (isUnlocked) {
            dot.classList.add('unlocked');
        } else {
            dot.classList.add('locked');
        }

        // Level number
        dot.textContent = lvl.number;

        // Click handler for unlocked levels
        if (isUnlocked || isCompleted) {
            var that = this;
            dot.addEventListener('click', function() {
                that.startLevel(lvl.id);
            });
            dot.addEventListener('touchstart', function(e) {
                e.preventDefault();
                that.startLevel(lvl.id);
            });
        }

        // Tooltip on hover
        var that = this;
        dot.addEventListener('mouseenter', function(e) {
            that.showTooltip(e.target, lvl);
        });
        dot.addEventListener('mouseleave', function() {
            that.hideTooltip();
        });

        return dot;
    },

    /**
     * Show tooltip for a level
     */
    showTooltip: function(element, lvl) {
        this.hideTooltip();

        var tooltip = document.createElement('div');
        tooltip.className = 'level-tooltip';
        tooltip.id = 'timeline-tooltip';

        var title = lvl.title || lvl.id;
        var actName = lvl.actName || ('Akt ' + lvl.act);

        tooltip.innerHTML = '<strong>' + title + '</strong><br>' +
            '<span style="color:#888;">' + actName + '</span>';

        if (lvl.introText) {
            tooltip.innerHTML += '<br><span style="color:#666;font-size:12px;">"' +
                lvl.introText.substring(0, 50) + (lvl.introText.length > 50 ? '...' : '') + '"</span>';
        }

        // Position tooltip
        var rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';

        this.container.appendChild(tooltip);
    },

    /**
     * Hide tooltip
     */
    hideTooltip: function() {
        var tooltip = document.getElementById('timeline-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    },

    /**
     * Start a level from timeline
     */
    startLevel: function(levelId) {
        this.hide();

        // Ensure canvas is visible and restored
        var canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.style.display = 'block';
            canvas.style.opacity = '1';
            canvas.style.position = '';
            canvas.style.left = '';
        }

        // Hide mobile navigation if present
        if (typeof MobileNavigation !== 'undefined') {
            MobileNavigation.hide();
        }

        // Hide any story screen that might be showing
        if (typeof StoryScreen !== 'undefined' && StoryScreen.isVisible) {
            StoryScreen.hide();
        }

        // Show mobile layout if on mobile
        if (typeof isMobileDevice !== 'undefined' && isMobileDevice && typeof mobileLayout !== 'undefined' && mobileLayout) {
            mobileLayout.show();
        }

        // Start the level
        if (typeof game !== 'undefined' && game.machine) {
            game.level = new FolderLevel(levelId);
            game.level.start(game.machine);
        } else {
            console.error('Cannot start level: game or machine not initialized');
        }
    }
};
