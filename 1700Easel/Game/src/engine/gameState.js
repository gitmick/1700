"use strict";
/**
 * GameState Manager
 * Handles game progress persistence via cookies
 */

var GameState = {
    // Cookie name
    cookieName: '1700_game_state',

    // Default state
    defaultState: {
        completedLevels: [],
        unlockedLevels: ['buerstelDream'], // First level always unlocked
        collectedZitate: [],
        currentLevel: null,
        highestAct: 0,
        seenIntro: false,
        seenTutorials: [],
        lastCompletedAct: -1
    },

    // Current state in memory
    state: null,

    /**
     * Initialize state from cookie or defaults
     * Merges new default fields into existing saves
     */
    init: function() {
        var loaded = this.load();
        var defaults = this.getDefaultState();

        if (loaded) {
            // Merge: keep loaded values, add missing defaults
            this.state = defaults;
            for (var key in loaded) {
                if (loaded.hasOwnProperty(key)) {
                    this.state[key] = loaded[key];
                }
            }
        } else {
            this.state = defaults;
        }
    },

    /**
     * Get a fresh copy of default state
     */
    getDefaultState: function() {
        return JSON.parse(JSON.stringify(this.defaultState));
    },

    /**
     * Save state to cookie
     */
    save: function() {
        if (!this.state) return;

        var json = JSON.stringify(this.state);
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry

        document.cookie = this.cookieName + '=' + encodeURIComponent(json) +
            ';expires=' + expires.toUTCString() +
            ';path=/;SameSite=Strict';
    },

    /**
     * Load state from cookie
     */
    load: function() {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(this.cookieName + '=') === 0) {
                var json = decodeURIComponent(cookie.substring(this.cookieName.length + 1));
                try {
                    return JSON.parse(json);
                } catch (e) {
                    console.error('Failed to parse game state cookie:', e);
                    return null;
                }
            }
        }
        return null;
    },

    /**
     * Mark a level as completed
     */
    completeLevel: function(levelName) {
        if (!this.state) this.init();

        if (!this.isLevelCompleted(levelName)) {
            this.state.completedLevels.push(levelName);
        }

        // Unlock next level based on registry
        var nextLevel = LevelRegistry.getNextLevel(levelName);
        if (nextLevel) {
            this.unlockLevel(nextLevel);
        }

        // Update highest act
        var levelData = LevelRegistry.getLevel(levelName);
        if (levelData && levelData.act > this.state.highestAct) {
            this.state.highestAct = levelData.act;
        }

        this.save();
    },

    /**
     * Unlock a level
     */
    unlockLevel: function(levelName) {
        if (!this.state) this.init();

        if (!this.isLevelUnlocked(levelName)) {
            this.state.unlockedLevels.push(levelName);
            this.save();
        }
    },

    /**
     * Check if level is completed
     */
    isLevelCompleted: function(levelName) {
        if (!this.state) this.init();
        return this.state.completedLevels.indexOf(levelName) !== -1;
    },

    /**
     * Check if level is unlocked
     */
    isLevelUnlocked: function(levelName) {
        if (!this.state) this.init();
        return this.state.unlockedLevels.indexOf(levelName) !== -1;
    },

    /**
     * Collect a Zitat (quote)
     */
    collectZitat: function(zitatId) {
        if (!this.state) this.init();

        if (this.state.collectedZitate.indexOf(zitatId) === -1) {
            this.state.collectedZitate.push(zitatId);
            this.save();
        }
    },

    /**
     * Check if Zitat is collected
     */
    hasZitat: function(zitatId) {
        if (!this.state) this.init();
        return this.state.collectedZitate.indexOf(zitatId) !== -1;
    },

    /**
     * Set current level (for continue feature)
     */
    setCurrentLevel: function(levelName) {
        if (!this.state) this.init();
        this.state.currentLevel = levelName;
        this.save();
    },

    /**
     * Get current level
     */
    getCurrentLevel: function() {
        if (!this.state) this.init();
        return this.state.currentLevel;
    },

    /**
     * Get all completed levels
     */
    getCompletedLevels: function() {
        if (!this.state) this.init();
        return this.state.completedLevels;
    },

    /**
     * Get all unlocked levels
     */
    getUnlockedLevels: function() {
        if (!this.state) this.init();
        return this.state.unlockedLevels;
    },

    /**
     * Reset all progress
     */
    reset: function() {
        this.state = this.getDefaultState();
        this.save();
    },

    /**
     * Get progress percentage
     */
    getProgress: function() {
        if (!this.state) this.init();
        var total = LevelRegistry.getTotalLevels();
        if (total === 0) return 0;
        return Math.round((this.state.completedLevels.length / total) * 100);
    },

    /**
     * Check if game intro has been seen
     */
    hasSeenIntro: function() {
        if (!this.state) this.init();
        return this.state.seenIntro === true;
    },

    /**
     * Mark game intro as seen
     */
    setIntroSeen: function() {
        if (!this.state) this.init();
        this.state.seenIntro = true;
        this.save();
    },

    /**
     * Check if a tutorial hint has been seen
     */
    hasTutorialSeen: function(hintId) {
        if (!this.state) this.init();
        if (!this.state.seenTutorials) this.state.seenTutorials = [];
        return this.state.seenTutorials.indexOf(hintId) !== -1;
    },

    /**
     * Mark a tutorial hint as seen
     */
    setTutorialSeen: function(hintId) {
        if (!this.state) this.init();
        if (!this.state.seenTutorials) this.state.seenTutorials = [];
        if (this.state.seenTutorials.indexOf(hintId) === -1) {
            this.state.seenTutorials.push(hintId);
            this.save();
        }
    },

    /**
     * Get last completed act number
     */
    getLastCompletedAct: function() {
        if (!this.state) this.init();
        return this.state.lastCompletedAct || -1;
    },

    /**
     * Set last completed act (for quote display tracking)
     */
    setLastCompletedAct: function(actNumber) {
        if (!this.state) this.init();
        if (!this.state.lastCompletedAct || actNumber > this.state.lastCompletedAct) {
            this.state.lastCompletedAct = actNumber;
            this.save();
        }
    },

    /**
     * Check if quote should be shown for this act
     * (shown once when act is first completed)
     */
    shouldShowQuoteForAct: function(actNumber) {
        if (!this.state) this.init();
        var lastAct = this.state.lastCompletedAct || -1;
        return actNumber > lastAct;
    }
};
